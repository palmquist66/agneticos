# Saturday Meeting Agenda — May 9, 2026

**Attendees:** Karen, John, Kadee, James
**Setting:** Casual breakfast. Not a presentation — a checklist to keep things moving.

---

## 1. Quick wins check-in (5 min)

📄 **Reference:** `2026-04-21_gbp-posting-calendar-weeks1-2.md` — the posting calendar Karen's been working from

Karen's been crushing it — posting to GBP, responding to reviews, adding photos. This is working.

**Ask Karen:**
- How's the posting going? Anything confusing or taking too long?
- Has she been using the posting calendar or freestyling? (Both are fine)
- Any feedback on the post voice/tone? Too formal? Too casual? Just right?

**Key point to make:** Karen's GBP posting isn't just traditional SEO — it directly feeds AI search engines too. ChatGPT now pulls GBP data live when people ask for local vet recommendations. Every post she makes signals "active, current business" to AI models. She's doing double duty without realizing it.

---

## 2. Set up brand context in Claude Cowork (10 min)

Get the HPAH voice loaded into Karen's Claude setup so everything she does after this — morning brief, review responses, posts — sounds like Healthy Paws automatically.

Full walkthrough is in `2026-04-28_claude-cowork-brand-setup-training.md` — follow that doc during this section.

**What Karen does (James guides):**
1. Open Claude Desktop → **Settings > Cowork** → paste the Global Instructions (the HPAH voice block from the training doc)
2. Create an `HPAH-Brand` folder on her computer (Desktop or Documents)
3. Create the three brand files inside it: `voice-profile.md`, `ideal-customer.md`, `positioning.md` — Karen copies/pastes from the training doc
4. In Cowork, create a new Project called "HPAH Content" and point it at the `HPAH-Brand` folder

**Why this goes first:** The morning brief demo (section 6) and everything Karen does with Claude going forward will use this voice. Setting it up now means she sees the payoff immediately when we run the brief later.

**Quick test after setup:** Ask Claude in Cowork: "Write a one-sentence welcome message for a new client." If it sounds like Healthy Paws (warm, professional, mentions the pet), the voice is working. If it sounds generic, double-check the Global Instructions saved properly.

**Leave the training doc with Karen** — it has troubleshooting tips and example tasks she can try on her own.

---

## 3. GBP performance baseline (10 min)

📄 **Reference:** `2026-05-04_email-gbp-performance-baseline.md` — the email sent to Karen asking for GBP Insights screenshots

- Did Karen pull the screenshots from the email sent April 27?
- **If yes:** collect them, we'll build the before-picture report
- **If no:** walk her through it right there on her phone (show how to pull GBP Insights — views, searches, actions, search queries for the last 6 months)
- **Why this matters:** We need the "before" snapshot so we can show results in 2-3 months when the website work takes effect

**Also ask:** Can James be added as a GBP manager? This lets him pull performance data directly without bothering Karen each time.

---

## 4. Website developer — decision needed (10 min)

📄 **Reference:** `2026-04-20_website-developer-brief.md` — the 10-page developer brief to discuss and hand off

The developer brief is ready. 10 pages (7 service + 3 location) plus schema markup that makes the site readable by AI search engines.

**Questions that need answers:**
1. Is the developer on retainer or per-project? What does a batch of pages typically cost?
2. Should James send the brief directly to the developer, or does Karen handle that relationship?
3. Has anyone talked to the developer since we started this project?

**If cost is high:** James can build the pages himself in Divi. Mention as an option, not a push.

**The pitch for why this is urgent:** HPAH ranks #1 on Google for several keywords (Fear Free vet, spay neuter, senior pet care) WITHOUT even having dedicated pages. That means any competitor who builds a page for those terms can leapfrog overnight. The pages lock in positions HPAH is already earning. Plus — AI search engines can't recommend HPAH for specific services because there's no page to cite. It's like having a store with no front door.

**Also ask:** Are GA4 and Google Search Console set up on the website? If not, the developer should add both ASAP — they're free and take 5 minutes. We need these to track what's working.

---

## 5. AI search visibility — the new frontier (10 min)

📄 **Reference:** `2026-04-27_ai-visibility-baseline.md` — the full AI search test results (12 queries, HPAH vs competitors)

**Brief, non-technical overview for Karen/John/Kadee:**

- 45% of people now use AI (ChatGPT, Perplexity, Google AI) to find local services — up from 6% a year ago
- Among pet owners under 35, it's 51%
- We tested 12 ways pet owners ask AI for vet recommendations. HPAH shows up in 42% of them
- Pet Vet shows up in 58% — they're winning the AI game right now
- Almost no vets are doing anything about this yet. First-mover advantage is huge

**What HPAH needs (simplified):**
1. Schema markup on the website (tells AI what the business is — developer handles this)
2. The service/location pages (gives AI something to cite for specific questions)
3. FAQ sections on every page (AI loves pulling direct Q&A answers)

**This is why the developer brief matters.** The website technical work is the unlock that turns Karen's GBP efforts into AI citations.

---

## 6. Morning Brief — install, build, and demo (20 min)

📄 **References:**
- `2026-05-08_morning-brief-demo-script.md` — step-by-step script to follow during this section
- `2026-05-08_morning-brief.md` — test run output (backup if live demo hiccups)
- `2026-04-21_gbp-posting-calendar-weeks1-2.md` — posting calendar (needs to be shared with Karen for scheduled briefs)

This is the big demo. Karen will install the Claude Chrome extension, build a morning brief prompt with James guiding, run it live, and schedule it. Follow the demo script doc above.

### 6a. Install the Claude Chrome Extension (5 min)

Karen needs the Chrome extension (not just Desktop Cowork) because the morning brief browses Google Maps to pull live review data and competitor info automatically.

**Karen does this herself, James guides:**
1. Chrome Web Store → search "Claude" by Anthropic → **Add to Chrome**
2. Pin it — puzzle piece icon (🧩) → thumbtack next to Claude
3. Sign in with her Claude account
4. Quick test: open Google Maps, search for HPAH, ask Claude in the side panel "how many reviews does this business have?" — if it answers, it's working

### 6b. Discovery Questions (3 min)

Before building the prompt, ask Karen these 4 questions to customize the brief for her:

1. **What's the first thing you check when you get to the practice?** (Reviews? Emails? Schedule? Social?) — tells us what goes front and center
2. **What falls through the cracks when it gets busy?** (Review responses? Posting? Follow-ups?) — tells us what the brief should catch
3. **When do you actually have 5 minutes to read something like this?** (Before first appointment? Coffee at home? Between patients?) — tells us when to schedule it
4. **Anything you wish someone would just tell you every morning?** (New reviews overnight? Competitor activity? Appointments today?) — open-ended

### 6c. Build and Run the Morning Brief (7 min)

James reads the prompt out loud, section by section. Karen types it into the Chrome extension side panel. The brief includes:

1. **Reviews check** — Claude browses HPAH's Google Maps listing, pulls current review count/rating, shows the 3 most recent reviews, drafts responses for any that don't have owner replies yet
2. **Competitor pulse** — checks Winding Creek and Pet Vet's Google Maps listings for review count, rating, and recent activity
3. **Weather + pet safety** — today's weather with a practical talking point for the team
4. **Awareness days** — any pet health observances this week with a social media angle
5. **GBP post reminder** — next post from the calendar, ready to copy/paste
6. **Team huddle prompt** — one discussion question for the morning huddle

Karen hits enter, they watch it run, and walk through the output together.

**Already tested:** James ran this prompt and it successfully pulled real HPAH reviews (165 reviews, 4.7★), real competitor data (Winding Creek 174, Pet Vet 227), live weather, and correct awareness days. It works.

### 6d. Schedule It (2 min)

Karen clicks the clock icon (⏰) in the Claude side panel, creates a new scheduled task, pastes the prompt, sets it to run daily at whatever time she said in the discovery questions.

### 6e. Act on It Live (3 min)

Karen picks one item from the brief and does it for real — posts a review response or a GBP post. Full loop: brief → copy → paste → done.

**Hallucination warning (mention during the walkthrough):** Claude can confidently say wrong things. Always verify specifics — hours, pricing, medical claims, phone numbers. If it sounds too specific and you didn't tell it, double-check.

**For Kadee:** As a care coordinator, are there routine communications she handles that could benefit from a similar brief? Post-surgery follow-up calls, client callbacks, prescription reminders. Don't push — see if she asks.

---

## 7. Open items (if time/energy allows)

- **Business name** — still undecided. Any movement? Not urgent.
- **Review generation** — brief idea: coach front desk staff to ask satisfied clients for reviews that mention specific services ("We'd love if you mentioned the Fear Free experience"). Service-specific keywords in reviews feed AI recommendation themes. Target: 200+ Google reviews (currently 165 — 35 to go).
- **GBP Q&A** — Karen can add Q&A pairs directly to the GBP listing. Suggest 5-10 common questions ("Do you see cats?" "What's a Fear Free vet?" "How far from Crystal Lake?"). ChatGPT pulls these directly.
- **Reddit** — pet owners ask for vet recommendations on Reddit constantly. AI models cite Reddit in 40% of answers. Not urgent, but worth mentioning as a future play. Ideally Dr. Burgess or a team member answering general pet health questions organically.

---

## Decisions Needed (Summary)

| # | Decision | Who Decides |
|---|----------|-------------|
| 1 | Developer: retainer or per-project? What's the cost? | Karen/John |
| 2 | Send brief to developer directly, or Karen handles? | Karen |
| 3 | Add James as GBP manager? | Karen |
| 4 | GA4 / Search Console — are they set up? | Karen/developer |
| 5 | Morning brief — what should it include + when? | Karen |
| 6 | Brand context — did Cowork setup complete successfully? | Karen/James |

---

## Tone Reminder

Keep it light. This is a breakfast, not a board meeting. Reporting progress, getting a few answers, showing tools. If conversation drifts, let it — these items just keep things from falling through the cracks. Karen's already doing great work — reinforce that.

Kadee is there as family and as practice staff. Don't put her on the spot but if she sees ways the tools could help her work, that's a win.
