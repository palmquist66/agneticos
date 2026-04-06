---
name: str-90-day-plan
description: >
  Generate a 90-day survival plan for any project — product launches, SaaS apps,
  service businesses, side hustles, content plays. Produces week-by-week action plans
  with tasks sized for a kanban board. Use this skill whenever the user mentions:
  "90-day plan", "90 day plan", "survival plan", "launch plan", "first 90 days",
  "3-month plan", "quarterly plan", "growth plan", "go-to-market plan", "GTM plan",
  "how do I launch this", "what should I do first", "roadmap for the next 3 months",
  "action plan", or any request to plan the next ~12 weeks of work for a project.
  Also trigger when the user has a project and asks "what now?" or "where do I start?"
  — that's a 90-day plan waiting to happen. Do NOT trigger for: content calendars
  (use mkt-content-repurposing), keyword/SEO strategy (use str-ai-seo), brand voice
  work (use mkt-brand-voice), or single-task planning that doesn't span weeks.
---

# 90-Day Survival Plan Generator

Build a phased, week-by-week action plan that takes a project from its current state to a meaningful milestone in 90 days. Every task is sized and described so it can drop straight into a kanban board.

## Outcome

A markdown file saved to `projects/str-90-day-plan/{YYYY-MM-DD}_{project-slug}-90-day-plan.md` containing:
- Header with goal, positioning, current state
- 3 phases (roughly monthly), each with weekly task tables
- Milestones per week and per phase
- Daily action checklist
- Revenue milestones (if revenue applies)
- Early warning signs with diagnoses and fixes
- Competitive advantages to protect

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `brand_context/positioning.md` | summary | Align phases with the project's positioning angle |
| `brand_context/icp.md` | full | Understand who the user/customer is so tasks target the right audience |
| `brand_context/voice-profile.md` | tone only | Match plan language to brand voice |
| `context/learnings.md` | `## str-90-day-plan` section | Apply lessons from previous plan generations |

## Skill Relationships

**Upstream (consumes from):**
- `mkt-positioning` — if positioning exists, the plan aligns Phase 1 around delivering the core positioning promise
- `mkt-icp` — acquisition tasks in Phase 2 target channels where the ICP hangs out

**Downstream (feeds into):**
- Kanban boards — every task includes a size estimate (S/M/L) and difficulty rating so it can be added to a kanban directly
- `mkt-copywriting` — content tasks in Phase 2 can be handed off to copywriting
- `str-ai-seo` — SEO tasks in the plan can be expanded with the AI SEO skill

**No trigger conflicts** with existing `str-*` skills (ai-seo triggers on SEO terms, trending-research triggers on research terms).

## Before You Start

Read `context/learnings.md` section `## str-90-day-plan` for any lessons from previous runs.

Determine the project type — this shapes the plan structure:

| Type | Phase 1 focus | Phase 2 focus | Phase 3 focus |
|------|--------------|--------------|--------------|
| **Product / App** | Ship the differentiator | Get first users | Monetization + retention |
| **Service / Consulting** | Build offer + first free clients | Convert to paid + get referrals | Systemize + recurring revenue |
| **Content / Media** | Content engine + distribution setup | Audience growth + engagement | Monetization (ads, sponsors, products) |
| **Marketplace / Platform** | Supply-side seeding | Demand-side acquisition | Matching + retention + monetization |

## Step 1: Gather Project Context

Collect these inputs — pull from brand context files if they exist, otherwise ask the user:

1. **Project name and one-line description**
2. **Project type** (product, service, content, marketplace)
3. **Current state** — what's already built/done vs what's not (be specific: features, infrastructure, content, clients)
4. **90-day goal** — one measurable target (e.g., "100 active users", "$1K/month revenue", "10 paying clients")
5. **Positioning angle** — what makes this different from alternatives (pull from `positioning.md` if available)
6. **Target audience** — who are the first users/customers (pull from `icp.md` if available)
7. **Known competitors** — what exists already and what's saturated
8. **Revenue model** — free, freemium, paid, subscription, one-time, retainer (or "figure it out" — that's fine, the plan will address it)
9. **Constraints** — solo founder? Limited budget? Part-time? These shape task sizing.

If brand context files exist, extract answers silently and confirm with the user: "I pulled your positioning and ICP from brand context — does this still hold, or has anything changed?"

## Step 2: Define the Three Phases

Each phase gets a name, a focus area, and a theme sentence that explains WHY this phase matters before the next one can start.

The phases follow a natural progression — you can't grow users before the product delivers on its promise, and you can't monetize before you have users. The specific focus depends on project type (see the table in "Before You Start").

**Phase structure:**
- **Phase 1 (Weeks 1-4): [Name]** — Make the core value proposition real. If there's a gap between what the marketing promises and what the product delivers, close it here. For services, this means having a clear offer and first proof points.
- **Phase 2 (Weeks 5-8): [Name]** — Get people using/buying it. Content, outreach, community seeding, referrals. The product works; now make it findable.
- **Phase 3 (Weeks 9-12): [Name]** — Sustainability. Revenue, retention, systems. Turn early traction into something that doesn't require daily heroics.

Each phase should feel like it has a clear "done" state — a milestone that's objectively checkable.

## Step 3: Build Weekly Task Tables

For each week (or 2-week block for Phases 2-3), create a task table:

```markdown
### Week N: [Theme Name]

| Task | Deliverable |
|------|-------------|
| [Specific action verb + what to do] | [Concrete output — what exists when this is done] |

**Week N Milestone:** [One sentence — objectively verifiable]
```

**Task writing rules:**
- Start every task with a verb (Build, Write, Add, Set up, Fix, Create, Design, Ship)
- Every task has a concrete deliverable — not "work on X" but "X is live and doing Y"
- Tasks should be completable in 1-2 days by one person (break larger work into subtasks)
- 3-5 tasks per week (focused, not overwhelming)
- Each task gets an implicit size: S (<2 hrs), M (2-6 hrs), L (6+ hrs) — used when transferring to kanban

**Adapt weekly detail by phase:**
- Phase 1: Individual weekly tables with specific tasks (this is where the real building happens)
- Phase 2: Can group into 2-week blocks if appropriate
- Phase 3: Can be higher-level with strategic direction + specific tasks

## Step 4: Add Support Sections

After the phase tables, add these sections:

**Daily Action Checklist** — 3-5 daily habits that compound over 90 days. These are the "never zero days" actions. Format as checkbox items.

**Revenue Milestones** (if applicable) — Table with Week 4 / 8 / 12 targets and "minimum viable" thresholds.

**Early Warning Signs** — For each phase boundary (Week 2, 4, 8, 12), describe:
- The red flag condition
- The likely problem behind it
- A concrete fix or pivot

These are important because they prevent the user from spending weeks on a failing approach. Be direct and specific — "If X, the problem is probably Y. Fix: do Z."

**Competitive Advantages to Protect** — 4-6 bullet points. What's worth defending and why. This keeps strategic focus when daily tasks get noisy.

## Step 5: Generate Kanban-Ready Task Summary

After the full plan, add a section that lists ALL tasks in a single table, ready to copy into a kanban board:

```markdown
## Kanban Task Summary

| # | Task | Phase | Week | Size | Difficulty |
|---|------|-------|------|------|------------|
| 1 | [task] | 1 | 1 | M | Medium |
```

**Size:** S = <2 hrs, M = 2-6 hrs, L = 6+ hrs
**Difficulty:** Easy / Medium / Hard

This table is the bridge between the narrative plan and the execution system. The user should be able to copy this table into their kanban board directly.

## Step 6: Save Output

Always save output to disk. This is not optional.

1. Create `projects/str-90-day-plan/` if it doesn't exist
2. Save as `projects/str-90-day-plan/{YYYY-MM-DD}_{project-slug}-90-day-plan.md`
3. Show the user the full absolute file path so they can click it directly

After saving, ask: "Want me to add these tasks to your kanban board? I can update `business-kanban.md` with the Phase 1 tasks in the Approved column."

## Step 7: Feedback Collection

Ask: "How does this plan land? Anything feel off — too aggressive, too conservative, missing a phase?"

Log feedback to `context/learnings.md` under `## str-90-day-plan` with date and context.

If the user flags an issue with the output — wrong approach, bad format, missing context, incorrect tone — update the `## Rules` section in this SKILL.md immediately with the correction.

## Rules

- 2026-04-02: Phase 1 must always address the gap between positioning promise and product reality — if the marketing says X and the product doesn't do X yet, Phase 1 closes that gap
- 2026-04-02: Tasks must be specific enough to be kanban cards — "improve the product" is not a task, "add PDF export with weight chart and medication timeline" is
- 2026-04-02: Revenue milestones should be realistic for solo/small-team projects — don't project $10K MRR in 90 days for a side project
- 2026-04-02: Early warning signs are not optional — every plan needs them because most plans fail from not pivoting early enough

## Self-Update

If the user flags an issue with the output — wrong approach, bad format, missing context, incorrect tone — update the `## Rules` section in this SKILL.md immediately with the correction. Don't just log it to learnings; fix the skill so it doesn't repeat the mistake. Format: `- {YYYY-MM-DD}: {What was wrong and the rule to prevent it}`
