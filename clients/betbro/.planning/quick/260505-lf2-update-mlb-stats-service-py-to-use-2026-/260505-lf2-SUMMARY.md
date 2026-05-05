---
phase: quick
plan: 260505-lf2
subsystem: backend/stats
tags: [mlb, stats, database, 2026-season]
dependency_graph:
  requires: [sync_mlb.py, DB game logs]
  provides: [MLB L5/L10 from 2026 DB data]
  affects: [prop_router.py, MLB prop cards]
tech_stack:
  added: []
  patterns: [DB game log query, integer FK join, season data merging]
key_files:
  created: []
  modified:
    - /Users/jamespalmquist/PycharmProjects/propread-web/backend/services/stats_service.py
decisions:
  - "Use integer FK join (PlayerGameStats.game_id == Game.id) for MLB, not string cast join used by NBA/NHL"
  - "Merge DB L5/L10 with ESPN mlb_context to preserve game info, probable pitchers, opener detection"
  - "Try 2026 season first across all MLB API calls, fall back to 2025 if no data found"
metrics:
  duration_seconds: 407
  tasks_completed: 1
  files_modified: 1
  commit_count: 1
  completed_at: "2026-05-05T20:35:32Z"
---

# Quick Task 260505-lf2: Update MLB Stats Service to Use 2026 Season Data

**One-liner:** MLB props now compute L5/L10 from real 2026 DB game logs instead of bypassing to stale 2025 season averages.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace MLB early-season bypass with DB game log query + merge mlb_context | 16d4d1f | backend/services/stats_service.py |

## What Changed

### Before
- MLB stats bypassed DB game logs entirely with an "early season" gate
- Always fell back to 2025 season averages from ESPN API
- L5/L10 trends were meaningless for MLB props despite 6+ weeks of 2026 game data in the database
- All season labels said "2025 season"

### After
- MLB stats query last 10 games from DB using correct integer FK join: `PlayerGameStats.game_id == Game.id`
- Filter by `Game.season == "2026"` to get current season data
- Compute L5/L10 averages from real game-by-game stat values
- Merge DB-computed L5/L10 with ESPN's mlb_context (game info, probable pitchers, opener detection)
- Fall back to ESPN-only when no DB game logs exist (new players, insufficient data)
- All API calls try 2026 first, fall back to 2025 if no data
- All season labels now say "2026 season"

### Technical Details

**Join difference (critical):**
- NBA/NHL: `cast(PlayerGameStats.game_id, String) == Game.nba_game_id` (string comparison)
- MLB: `PlayerGameStats.game_id == Game.id` (integer FK, standard join)

Why? MLB's `sync_mlb.py` stores `Game.id` (auto-increment integer) in `PlayerGameStats.game_id`, not the `nba_game_id` string. Using the wrong join would return zero results.

**Stat name mapping:**
Applied existing `MLB_STAT_MAP` to translate prop stat names (e.g., "runs") to DB column names (e.g., "runs_scored") before querying.

**Context preservation:**
The ESPN fetch still runs to get `mlb_context` (opponent, game time, probable pitchers, opener detection). DB-only path would lose this context, breaking prop_router.py's game info display.

## Verification Results

All automated checks passed:
- ✅ Early-season bypass removed
- ✅ Integer FK join `PlayerGameStats.game_id == Game.id` present
- ✅ 2026 season filter `Game.season == "2026"` present
- ✅ All "2025 season" labels replaced with "2026 season"
- ✅ Valid Python syntax

## Deviations from Plan

None — plan executed exactly as written.

## Known Limitations

- If a player has no 2026 game logs in the DB (new call-up, insufficient data), falls back to ESPN season stats
- Opener detection still relies on 2026 API stats; if unavailable, falls back to 2025 for GS/GP ratio check
- Season stats (ERA, AVG, etc.) come from MLB API; if 2026 returns empty splits, falls back to 2025

These are intentional fallback behaviors to ensure the system degrades gracefully rather than breaking.

## Impact

**Before this change:**
- Aaron Judge prop for "home runs" → L5/L10 based on 2025 season average (stale, irrelevant)
- Database full of 2026 game data → ignored

**After this change:**
- Aaron Judge prop for "home runs" → L5 = average of last 5 games from DB, L10 = average of last 10 games
- Real trending data: hot streaks, cold streaks, recent form all visible
- Still gets game info, probable pitcher, opener detection from mlb_context

## Self-Check: PASSED

✅ Modified file exists: `/Users/jamespalmquist/PycharmProjects/propread-web/backend/services/stats_service.py`
✅ Commit exists: `16d4d1f`
✅ File is valid Python (verified via ast.parse)
✅ All verification assertions passed
