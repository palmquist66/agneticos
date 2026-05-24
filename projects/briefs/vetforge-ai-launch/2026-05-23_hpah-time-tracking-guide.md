# HPAH Time-Tracking — Setup & How to Read It

**Created:** 2026-05-23
**Purpose:** Run the HPAH beta month against the estimates in `2026-05-23_delivery-capacity-model.md`. Replace guessed hours with real ones, find where AI isn't carrying enough, and confirm the pricing/scope before onboarding paid clients.
**File to fill in:** `2026-05-23_hpah-time-tracking.csv`

> **HPAH is a Handoff (Spark-equivalent) engagement, not Operator.** They have their own web designer and a strong existing site, so you do *not* build/host/maintain it. Targets below are tuned for the Handoff service mix (SEO/AI-search + content + web-dev plans for their designer), with website implementation/hosting removed. HPAH-beta also gets some services beyond standard Spark (calls, training) — those are tracked separately as "beta extras" so they don't distort the Spark validation.

---

## The one habit that makes this work

Log time **as you do it**, not from memory at month-end. Open the sheet on your phone, pick the task, type the minutes, done. 20 seconds. Memory-reconstructed time logs always undercount the small stuff — and the small stuff is exactly what turns a service into a full-time job.

---

## How to fill each column

| Column | What to put |
|---|---|
| **Date** | The day you did the work |
| **Task** | Pick from the taxonomy below (these match the capacity model exactly so the comparison is clean) |
| **Type** | `Delivery` / `Setup` / `System-building` / `Ad-hoc` — see definitions below |
| **Minutes** | Actual minutes of *your* time (not AI's runtime — your hands-and-brain time) |
| **AI leverage** | `H` / `M` / `L` — how much AI carried this (H = AI did most, L = mostly manual) |
| **Notes** | What specifically, and *why* if it ran long |

### Task taxonomy (use these exact labels)
**Spark/Handoff core (recurring):** `Monthly audit + report` · `Web-dev plans/specs` · `AI-search optimization + monitoring` · `GBP optimization` · `Social content` · `Post-it-yourself publishing` · `Tech-updates briefing`
**Beta extras (beyond standard Spark — track separately):** `Check-in call` · `AI team training` · `Review responses`
**One-time / other:** `Demo/site rebuild` · `Setup (one-time)` · `Ad-hoc request` · `Other`

(`Web-dev plans/specs` = the plans you hand HPAH's designer, e.g. the new locations/services pages. There's no `Website implementation` task because their designer builds it, not you.)

### Type — the most important column
This separates *repeatable delivery time* (the number that validates the model) from *one-time investment*:

- **Delivery** — repeatable monthly work. **This is the number that must match the model.**
- **Setup** — one-time onboarding work (brand voice profile, baseline audit). Happens once per client.
- **System-building** — building a template, a reusable site skeleton, a new skill, a process. One-time investment that *lowers future delivery hours*. Expect a lot of this on HPAH — you're building the playbook, not just running it.
- **Ad-hoc** — unplanned client requests. **Watch this number.** Ad-hoc creeping up is the #1 early warning that scope is eating your margin.

> **Why HPAH hours will look high:** as your first/beta client, a lot of your time is `System-building` (the demo rebuild, the first web-dev plan, the brand-voice extraction), not `Delivery`. Don't panic if total hours blow past the ~2.65 hr Spark target — isolate the Spark-core `Delivery` rows. That's the steady-state number. The `System-building` time pays itself back across every future client, and the beta extras are a choice, not a cost you're locked into.

---

## Set up the auto-summary in Google Sheets

Import the CSV into a new Google Sheet (File → Import → Upload). Rename the imported tab to **`Log`**. Add a second tab called **`Summary`** and paste this — actuals fill in automatically as you log:

| A (Task) | B (Spark target hr/mo) | C (Actual hr/mo) | D (Variance) |
|---|---|---|---|
| Monthly audit + report | 0.75 | `=SUMIF(Log!$B:$B,A2,Log!$D:$D)/60` | `=C2-B2` |
| Web-dev plans/specs | 0.5 | `=SUMIF(Log!$B:$B,A3,Log!$D:$D)/60` | `=C3-B3` |
| AI-search optimization + monitoring | 0.25 | `=SUMIF(Log!$B:$B,A4,Log!$D:$D)/60` | `=C4-B4` |
| GBP optimization | 0.25 | `=SUMIF(Log!$B:$B,A5,Log!$D:$D)/60` | `=C5-B5` |
| Social content | 0.75 | `=SUMIF(Log!$B:$B,A6,Log!$D:$D)/60` | `=C6-B6` |
| Post-it-yourself publishing | 0.1 | `=SUMIF(Log!$B:$B,A7,Log!$D:$D)/60` | `=C7-B7` |
| Tech-updates briefing | 0.05 | `=SUMIF(Log!$B:$B,A8,Log!$D:$D)/60` | `=C8-B8` |
| _Check-in call (beta extra)_ | 0 | `=SUMIF(Log!$B:$B,A9,Log!$D:$D)/60` | `=C9-B9` |
| _AI team training (beta extra)_ | 0 | `=SUMIF(Log!$B:$B,A10,Log!$D:$D)/60` | `=C10-B10` |
| _Review responses (beta extra)_ | 0 | `=SUMIF(Log!$B:$B,A11,Log!$D:$D)/60` | `=C11-B11` |

Rows 2–8 are the **Spark/Handoff scope** (target ~2.65 hr total). Rows 9–11 are **beta extras** — services beyond what a standard $600 Spark client gets. Their target is 0, so the variance column shows you exactly what including them costs.

Then the numbers that actually decide things:

- **Spark-core delivery total (target ~2.65 hr):** `=SUM(C2:C8)`
- **Beta-extras total (what the founding generosity costs):** `=SUM(C9:C11)`
- **Ad-hoc total (target: near 0):** `=SUMIFS(Log!$D:$D,Log!$C:$C,"Ad-hoc")/60`
- **System-building total (one-time, expected high on beta — demo rebuild, first plans):** `=SUMIFS(Log!$D:$D,Log!$C:$C,"System-building")/60`
- **Effective rate at Spark price:** `=600/[Spark-core delivery total]`

Optional polish: add a dropdown on the Log `Task` and `Type` columns (Data → Data validation) so logging is one tap on mobile.

---

## How to read the results at month-end

1. **Is the Spark-core delivery total near ~2.65 hr?** If yes, the $600 Spark price holds and the Handoff model is sound. If it's 5+, something needs to change *before* you scale.
2. **Which tasks are over?** Each over-budget task is a lever. Look at its AI-leverage rating:
   - Logged mostly **L (manual)?** → AI isn't carrying it yet. Build a template or a skill. *Fix the process, don't raise the price.*
   - Logged **H** but still slow? → the task itself is heavy; consider scope limits or a tier bump.
3. **What did the beta extras cost?** Calls + training + review responses aren't in standard Spark. If they added real hours, decide: bake them into a higher Handoff price, push them up to Forge/Foundry, or keep them as founding-client goodwill you won't repeat.
4. **What's the Ad-hoc number?** Anything meaningful here means scope is leaking. Tighten what "included" means in the agreement.
5. **Effective rate check:** Spark-core delivery hours into $600. Above ~$200/hr → healthy. Below → either trim Spark scope or set the Handoff price above $600 before onboarding client #2.

The output of the beta month is three decisions: **(a)** confirm or adjust the Spark/Handoff price and what's included, **(b)** a punch-list of templates/skills to build (your over-budget, low-AI tasks), and **(c)** your firm solo client cap.
