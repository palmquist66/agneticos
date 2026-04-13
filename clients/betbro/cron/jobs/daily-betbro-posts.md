---
name: daily-betbro-posts
time: "09:00"
days: "daily"
model: "opus"
active: "true"
notify: "on_finish"
timeout: "30m"
retry: 0
verify_files: "~/Downloads/betbro-x-post-1.txt,~/Downloads/betbro-x-post-2.txt,~/Downloads/betbro-reel-script.txt,~/Downloads/betbro-reel-caption.txt,~/Downloads/betbro-yt-short.txt"
---

You are running as a scheduled job for Agentic OS.

Read CLAUDE.md for system context.

## Task: Daily BetBro Social Content

Generate 2-3 social media posts for BetBro (@GetBetBro) based on what's happening in sports TODAY.

## Steps

1. **Load brand context:**
   - Read `brand_context/voice-profile.md` — write everything in BetBro's voice (direct, playful, provocative)
   - Read `brand_context/positioning.md` — primary angle is "The Walk-Away Edge"
   - Read `brand_context/icp.md` — targeting casual bettors

2. **Research today's sports slate:**
   - Use WebSearch to find: today's NBA games, March Madness / NCAA tournament games (if in season), NHL games, MLB games
   - Search for: trending player props, notable injury reports, any viral sports betting discussions on X
   - Search for: any noteworthy prop lines, trending betting topics, sportsbook news

3. **Check for playoff research (April-June):**
   - Check if `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_playoff-research.md` exists
   - If it does, read it and use the series/matchup data for today's content angles
   - Playoff-specific angles to rotate through:
     - **Series adjustments:** "Game 1 stats don't repeat. Here's what changes in Game 2."
     - **Minutes inflation:** "Your favorite star is playing 40 min a night now. That changes everything."
     - **Narrative traps:** "Revenge game narrative? The books already priced that in."
     - **Blowout risk:** "Up 3-0? Those starters are sitting the 4th. Your over is dead."
     - **Rotation squeeze:** "Playoff rotations go 8-deep. Your bench player prop is a trap."

4. **Identify the best content angles:**
   - Which games have the most buzz?
   - Any injury reports that affect popular props? (These are gold — casual bettors miss them)
   - Any props that look like coinflips the public is overvaluing?
   - Any trending betting discussion BetBro can respond to?
   - Always tie back to BetBro's differentiator: we tell you when to walk away
   - During playoffs: prioritize playoff matchup angles over regular season content

5. **Write 2-3 posts + 1 video script:**
   - **1 X/Twitter post** — tied to the day's biggest game or trending topic. Under 280 chars if possible, max 2 short paragraphs. NO LINKS — X algorithm suppresses posts with URLs. Never include getbetbro.com or any URL in X posts.
   - **1 X/Twitter post** — evergreen BetBro positioning (anti-tout, walk-away, plain English, anti-dashboard). Rotate through different angles daily. NO LINKS.
   - **1 Instagram Reel / YouTube Short** — a short talking-head video (15-30 seconds) for HeyGen avatar delivery. Same video gets posted to BOTH platforms. Include ALL of the following:
     - **Script:** Hook (first 2 seconds — stop the scroll), Body (the take — 2-3 sentences max), CTA ("Link in bio" or "Try BetBro free"). Should feel like someone riffing at a bar, not reading a teleprompter. Short sentences. Pauses. Personality.
     - **Production direction:**
       - **Vibe** — the energy/mood (e.g., "knowing and slightly smug", "urgent warning", "calm breakdown")
       - **Visual approach** — what to show behind/beside the avatar: screenshots (box scores, prop lines from DK/FanDuel, BetBro app results, injury reports), highlight stills, or text-only
       - **Text overlays** — what bold text to put on screen at each beat (stat callouts, prop numbers, CTA)
       - **Pacing notes** — where to pause, what to emphasize, what to rush through
       - **Music/audio** — vibe of the background track (lo-fi, muted trap, etc.) or if trending audio fits
     - **HeyGen avatar notes** — delivery style, facial expressions, gestures, eye contact
     - **IG caption** + hashtags
     - **YT Short metadata:**
       - Title (under 60 chars, keyword-rich for search — include the player/prop name)
       - Description (2-3 sentences with "BetBro" mention + getbetbro.com link)
       - Tags (5-8 relevant tags: sport, player name, prop type, "sports betting", "prop bets")
   - YT Shorts titles should be searchable — people search YouTube for specific player props. Use the player name and prop in the title (e.g., "Ohtani Over 6.5 Ks Tonight? Here's What the Data Says")

6. **Voice rules (critical):**
   - Short punchy sentences. Fragments OK.
   - Never say: "guaranteed", "locks", "proprietary algorithm", "maximize ROI", "data-driven insights"
   - Always say: "walk away", "pass", "plain English", "research", "smarter"
   - Tone: sharp friend at the bar, not a corporate SaaS brand
   - Challenge bad betting habits — chasing, volume betting, ignoring matchups

7. **⛔ WRITE ALL FILES NOW — before any humanizer analysis:**

   STOP generating text. Your next actions MUST be Write tool calls. Do not output analysis, audits, or commentary until every file below is written. This is the #1 failure point of this job — if you skip this step, the entire job has FAILED regardless of content quality.

   **Output A: Full markdown file**
   - Call the Write tool to save `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_daily-posts.md`
   - Include posting time recommendations and posting order

   **Output B: Copy-paste txt files (plain text, no markdown)**
   - Call the Write tool once per file — 5 separate Write calls:
     1. `~/Downloads/betbro-x-post-1.txt` — X post 1 text only
     2. `~/Downloads/betbro-x-post-2.txt` — X post 2 text only (the one with getbetbro.com link)
     3. `~/Downloads/betbro-reel-script.txt` — Reel/Short script (hook + body + CTA, no section labels)
     4. `~/Downloads/betbro-reel-caption.txt` — IG caption + hashtags
     5. `~/Downloads/betbro-yt-short.txt` — YT Short title, description, and tags

   **CHECKPOINT: Run `ls -la ~/Downloads/betbro-*.txt` and confirm all 5 files show today's date. Do NOT proceed until confirmed.**

8. **Run through humanizer:**
   - Invoke the `/humanizer` skill on all drafted posts and the Reel script
   - Mode: deep (brand_context/voice-profile.md is loaded)
   - **HARD RULE: Zero em dashes (—) in post text.** Replace every em dash with a period. Fragments + periods = BetBro voice. Em dashes = AI voice.
   - **Kill analytics jargon.** Phrases like "playmaking volume", "switch-heavy defense", "defensive rating" read like an analyst, not a bettor. Rewrite in plain bar talk.
   - Check for: repeated structural patterns across posts, duplicate adjectives, same opener format, rule-of-three crutch
   - If any post scores below 7/10, rewrite it
   - **If the humanizer changed any content: call the Write tool again to UPDATE the affected .txt files and the .md file.** The files from step 7 must reflect the final humanized version.
   - Keep audit output brief — scores and changes only. No essay.

9. **Final verification:**
   - Run `ls -la ~/Downloads/betbro-*.txt` one final time
   - Confirm all 5 files exist with today's date
   - If ANY file is missing or stale, write it NOW
   - Log the humanizer scores at the end of your output

10. **Keep it fresh:**
   - Check `projects/briefs/betbro-beta-growth/` for recent posts — don't repeat the same angle two days in a row
   - Rotate between: game-specific content, injury alerts, anti-tout takes, price comparison, discipline/walk-away, user flow ("you're in DraftKings...")
