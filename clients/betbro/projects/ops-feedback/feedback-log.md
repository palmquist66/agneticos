# Feedback Log

> Source of truth for all user feedback, bugs, and feature requests.
> Updated by the ops-user-feedback skill. Don't edit manually unless you know the format.

| ID | Date | Source | Category | Priority | Status | Description | Resolution |
|----|------|--------|----------|----------|--------|-------------|------------|
| 1 | 2025-02-24 | James | feature-request | medium | fixed | Autofill as typing player name | Added autocomplete based on players in DB |
| 2 | 2025-02-26 | Robbie | bug | medium | fixed | Can't find Luka Doncic prop — never finds it | Spelling/special character issue — resync with fix |
| 3 | 2025-02-27 | James | bug | low | fixed | Duncan Robinson showing 26 pts avg instead of ~13 | Duplicate Duncan Robinsons in DB |
| 4 | 2025-02-27 | Robbie | bug | low | fixed | Nicolas Claxton — no recent data | Nets not found — added Nets, fixed to Nic Claxton |
| 5 | 2025-02-28 | James | feature-request | low | fixed | Autofill showing players from all sports — should filter by current sport | — |
| 6 | 2025-03-02 | James | bug | medium | fixed | Clippers missing from team stats | LA Clippers vs Los Angeles Clippers naming mismatch |
| 7 | 2025-03-03 | James | feature-request | medium | fixed | Show best line and which book it's from | Updated to show most used line + best odds by book |
| 8 | 2025-03-03 | James | bug | low | fixed | Jalen Brunson missing Steal prop | — |
| 9 | 2025-03-03 | James | bug | low | fixed | Goga Bitadze Points — no recent data, should show L5/L10 | Same root cause as #10 — season sync fix resolved it |
| 10 | 2025-03-05 | Andrew | bug | medium | fixed | L5 game avg consistently lower than actual for multiple players | Data not syncing with proper games from current season |
| 11 | 2025-03-06 | James | bug | high | fixed | Connor Bedard NHL — missing L5/L10 data | NHL sync was not working properly |
| 12 | 2026-03-30 | James | content | medium | new | Davis Martin MLB Outs analysis framed "1-out cushion" (16.5 avg vs 15.5 line) as a strong factor — but 1 out above the line is razor thin, not a real cushion. Research skill should flag slim margins honestly instead of presenting them as comfortable edges | — |
| 13 | 2026-03-31 | self-discovered | bug | critical | fixed | Strikeout props are ALWAYS pitcher stats (Ks thrown) — app incorrectly analyzes them as batter strikeouts. Ohtani search for 6.5 Ks generates Key Factor using batter K rate (1.09/game) instead of pitcher K rate. Strikeouts should never be treated as a batter prop. Ohtani is #1 searched player — this is user-facing and wrong | Fixed in stats_service.py — strikeout stat now forces is_pitcher=True regardless of player position. Tested: Ohtani now returns 11.9 K/9, 62 Ks in 47 IP (pitcher stats) |
| 14 | 2026-04-02 | self-discovered | bug | high | fixed | MLB search for Corbin Carroll total bases L5/L10 — result shows up but recent trend, line content, and key factors are all empty/not populated. Data fields missing despite player being found | Rolled back MLB L5/L10 game log lookup — early season has insufficient data. Now skips straight to 2025 season stats via ESPN. Will re-enable ~15 games into season. |
| 15 | 2026-04-02 | self-discovered | feature-request | high | fixed | When L5/L10 data isn't available yet (e.g. pitchers early in MLB season), fall back to 2025 stats instead of showing empty fields. Don't leave the user staring at blank data — use last season as the baseline until enough 2026 games exist | Same fix as #14 — MLB now always uses 2025 season stats until L5/L10 is re-enabled mid-season |
| 16 | 2026-04-02 | James | bug | high | fixed | daily-betbro-posts cron skipping ~/Downloads/ txt file output — 2 days in a row (Apr 1 and Apr 2). Job reports success but doesn't write the 5 copy-paste txt files. Also saves as -DRAFT instead of final filename. User has to ask for these manually every session. | Rewrote step 7 in cron job with explicit NON-NEGOTIABLE language, individual file write instructions, and mandatory ls verification step. Renamed -DRAFT convention to final filename. |
