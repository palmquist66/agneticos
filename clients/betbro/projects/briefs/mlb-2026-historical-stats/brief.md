---
project: mlb-2026-historical-stats
status: active
level: 2
created: 2026-04-02
---

# MLB 2026 Historical Stats for BetBro

## Goal
Add full 2026 MLB game-by-game data pipeline to BetBro so prop analysis uses real L5/L10 averages, team matchup context, and injury data — instead of relying on 2025 season baselines via ESPN fallback.

## Current State
- BetBro app lives at `/Users/jamespalmquist/PycharmProjects/propread-web/`
- MLB props, odds, frontend, and Claude prompts **already work** via ESPN fallback (2025 season stats)
- Database (`sgp_analytics.db`) has **zero MLB records** — no teams, players, or games
- Daily sync (`sync-daily-stats.sh`) handles NBA/NHL only, runs from the SGP Correlations NBA project
- `team_stats_service.py` returns `None` for non-NBA sports
- `injury_service.py` returns `[]` for non-NBA sports
- MLB Stats API (`statsapi.mlb.com`) is free, no key required — already used for probable pitcher lookups

## Deliverables

### 1. MLB Data Sync Script
- [ ] `backend/sync_mlb.py` — standalone script that:
  - Fetches yesterday's completed MLB games from MLB Stats API
  - Inserts/updates Team records for all 30 MLB teams (conference = "MLB")
  - Inserts/updates Player records for all players who appeared
  - Inserts PlayerGameStats rows with MLB-relevant stats mapped to existing columns:
    - **Batters:** hits→points slot isn't right, need proper mapping. Use: hits, home_runs, total_bases, rbis, runs, stolen_bases, walks, singles, doubles, at_bats, strikeouts (as batter K)
    - **Pitchers:** strikeouts, earned_runs, innings_pitched, hits_allowed, walks_allowed, outs_recorded
  - Handles the column mapping problem (current schema is NBA-centric with `points`, `rebounds`, etc.)
- [ ] Backfill mode: `--backfill` flag to pull all 2026 games from Opening Day through yesterday

### 2. Schema Consideration
- Current `PlayerGameStats` columns are NBA-named (`points`, `rebounds`, `assists`, etc.)
- Options: (a) add MLB-specific columns, (b) repurpose existing columns with a sport-aware mapping layer, or (c) create a separate MLB stats table
- Decision needed before building

### 3. MLB Team Stats Service
- [ ] Add MLB team ESPN IDs to `team_stats_service.py`
- [ ] `get_mlb_team_stats()` — fetch team batting/pitching stats (runs/game, ERA, WHIP, K rate, OBP allowed)
- [ ] `get_mlb_pace_context()` — runs/game as pace equivalent
- [ ] `get_mlb_defensive_context()` — opponent pitching staff quality for batter props, opponent batting stats for pitcher props
- [ ] Wire into `prop_router.py` alongside existing NBA/NCAAB blocks

### 4. MLB Injury Service
- [ ] Add MLB team ESPN IDs to `injury_service.py`
- [ ] Extend `get_team_injuries()` to handle `sport="mlb"` via ESPN MLB injuries API
- [ ] Wire into `prop_router.py` injury context block

### 5. Integration
- [ ] Update `sync-daily-stats.sh` to call MLB sync after NBA/NHL sync
- [ ] Update `stats_service.py` to query MLB game logs for L5/L10 (instead of ESPN fallback) when DB records exist
- [ ] Add MLB coin flip detection to `prop_router.py`

## Acceptance Criteria
- Searching "Aaron Judge hits" returns L5/L10 from real 2026 game logs (not "2025 season" fallback)
- Team matchup context appears for MLB props (e.g., "Yankees rank 3rd in team batting average")
- MLB injuries show in prop cards when relevant
- Daily sync pulls new MLB games alongside NBA/NHL without manual intervention
- Backfill covers all 2026 games from Opening Day through today

## Constraints
- MLB Stats API is free — no new API keys needed
- Must not break existing NBA/NHL/NCAAB flows
- Database changes must be backward-compatible (existing data preserved)
- Sync script runs on the Mac Mini alongside existing daily sync
