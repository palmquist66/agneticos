# VetForge AI — Delivery & Capacity Model

**Created:** 2026-05-23
**Project:** vetforge-ai-launch (Phase 6 — internal ops)
**Status:** Draft — estimates to validate against the HPAH beta
**Audience:** Internal only. Never shown to clients.

---

## The Rule This Document Exists to Protect

**Do not build a full-time job with part-time pay.**

Two numbers decide whether that happens:

1. **Human hours per client per month** — how much of *your* time each client actually eats (not AI's time — yours).
2. **Effective rate = monthly price ÷ your human hours.** If a $1,200/mo client secretly takes you 12 hours, that's $100/hr and you've built yourself a low-wage job. If it takes 5 hours, that's $240/hr and you've built leverage.

The whole model below exists to keep your effective rate **above ~$200/hr** and your total monthly hours **inside a solo-sustainable ceiling**. Every estimate here is a starting guess — the HPAH beta is how you replace guesses with real numbers (see Beta Validation at the end).

---

## How the Work Splits

For every task: **AI does the production, you do the judgment, the relationship, and the final yes.** AI drafts; you decide, refine, and ship. The "AI %" column is the share of the task AI carries — the rest is your time.

Your time goes to four things AI can't do:
- **Judgment** — is this audit priority right for *this* practice?
- **Quality control** — does this content actually sound like them? Is this change safe to deploy?
- **Relationship** — the calls, the trust, the "he gets it."
- **Deploys & decisions** — clicking publish, approving, owning the outcome.

---

## The AI Leverage Stack

The agentic-os skills are your production line. This is *how* the hours stay low:

| Work | Tool / skill | Carries |
|---|---|---|
| SEO/AEO + AI-search audits & recommendations | `str-ai-seo` | Audit, gap analysis, GEO/AEO action plan |
| Brand voice profile (setup) | `mkt-brand-voice` | Voice extraction → reusable profile every deliverable reads |
| Social content | `mkt-content-repurposing`, `mkt-copywriting`, `mkt-ugc-scripts` | Post generation in brand voice, multi-platform |
| Content polish | `tool-humanizer` | De-AI's copy before it ships |
| Visuals / carousels | `viz-nano-banana`, `viz-excalidraw-diagram` | Images, infographics, carousel slides |
| AI education videos & guides | `viz-ugc-heygen`, `video-to-slides`, `mkt-content-repurposing` | Short how-to videos + written guides for the AI education library (one-to-many) |
| Website code/config | Claude Code on the Next.js/Vercel site | Schema, metadata, page builds, deploys |
| Scheduled jobs / monitoring | `ops-cron` | Recurring audits, ranking checks, AI-answer monitoring |
| Feedback / issues | `ops-user-feedback` | Tracking client requests |

**The compounding effect:** the more you templatize (report formats, content frameworks, a reusable site skeleton), the more AI carries and the lower your hours go over time. Hours-per-client should *fall* as you systematize — that's how a solo founder grows revenue without growing hours.

---

## Recurring Task Breakdown (per client, per month)

Human hours are *your* hours. "—" means the task isn't in that tier.

| Task | What AI does | What you do | AI % | Spark | Forge | Foundry |
|---|---|---|:---:|:---:|:---:|:---:|
| Monthly audit + report | Run audit, pull rankings, draft report | Set priorities, sanity-check, finalize | 80% | 0.75 | 0.75 | 1.0 |
| Dev-ready implementation specs *(Handoff)* | Draft exact change specs | Review before handoff | 75% | 0.5 | — | — |
| Website implementation *(Operator)* | Draft schema/metadata/page code | Review + deploy | 70% | — | 1.25 | 1.5 |
| AI-search optimization + answer monitoring | Structure content, schema, check AI answers | Judgment on what to change | 75% | 0.25 | 0.5 | 0.75 |
| GBP optimization | Draft posts/updates, flag gaps | Approve | 70% | 0.25 | 0.25 | 0.25 |
| Social content | Generate posts (skills + voice profile) | Review, edit, approve | 85% | 0.75 *(8)* | 1.25 *(12)* | 2.5 *(20+ & long-form)* |
| Review response drafting | Draft replies in voice | Approve | 85% | — | 0.4 | 0.5 |
| Post-it-yourself publishing | Optimize dropped content, build page | Review + publish | 70% | 0.1 | 0.25 | 0.25 |
| Monthly check-in call | Prep notes | The call | 30% | — | 0.5 | 0.75 |
| AI team training | Build materials | Deliver session | 60% | — | 0.33 *(qtrly amort.)* | 0.75 |
| AI automation consulting *(DWY)* | Build the automation | Scope + implement with client | 60% | — | — | 2.5 |
| AI tech-updates briefing | Draft once | Review | 85% | 0.05* | 0.05* | 0.05* |

\* *One-to-many: written once and sent to your whole client book, so the per-client cost is near zero.*

---

## Per-Tier Rollup

| Tier | Price/mo | Your hours/mo | Effective rate | Read |
|---|---|:---:|:---:|---|
| **Spark** (Handoff) | $600 | **~2.75 hr** | **~$218/hr** | Tiny time cost, great rate. Pure efficiency — ideal for filling capacity and capturing contract-locked leads. |
| **Forge** (Operator) ★ | $1,200 | **~5.5 hr** | **~$218/hr** | The sweet spot. High rate *and* moderate hours — this is the tier to push. |
| **Foundry** (Operator) | $2,200 | **~10.75 hr** | **~$205/hr** | Good rate, but eats 4× the hours of Spark. The capacity hog — cap it (see Danger Zones). |

**The headline:** all three tiers earn roughly the same per-hour (~$205–220/hr). That's healthy — well above part-time pay. The difference between them isn't profitability per hour, it's **how many of your finite hours each one consumes.**

---

## One-Time Work

| Work | Price | Your hours | Effective rate | Notes |
|---|---|:---:|:---:|---|
| **Setup** (per recurring client) | $500 | ~5 hr | ~$100/hr | Brand voice profile build (2–3h), baseline audit (1h), GBP cleanup (1h), folder/account setup (0.5h). Break-even — it's client acquisition cost, not profit. |
| **Website Rebuild** (on-ramp) | from $2,500 | ~17–22 hr | ~$115–145/hr | Discovery (2h), build on Next.js skeleton (8–12h), content migration + voice rewrite (3–4h), SEO/schema (2h), launch (2h). Lower rate because it's the foot-in-the-door to recurring. **If rebuilds keep landing under ~$130/hr, raise the floor to $3,000.** |

> Build a reusable **site skeleton** after the first 1–2 rebuilds. That's the single biggest lever to drop rebuild hours from ~20 to ~10 and push the rate toward $250/hr.

---

## Capacity Model — "Will this become a full-time job?"

**Stated assumption (your lever — change it):** ~25 hours/week on *delivery* = **~100 delivery hours/month.** The rest of your week is sales, onboarding, R&D, and admin.

**Fixed monthly overhead (not per-client):**
- AI tech-updates briefing (one-to-many): ~1 hr
- **AI education library** (1–2 short how-to videos/guides on using AI in a vet practice): ~2 hr — **one-to-many leverage:** build once, every client *and* prospect benefits, and it doubles as buyer-group authority content. The single highest-leverage hours you spend.
- Staying current on AI search (R&D — non-negotiable, it's the moat): ~3–4 hr
- Business admin: ~3–4 hr
- **~10–12 hr/mo fixed**, leaving **~88 hr** for per-client delivery.

**Ceilings by mix (at ~90 client-delivery hours):**

| Scenario | Clients | MRR | Reality |
|---|:---:|:---:|---|
| All Spark | ~32 | ~$19,200 | High MRR, but 32 relationships + 32 sales = heavy overhead |
| All Forge | ~16 | ~$19,200 | Same MRR, half the relationships — far less overhead |
| All Foundry | ~8 | ~$17,600 | Fewest clients, but each is a big time commitment + lumpy work |
| **Realistic mix** (30% Spark / 50% Forge / 20% Foundry) | **~16** | **~$19,500** | The likely real picture |

**What this tells you:**
- A solo, AI-leveraged VetForge tops out around **~$18–22k/mo MRR (~$220–260k/yr)** at current pricing and ~25 delivery hrs/week. That is *not* part-time pay — it's a strong solo income.
- Because all tiers are iso-priced per hour, **fewer high-value clients beats many low-value ones** — same delivery MRR, but less sales and admin drag. Push Forge.
- **To break the ceiling without hiring:** drive hours down (templates, automation) to lift the effective rate, or raise prices. Hiring help is the only other lever — and that ends "solo."

---

## Danger Zones (where the trap springs)

1. **Foundry over-selling.** At ~10.75 hr each, just 8 Foundry clients consume your entire delivery capacity. **Cap Foundry at 3–5 active clients** until you've systematized, or it quietly becomes your full-time job.
2. **Automation consulting (Foundry).** The lumpiest, least-AI-leverageable task. **Productize it:** one defined workflow per quarter, from a library of 3–4 pre-built vet automations (reminders, follow-ups, review requests). Don't custom-build from scratch each time.
3. **Content volume creep.** "20+" must mean ~20, not 35. Define the ceiling per tier and hold it.
4. **"Maintenance" as a catch-all.** Routine updates + SEO = included. Redesigns, new features, new sections = **separate project**, separately priced. Put this in writing.
5. **Revision spirals.** Cap at 2 revision rounds per deliverable; beyond that it's an add-on.
6. **Scope from calls.** A 15-min call that becomes a 45-min strategy session every month destroys the Forge rate. Hold the boundary or move them to Foundry.

---

## Guardrails (the rules that keep it solo)

- **Push Forge as the default recommendation.** Best hours-to-value, scales cleanly.
- **Batch across clients.** Write the tech-updates briefing once. Theme content by month. Run audits in a single weekly block via `ops-cron`, not ad hoc.
- **Templatize relentlessly.** Report template, content frameworks, reusable site skeleton. Every template lowers future hours.
- **Track actual hours per client, monthly.** If any client exceeds ~1.5× their model estimate two months running → right-size their tier or raise their price. No silent scope creep.
- **Protect the R&D block.** Staying ahead on AI search is the product. It's not overhead to cut — it's the thing clients pay for.
- **Write the exclusions down.** What's *not* included is as important as what is. Vague scope is how part-time pay happens.

---

## Beta Validation Plan — HPAH

Healthy Paws is your live test. **Note: HPAH is a Handoff (Spark-equivalent) client, not Operator** — they have their own web designer and a strong existing site, so you don't build/host/maintain it. Validate against the **Spark** numbers (~2.65–2.75 hr, $600), not Forge. The site rebuild you did was a one-time demo, and HPAH-beta also gets a few services beyond standard Spark (calls, training) — track those separately so they don't distort the read. See `2026-05-23_hpah-time-tracking-guide.md` for the tuned targets.

1. **Time-track everything for HPAH for one full month** — log actual minutes per task (use the time-tracking sheet).
2. **Compare actuals to the Spark model.** Where are you over? Audits? Content review? Web-dev plans?
3. **Find the AI gaps.** Any task running long is a task where AI isn't carrying enough yet — that's a skill to build or a template to make, not a reason to charge more.
4. **Recalibrate** the Spark estimate and price. If HPAH-as-Spark actually takes 5 hr not 2.65, either tighten the process or set the Handoff price above $600 *before* it's locked across a client base. Also decide what the beta extras (calls/training) are worth and which tier they belong in.
5. **Decide the real ceiling.** Once you know true hours, set the firm cap on total clients (and Foundry clients specifically) you'll take solo.

> HPAH is also your case study and your hours benchmark at the same time. Treat the beta month as paid R&D into your own unit economics.

---

## Quick-Reference Summary

| | Spark | Forge ★ | Foundry |
|---|---|---|---|
| Price/mo | $600 | $1,200 | $2,200 |
| Your hours/mo | ~2.75 | ~5.5 | ~10.75 |
| Effective rate | ~$218/hr | ~$218/hr | ~$205/hr |
| Strategy | Fill capacity, capture locked-in leads | **Push this** | Cap at 3–5 clients |
| Solo ceiling (≈90 hrs/mo) | ~32 | ~16 | ~8 |

**Bottom line:** at ~25 delivery hours/week you can run ~16 clients for ~$19–22k/mo MRR solo, at a healthy ~$210/hr — *if* you hold scope, push Forge, cap Foundry, and keep driving hours down with templates and automation. Validate the hours on HPAH before you scale.
