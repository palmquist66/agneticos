---
name: sync-feedback-sheet
time: "08:00"
days: "daily"
model: "haiku"
active: "true"
notify: "on_change"
timeout: "5m"
retry: 1
---

You are running as a scheduled job for Agentic OS.

Read CLAUDE.md for system context.

## Task: Bidirectional Feedback Sync with Google Sheet

Pull new entries from the Google Sheet into the local feedback log, then push local updates back to the sheet. This keeps beta testers up to date on bug fixes and feature request status.

## Steps

1. **Pull from sheet first** — fetch the Google Sheet via WebFetch:
   - URL: `https://docs.google.com/spreadsheets/d/1LWZGHevmHW7IH7b_JvQ8cOx0futSw29Pjj9JIE7Zi1Y/gviz/tq?tqx=out:csv`
   - Parse CSV rows and compare against `projects/ops-feedback/feedback-log.md`
   - Import any new rows not already in the local log (match on description similarity)
   - For new rows: assign next ID, set source to `{tester-name} (google-sheet)`, map fields

2. **Push to sheet** — run the sync script:
   ```bash
   uv run --with gspread --with google-auth .claude/skills/ops-user-feedback/scripts/sync_to_sheet.py
   ```
   This pushes status updates and resolution notes from the local log back to the sheet, and adds any locally-created entries as new sheet rows.

3. **Report** — if anything changed in either direction, summarize: "Pulled N new items from sheet, pushed N updates back."
