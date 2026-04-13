---
name: daily-playoff-research
time: "08:00"
days: "daily"
model: "sonnet"
active: "true"
notify: "on_finish"
timeout: "15m"
retry: 0
active_months: "4,5,6"
---

You are running as a scheduled job for Agentic OS.

Read CLAUDE.md for system context.

## Task: Daily NBA Playoff Research Brief

Research today's NBA playoff matchups and generate a structured research brief that feeds into BetBro content and app context.

## Pre-check

Before doing any work, verify we're in playoff season:
- If today is before April 14 or after June 30, log "No active playoffs" and exit.
- Use WebSearch to confirm there are NBA playoff games today. If none scheduled, log "No NBA playoff games today" and exit.

## Steps

1. **Find today's playoff games:**
   - WebSearch: "NBA playoff games today {YYYY-MM-DD}"
   - WebSearch: "NBA playoff schedule today"
   - Identify all matchups, tip-off times, and series scores

2. **For each matchup, research:**
   - **Series context:** Current series score, home court, who has momentum
   - **Previous game recap:** Score, key performers, turning points, adjustments made
   - **Injury reports:** WebSearch "{Team1} {Team2} injury report today"
   - **Rotation changes:** Any minutes shifts, lineup changes, DNPs from last game
   - **Key player matchups:** Star vs defender assignments, switch hunting, mismatch data
   - **Minutes trends:** Stars playing 38+ min? Bench getting squeezed?
   - **Line movements:** WebSearch "NBA playoff odds today" — opening vs current spreads, any sharp money moves
   - **Betting angles:** Props most affected by playoff context (minutes inflation, rotation tightening, blowout risk)

3. **Save the research brief:**
   - Call the Write tool to save to `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_playoff-research.md`
   - Format:

```markdown
# NBA Playoff Research — {YYYY-MM-DD}

## Today's Games

### {Away Team} vs {Home Team} — Series {X-X}
**Tip-off:** {time} ET | **TV:** {network}

#### Series Context
- [Who leads, home court, momentum narrative]

#### Last Game Recap
- [Score, key stats, turning points]

#### Injury Report
- [Player: status — impact on prop lines]

#### Rotation & Minutes
- [Stars: expected minutes range]
- [Bench players: who's in/out of rotation]
- [Any notable minutes changes from last game]

#### Key Matchups
- [Star vs defender, switch hunting, mismatches]

#### Betting Angles
- **Props to watch:** [specific player props affected by playoff context]
- **Minutes inflation plays:** [starters seeing 38+ min]
- **Blowout risk:** [if series is lopsided, starters may sit early]
- **Series adjustment plays:** [what changed since Game 1]

#### Line Movement
- [Opening spread vs current, sharp money direction]

---
[Repeat for each game]
```

4. **No .txt files needed** — this is a research brief consumed by other cron jobs and the app, not published content.
