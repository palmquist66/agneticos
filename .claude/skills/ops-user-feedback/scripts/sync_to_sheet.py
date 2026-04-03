#!/usr/bin/env python3
"""
Sync local feedback-log.md → Google Sheet (bidirectional push).

Reads the local markdown feedback log, compares with the Google Sheet,
and pushes new entries + status/resolution updates.

Usage:
    uv run --with gspread --with google-auth scripts/sync_to_sheet.py

Requires:
    - Service account JSON at ~/PycharmProjects/SGP Correlations NBA/credentials.json
    - Sheet shared with sgp-updater@sgp-model.iam.gserviceaccount.com (Editor)
"""

import re
import sys
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

# --- Config ---
CREDENTIALS_PATH = Path.home() / "PycharmProjects" / "SGP Correlations NBA" / "credentials.json"
SHEET_ID = "1LWZGHevmHW7IH7b_JvQ8cOx0futSw29Pjj9JIE7Zi1Y"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

# Path relative to the betbro client root
SCRIPT_DIR = Path(__file__).resolve().parent
# scripts/ -> ops-user-feedback/ -> skills/ -> .claude/ -> betbro/
CLIENT_ROOT = SCRIPT_DIR.parent.parent.parent.parent
FEEDBACK_LOG = CLIENT_ROOT / "projects" / "ops-feedback" / "feedback-log.md"

# Column mapping: local log columns → sheet columns
# Sheet: Date, Tester, Issue Type, Player, Sport, Stat, Description, Expected, Actual, Priority, Status, Resolution(col L)
# Local: ID, Date, Source, Category, Priority, Status, Description, Resolution


def parse_feedback_log(path: Path) -> list[dict]:
    """Parse the markdown table in feedback-log.md into a list of dicts."""
    text = path.read_text()
    entries = []

    for line in text.strip().split("\n"):
        line = line.strip()
        # Skip non-table lines and header/separator rows
        if not line.startswith("|") or line.startswith("| ID") or line.startswith("|-"):
            continue

        cols = [c.strip() for c in line.split("|")[1:-1]]  # strip empty first/last from split
        if len(cols) < 8:
            continue

        entries.append({
            "id": cols[0].strip(),
            "date": cols[1].strip(),
            "source": cols[2].strip(),
            "category": cols[3].strip(),
            "priority": cols[4].strip(),
            "status": cols[5].strip(),
            "description": cols[6].strip(),
            "resolution": cols[7].strip(),
        })

    return entries


def normalize_status(status: str) -> str:
    """Normalize local status to sheet-friendly format."""
    mapping = {
        "new": "Open",
        "triaged": "Open",
        "in-progress": "In Progress",
        "fixed": "Fixed",
        "verified": "Fixed",
        "closed": "Fixed",
        "won't-fix": "Won't Fix",
    }
    return mapping.get(status.lower(), status.title())


def normalize_category(category: str) -> str:
    """Normalize local category to sheet-friendly Issue Type."""
    mapping = {
        "bug": "Bug",
        "feature-request": "Feature Request",
        "ux": "UX",
        "performance": "Performance",
        "content": "Content",
    }
    return mapping.get(category.lower(), category.title())


def get_sheet_rows(worksheet) -> list[list[str]]:
    """Get all rows from the sheet (excluding header)."""
    all_values = worksheet.get_all_values()
    if len(all_values) <= 1:
        return []
    return all_values[1:]  # skip header


def find_matching_row(entry: dict, sheet_rows: list[list[str]]) -> int | None:
    """Find the sheet row index (0-based, data only) that matches a local entry.

    Matches on description similarity — checks if the core description words overlap.
    """
    entry_desc = entry["description"].lower()
    entry_words = set(re.findall(r'\w+', entry_desc))

    for i, row in enumerate(sheet_rows):
        if len(row) < 7:
            continue
        # Build sheet description from cols: Player(3) + Description(6)
        sheet_desc = f"{row[3]} {row[6]}".lower()
        sheet_words = set(re.findall(r'\w+', sheet_desc))

        # Check overlap — if 60%+ of the local entry's significant words match, it's the same item
        if not entry_words:
            continue
        significant_words = entry_words - {"the", "a", "an", "is", "was", "for", "on", "in", "no", "not"}
        if not significant_words:
            continue
        overlap = significant_words & sheet_words
        if len(overlap) / len(significant_words) >= 0.5:
            return i

    return None


def sync(dry_run: bool = False):
    """Main sync: push local feedback log changes to Google Sheet."""
    if not CREDENTIALS_PATH.exists():
        print(f"ERROR: Credentials not found at {CREDENTIALS_PATH}")
        sys.exit(1)

    if not FEEDBACK_LOG.exists():
        print(f"ERROR: Feedback log not found at {FEEDBACK_LOG}")
        sys.exit(1)

    # Auth and open sheet
    creds = Credentials.from_service_account_file(str(CREDENTIALS_PATH), scopes=SCOPES)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SHEET_ID)
    worksheet = sh.sheet1

    # Parse local log
    local_entries = parse_feedback_log(FEEDBACK_LOG)
    if not local_entries:
        print("No entries in local feedback log.")
        return

    # Get sheet state
    sheet_rows = get_sheet_rows(worksheet)
    print(f"Local: {len(local_entries)} entries | Sheet: {len(sheet_rows)} rows")

    updates = 0
    new_rows = 0

    for entry in local_entries:
        match_idx = find_matching_row(entry, sheet_rows)

        if match_idx is not None:
            # Existing row — check if status or resolution changed
            row = sheet_rows[match_idx]
            sheet_row_num = match_idx + 2  # +1 for header, +1 for 1-based indexing

            current_status = row[10] if len(row) > 10 else ""
            new_status = normalize_status(entry["status"])

            current_resolution = row[11] if len(row) > 11 else ""
            new_resolution = entry["resolution"] if entry["resolution"] != "—" else ""

            needs_update = False

            if current_status.lower() != new_status.lower():
                needs_update = True
                if not dry_run:
                    worksheet.update_cell(sheet_row_num, 11, new_status)  # col K = Status
                print(f"  #{entry['id']}: status {current_status} → {new_status}")

            if new_resolution and current_resolution.strip() != new_resolution.strip():
                needs_update = True
                if not dry_run:
                    worksheet.update_cell(sheet_row_num, 12, new_resolution)  # col L = Resolution
                print(f"  #{entry['id']}: resolution updated")

            if needs_update:
                updates += 1
        else:
            # New row — append to sheet
            # Extract player/sport from description if possible
            desc = entry["description"]
            player = ""
            sport = ""

            # Try to extract "PlayerName Sport —" pattern
            match = re.match(r'^(.+?)\s+(NBA|NHL|MLB|NFL|NCAA)\s*[—-]\s*(.+)$', desc)
            if match:
                player = match.group(1)
                sport = match.group(2)
                desc = match.group(3)

            new_row = [
                entry["date"],                          # Date
                entry["source"].replace(" (google-sheet)", ""),  # Tester
                normalize_category(entry["category"]),  # Issue Type
                player,                                 # Player
                sport,                                  # Sport
                "",                                     # Stat
                desc,                                   # Description
                "",                                     # Expected
                "",                                     # Actual
                entry["priority"].title(),              # Priority
                normalize_status(entry["status"]),      # Status
                entry["resolution"] if entry["resolution"] != "—" else "",  # Resolution
            ]

            if not dry_run:
                worksheet.append_row(new_row, value_input_option="USER_ENTERED")
            print(f"  #{entry['id']}: NEW → {desc[:60]}")
            new_rows += 1

    print(f"\nDone: {updates} updated, {new_rows} new rows added" + (" (dry run)" if dry_run else ""))


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    sync(dry_run=dry_run)
