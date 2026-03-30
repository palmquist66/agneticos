---
name: daily-betbro-posts
time: "09:00"
days: "daily"
model: "sonnet"
active: "true"
notify: "on_finish"
timeout: "30m"
retry: 0
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

3. **Identify the best content angles:**
   - Which games have the most buzz?
   - Any injury reports that affect popular props? (These are gold — casual bettors miss them)
   - Any props that look like coinflips the public is overvaluing?
   - Any trending betting discussion BetBro can respond to?
   - Always tie back to BetBro's differentiator: we tell you when to walk away

4. **Write 2-3 posts + 1 video script:**
   - **1 X/Twitter post** — tied to the day's biggest game or trending topic. Under 280 chars if possible, max 2 short paragraphs. Include getbetbro.com link on at least one.
   - **1 X/Twitter post** — evergreen BetBro positioning (anti-tout, walk-away, plain English, anti-dashboard). Rotate through different angles daily.
   - **1 Instagram Reel script** — a short talking-head video script (15-30 seconds) for HeyGen avatar delivery. Write it conversational, like a friend talking to camera. Include:
     - Hook (first 2 seconds — must stop the scroll)
     - Body (the take — 2-3 sentences max)
     - CTA ("Link in bio" or "Try BetBro free")
     - Caption + hashtags for the post
   - The script should feel like someone riffing at a bar, not reading a teleprompter. Short sentences. Pauses. Personality.

5. **Voice rules (critical):**
   - Short punchy sentences. Fragments OK.
   - Never say: "guaranteed", "locks", "proprietary algorithm", "maximize ROI", "data-driven insights"
   - Always say: "walk away", "pass", "plain English", "research", "smarter"
   - Tone: sharp friend at the bar, not a corporate SaaS brand
   - Challenge bad betting habits — chasing, volume betting, ignoring matchups

6. **Save output:**
   - Save to `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_daily-posts.md`
   - Include posting time recommendations based on today's game schedule
   - Include which post to send first and why

7. **Keep it fresh:**
   - Check `projects/briefs/betbro-beta-growth/` for recent posts — don't repeat the same angle two days in a row
   - Rotate between: game-specific content, injury alerts, anti-tout takes, price comparison, discipline/walk-away, user flow ("you're in DraftKings...")
