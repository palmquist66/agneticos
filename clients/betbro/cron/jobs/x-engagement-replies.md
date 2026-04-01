---
name: x-engagement-replies
time: "10:00,15:00,19:00"
days: "daily"
model: "sonnet"
active: "true"
notify: "on_finish"
timeout: "15m"
retry: 0
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
   - Run this command to fetch real tweets: `python3 scripts/fetch-x-replies.py`
   - This script reads XAI_API_KEY from .env, searches X via the xAI Responses API with x_search tool, and outputs tweets with engagement metrics (likes, reposts, replies) to stdout
   - Parse the script's stdout — each tweet block starts with `--- Tweet N ---` and includes @handle, engagement counts, URL, text, and relevance
   - If the script fails or returns no results, fall back to WebSearch for recent sports betting tweets (less precise but still usable)
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

9. **Review output for AI tells:**
   - Re-read every reply. If anything sounds like AI wrote it (inflated language, promotional tone, corporate phrasing), rewrite it
   - Match the voice in `brand_context/voice-profile.md` — short, punchy, sounds like a person
   - Target: every reply should read like a sharp bettor typed it on their phone, not a marketing team

10. **Save output to project file:**
   - Save to `projects/briefs/betbro-beta-growth/{YYYY-MM-DD}_x-replies.md`
   - If the file already exists (earlier run today), **append** a new section — don't overwrite
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

11. **Create copy-paste file:**
    - Write a clean PLAIN TEXT file to `~/Downloads/betbro-x-replies.txt`
    - **Overwrite** on each run (user only needs the latest batch)
    - NO markdown formatting — no bold markers, no ### headers, no ** wrapping
    - NO weird line breaks mid-sentence — each reply must be a single unbroken paragraph the user can select and paste directly into X
    - Format: just the reply text, numbered, with the original tweet context for reference
    - Example:
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

## What NOT To Do

- Don't reply to accounts with under 5K followers unless the tweet itself went viral (10K+ likes)
- Don't be sycophantic — "So true!" and "This 💯" are worthless
- Don't be negative or mean-spirited — provocative ≠ hostile
- Don't reply to other betting tools/competitors directly — looks petty
- Don't force BetBro mentions into every reply — most replies should be pure value
- Don't use thread-style replies (1/3, 2/3) — keep each reply standalone
- Don't repeat angles from today's daily posts — check the file first
