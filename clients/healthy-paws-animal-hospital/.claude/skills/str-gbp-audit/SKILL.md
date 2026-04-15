---
name: str-gbp-audit
description: >
  Full Google Business Profile audit — competitive analysis across 8 dimensions:
  categories, attributes, reviews, review responses, posts, services, description,
  and photos. Run the complete audit for new clients or individual steps for targeted
  updates. Use this whenever the user says "GBP audit", "Google Business Profile audit",
  "map pack audit", "local SEO audit", "category audit", "attribute audit", "review
  analysis", "review response", "GBP posts", "GBP photos", "services section", "GBP
  description", "competitor GBP", or wants to compare their listing against competitors.
  Also trigger when working on any local SEO project and competitive GBP data hasn't
  been gathered yet. Do NOT trigger for website SEO, content writing, or AEO optimization
  — those are separate skills.
---

# GBP Audit

An 8-step competitive audit of Google Business Profile listings. Each step follows the same pattern: gather data from your listing and competitors, build a comparison, find gaps, and produce an actionable deliverable. Run all 8 for a complete audit or pick individual steps.

The difference between this and generic GBP advice: every step runs against real competitor data from `brand_context/seo/`. No guessing — just gap analysis and deliverables.

## Outcome

Per-step deliverables saved to the active project folder (e.g., `projects/briefs/{project}/`) or `projects/str-gbp-audit/` if no project is active. Each step produces a dated file with the comparison data and actionable output.

| Step | Output file | What it contains |
|------|------------|------------------|
| 1. Category Audit | `{date}_gbp-category-audit.md` | Category comparison matrix + missing categories |
| 2. Attributes Audit | `{date}_gbp-attributes-audit.md` | Attribute gap analysis + baseline requirements |
| 3. Review Teardown | `{date}_competitor-review-teardown.md` | Velocity analysis + catch-up targets |
| 4. Review Response | `{date}_review-response-strategy.md` | Response comparison + template system |
| 5. Posts Strategy | `{date}_gbp-posts-strategy.md` | Competitor post analysis + 8-week calendar |
| 6. Services Optimization | `{date}_gbp-services-optimization.md` | Service gap analysis + optimized descriptions |
| 7. Description Optimization | `{date}_gbp-description-optimization.md` | Description comparison + 3 optimized versions |
| 8. Photo Audit | `{date}_gbp-photo-audit.md` | Photo comparison + 8-week upload plan |

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `brand_context/seo/business-profile.md` | full | Business NAP, GBP URL, service areas, target keywords |
| `brand_context/seo/gbp-details.md` | full | Current GBP categories, services, attributes, photos |
| `brand_context/seo/competitors/*.md` | full | Competitor names, GBP URLs, websites |
| `context/learnings.md` | `## str-gbp-audit` section | Previous corrections and feedback |

**If `brand_context/seo/` doesn't exist**, tell the user: "SEO context isn't set up yet. Run the SEO context setup first so I have your business details and competitor URLs — otherwise I'm working blind." Point them to `str-seo-context-setup`.

## Skill Relationships

| Direction | Skill | Relationship |
|-----------|-------|-------------|
| Upstream | `str-seo-context-setup` | Provides business profile + competitor data this skill reads |
| Downstream | `str-ai-seo` | AEO optimization builds on GBP audit findings |
| Related | `mkt-copywriting` | Review response templates and GBP descriptions may benefit from brand voice |

## Before You Start

1. **Load SEO context** — read all files from `brand_context/seo/`. If missing, stop and direct user to `str-seo-context-setup`.
2. **Check data completeness** — scan `brand_context/seo/gbp-details.md` and competitor files for gaps (fields marked "Unknown", "needs verification", "TBD"). If significant gaps exist (missing categories, attributes, photo counts, description), offer: "Some GBP data is missing — want me to generate a co-work prompt so you can grab it from Google Maps in the browser? Takes about 5 minutes." If yes, read `str-seo-context-setup/references/cowork-gbp-prompt.md` and generate the prompt. If no, proceed with what's available and note gaps in the audit output.
3. **Load learnings** — read `context/learnings.md` → `## str-gbp-audit`. Apply any rules.
4. **Determine scope** — ask the user:
   - "Full audit (all 8 steps) or specific steps?"
   - If specific: let them pick by name or number
5. **Determine output location** — check for an active project in `projects/briefs/` with SEO in the name. If found, save there. Otherwise save to `projects/str-gbp-audit/`.

## Step 1: GBP Category Audit

If your categories are wrong, nothing else matters. Categories control which searches trigger your listing in the map pack.

Read [references/category-audit.md](references/category-audit.md) for the full methodology.

**Quick summary:** Search 3-5 target keywords on Google Maps, note which competitors appear, extract their primary + secondary categories, build a comparison matrix, highlight categories you're missing.

**Key deliverable:** Category gap list — which categories to add to your GBP immediately.

## Step 2: GBP Attributes Audit

Attributes are the tags on your listing — "veteran-owned", "free estimates", "24/7 availability". Google matches searchers to businesses using these. Your competitors have attributes you don't.

Read [references/attributes-audit.md](references/attributes-audit.md) for the full methodology.

**Quick summary:** Extract every visible attribute from your listing and competitors, build a comparison matrix, identify baseline requirements (what ALL top competitors share) vs differentiators.

**Key deliverable:** Attribute gap list with baseline vs differentiator classification.

## Step 3: Competitor Review Teardown

Star ratings tell you almost nothing. Review velocity — how fast competitors get new reviews — is the real metric. A business with 200 old reviews is weaker than one with 90 reviews gaining 15/month.

Read [references/review-teardown.md](references/review-teardown.md) for the full methodology.

**Quick summary:** Analyze last 50 reviews per competitor for velocity (30/60/90 day counts), mentioned services, mentioned neighborhoods, and recurring complaints. Calculate your catch-up target.

**Key deliverable:** Monthly review target + keyword/location signals from competitor reviews.

## Step 4: Review Response Strategy

How you respond to reviews affects ranking AND conversions. Responses are free keyword real estate — each one mentioning your service and city is indexed content on your GBP.

Read [references/review-response.md](references/review-response.md) for the full methodology.

**Quick summary:** Analyze how competitors respond (rate, speed, tone, keyword usage), then build a template system with 3 variations each for 5-star, 4-star, 3-star, and 1-2 star reviews.

**Key deliverable:** Review response template system — respond to any review in under a minute.

## Step 5: GBP Posts Strategy

Most businesses don't know GBP posts exist. Posting consistently signals to Google that your business is active. Active businesses get preferred placement.

Read [references/posts-strategy.md](references/posts-strategy.md) for the full methodology.

**Quick summary:** Check competitor post frequency and content, then build an 8-week posting calendar with 2-3 posts/week covering seasonal promotions, before-and-afters, neighborhood-specific content, review highlights, and team spotlights.

**Key deliverable:** 8-week posting calendar with full copy for the first 4 weeks.

## Step 6: Services Section Optimization

The services section is prime keyword real estate that almost nobody optimizes. Most businesses leave descriptions blank — that's like having a landing page with just a title.

Read [references/services-optimization.md](references/services-optimization.md) for the full methodology.

**Quick summary:** Compare services listed across competitors, cross-reference against the business website to catch missing services, then write optimized 2-3 sentence descriptions for every service.

**Key deliverable:** Complete services list with optimized keyword-rich descriptions.

## Step 7: GBP Description Optimization

750 characters of controlled real estate. Most businesses waste it with generic copy or keyword stuffing. Your description needs to rank, convert, AND sound human.

Read [references/description-optimization.md](references/description-optimization.md) for the full methodology.

**Quick summary:** Extract and analyze competitor descriptions, identify positioning gaps, then write 3 versions: keyword-focused, conversion-focused, and balanced. All include target keywords and service areas.

**Key deliverable:** 3 testable description versions — rotate monthly and track which performs best.

## Step 8: GBP Photo Audit

Businesses with photos get 42% more direction requests and 35% more click-throughs. But it's consistency that matters — 3-5 quality photos weekly beats 50 uploaded at once.

Read [references/photo-audit.md](references/photo-audit.md) for the full methodology.

**Quick summary:** Count and categorize photos across competitors (total, last 90 days, types), then build an 8-week upload plan focused on before-and-afters, team shots, and neighborhood-specific images.

**Key deliverable:** 8-week photo upload plan with specific shot types per week.

## After Each Step

1. **Save the deliverable** to the output location with date prefix
2. **Show the full file path** so the user can click to open it
3. **Ask if they want to continue** to the next step or stop here

## After Full Audit

Summarize all findings in a single overview:
- Top 3 quick wins (things to change today)
- Top 3 strategic gaps (things that need a plan)
- Competitor strengths to watch
- Recommended priority order for implementation

Ask: "How did this land? Anything missing or off-base?" Log feedback to `context/learnings.md` → `## str-gbp-audit`.

## Rules

- 2026-04-14 (Step 1): Before running the category audit, ASK the user for 3 target keywords to search on Google Maps. Don't assume or pick from the keyword list silently — the user needs to choose which searches matter most to them. These 3 keywords drive the entire category comparison matrix.

## Self-Update

If the user flags an issue with any audit step — wrong data format, missing comparison, bad template, incorrect analysis — update the `## Rules` section in this SKILL.md immediately with the correction and the step number. Format: `- {YYYY-MM-DD} (Step {N}): {What was wrong and the rule to prevent it}`. Don't just log it to learnings; fix the skill so it doesn't repeat the mistake.
