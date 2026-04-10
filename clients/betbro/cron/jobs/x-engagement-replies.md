---
name: x-engagement-replies
time: "10:00,15:00,19:00"
days: "daily"
model: "sonnet"
active: "true"
notify: "on_finish"
timeout: "15m"
retry: 0
verify_files: "~/Downloads/betbro-x-replies.txt"
---

You are running as a scheduled job for Agentic OS. Your task is to find real trending tweets and draft replies in BetBro's voice.

IMPORTANT: You are the MAIN agent executing this job. Do NOT enter pipeline mode. Do NOT wait for input. Execute the steps below top to bottom.

Read CLAUDE.md for system context.

## Task: X Engagement — Reply Farming for BetBro Growth

Find trending tweets in the sports betting space and draft 2-3 sharp replies in BetBro's voice. The user posts manually — this job produces the ammunition.

## Steps

1. **Load brand context:**
   - Read `brand_context/voice-profile.md` — everything must sound like BetBro (direct, playful, provocative, short)
   - Read `brand_context/positioning.md` — primary angle is "The Walk-Away Edge"
   - Read today's daily posts file at `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_daily-posts.md` — know what BetBro already posted today to avoid repeating angles

2. **Determine which run this is:**
   - Check the current time (ET). Map to the run window:
     - Before 12:00 → **Morning run** (10:00 AM ET)
     - 12:00–16:30 → **Afternoon run** (3:00 PM ET)
     - After 16:30 → **Evening run** (7:00 PM ET)
   - Label the output section accordingly

3. **Cross-reference with BetBro app data:**
   - Before drafting any reply about a specific prop, check what BetBro's own app says about it
   - If BetBro says WALK AWAY on a prop, the reply MUST reflect that — never endorse a bet the product says to skip
   - Use real app data in replies when possible (L5, L10, pace, matchup flags) — this is what makes BetBro replies sharper than everyone else's
   - If you can't verify a prop through the app, keep the reply general (matchup angle, pace, defense) rather than endorsing or rejecting the specific number
   - This is the brand's entire identity — credibility dies the moment a reply contradicts the product

4. **Search X for trending tweets:**
   - Run this command to fetch real tweets: `python3 scripts/search-x-tweets.py`
   - This script reads XAI_API_KEY from .env, searches X via the xAI Responses API with x_search tool, and outputs tweets with engagement metrics (likes, reposts, replies) to stdout
   - Parse the script's stdout — each tweet block starts with `--- Tweet N ---` and includes @handle, engagement counts, URL, text, and relevance
   - **If the script fails or returns no results:** Try WebSearch as a fallback for recent sports betting tweets. If WebSearch also fails to return verifiable tweet URLs, STOP the job and write an error file to `~/Downloads/betbro-x-replies.txt` that says: "X replies job failed — no real tweets found. Check XAI_API_KEY in .env and run `python3 scripts/search-x-tweets.py` manually to debug."
   - **NEVER fabricate tweets, URLs, engagement numbers, or follower counts.** Every tweet in the output MUST come from a real search result with a real URL. If you cannot verify a tweet is real, do not include it. Hallucinated output is worse than no output — it wastes the user's time and damages credibility. If in doubt, produce nothing
   - The script searches for: props today, line movement, injury impact, sportsbook drama, betting discipline, and tonight's biggest games
   - Time filter: last 6 hours preferred, last 12 hours max

5. **Seed accounts to prioritize:**
   When these accounts tweet about sports betting, they're high-value reply targets:
   - **Sports betting personalities:** @PatMcAfeeShow, @PardonMyTake, @BillSimmons
   - **Betting analysts:** @PropBetGuy, @EvanAbrams, @PFF_Bet
   - **Sportsbooks:** @DraftKings, @FanDuel, @BetMGM
   - **Sports news:** @espn, @BleacherReport, @TheAthletic
   - **Sharp/culture:** @ActionNetworkHQ, @CoveringBases, @br_betting
   - Also include any account the search surfaces with **1000+ likes** on a sports betting tweet

6. **Pick the 3 best tweet opportunities:**
   Prioritize by (in order):
   1. High engagement (likes + retweets — more eyes on the reply)
   2. Recency (posted in last few hours — reply while the thread is active)
   3. Relevance to BetBro's positioning (walk-away takes, prop analysis, anti-tout, discipline)
   4. Large following on the original account (bigger audience for the reply)
   5. Open thread — tweets with lots of replies get more visibility for new replies

7. **Draft 2-3 reply options per tweet:**
   Each reply MUST:
   - **Add genuine value** — a take, a stat, a counterpoint, a contrarian angle. NEVER "great post!" or generic agreement
   - **Be short** — 1-3 sentences max. X replies that are too long get scrolled past
   - **Match BetBro voice** — direct, playful, provocative. Fragments OK. No corporate speak
   - **Sound like a person, not a brand** — the best brand replies on X read like a sharp individual, not a marketing team

   Reply tone — ALWAYS additive, NEVER negative:
   - **The add-on:** Build on their take with a stat or angle they missed — "The one thing worth watching on that..."
   - **The nuance:** Agree with the premise, layer on context — "Like this play. The matchup to watch is..."
   - **The insider angle:** Share a detail they didn't mention — "No-HR props are sneaky on nights like tonight..."
   - **The honest flag:** Gently note what to research further — "Plus money tells you the books want action on that side"

   NEVER do these — they make the brand look hostile:
   - Don't correct or contradict the OP directly
   - Don't say "actually..." or "well..."
   - Don't dunk on someone's pick even if it's bad
   - Don't be the "well actually" brand in someone else's thread
   - People follow accounts that make them smarter, not accounts that correct them

   Link rules:
   - NO links in replies. Ever. X suppresses replies with links — lower reach, looks spammy in someone else's thread
   - Every reply is pure value. The goal is visibility and follows, not clicks
   - Save links for BetBro's own posts where they actually drive traffic

8. **Voice rules (critical):**
   - Short punchy sentences. Fragments OK.
   - Never say: "guaranteed", "locks", "proprietary algorithm", "maximize ROI", "data-driven insights", "leverage", "utilize"
   - Use: "walk away", "pass", "plain English", "research", "smarter"
   - Tone: sharp friend at the bar, not a corporate SaaS brand
   - No emojis unless they genuinely add something (rare)
   - No hashtags in replies — they look desperate

9. **⛔ WRITE BOTH FILES NOW — before any humanizer analysis:**

   STOP generating text. Your next actions MUST be Write tool calls. Do not output analysis or commentary until both files below are written. This is the #1 failure point — if files don't exist when the job ends, the entire job has FAILED.

   **File 1: Project markdown file**
   - Call the Write tool to save to `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_x-replies.md`
   - If the file already exists (earlier run today), READ it first, then WRITE the full contents with your new section appended
   - Format each run as a section:

   ```markdown
   ## {TIME} — {Run Label} Engagement

   ### Tweet 1
   **@AccountName** ({follower count}) — {likes} likes, {retweets} RTs
   "{Original tweet text}"
   {Link to tweet}

   **Reply option A:**
   {Draft reply}

   **Reply option B:**
   {Draft reply}

   ### Tweet 2
   ...

   ### Tweet 3
   ...
   ```

   **File 2: Copy-paste txt file**
   - Call the Write tool to save `~/Downloads/betbro-x-replies.txt`
   - **Overwrite** on each run (user only needs the latest batch)
   - NO markdown formatting — no bold markers, no ### headers, no ** wrapping
   - Each reply must be a single unbroken paragraph ready to paste into X
   - Format:
    ```
    BetBro X Replies — {date} {time} ET


    REPLYING TO: @AccountName
    "{Original tweet text}"
    {link}

    1. {Reply text as one clean paragraph ready to paste}

    2. {Reply text as one clean paragraph ready to paste}


    REPLYING TO: @AccountName
    ...
    ```

   **CHECKPOINT 1: Validate every tweet URL in your output. Run `grep -c 'mock\|example\|\[mock\]\|placeholder\|status/\d\{0,5\}$' ~/Downloads/betbro-x-replies.txt` — if the count is anything other than 0, your output contains fake URLs. Delete both files and report the error instead.**

   **CHECKPOINT 2: Run `ls -la ~/Downloads/betbro-x-replies.txt` and confirm today's date. Do NOT proceed until confirmed.**

10. **Run through humanizer:**
    - Invoke the `/humanizer` skill on all drafted replies
    - Mode: deep (brand_context/voice-profile.md is loaded)
    - **HARD RULE: Zero em dashes (—) in reply text.** Replace every em dash with a period.
    - **Kill analytics jargon.** Rewrite in plain bar talk.
    - Check for: repeated structural patterns, duplicate adjectives, same opener format, three-beat rhythm in every reply
    - If any reply scores below 7/10, rewrite it
    - **If the humanizer changed any content: call the Write tool again to UPDATE both files.** Do not skip this.
    - Keep audit output brief — scores and changes only.

11. **Final verification:**
    - Run `ls -la ~/Downloads/betbro-x-replies.txt` one final time
    - Confirm the file exists with today's date
    - If missing or stale, write it NOW

## What NOT To Do

- Don't reply to accounts with under 5K followers unless the tweet itself went viral (10K+ likes)
- Don't be sycophantic — "So true!" and "This 💯" are worthless
- Don't be negative or mean-spirited — provocative ≠ hostile
- Don't reply to other betting tools/competitors directly — looks petty
- Don't force BetBro mentions into every reply — most replies should be pure value
- Don't use thread-style replies (1/3, 2/3) — keep each reply standalone
- Don't repeat angles from today's daily posts — check the file first
