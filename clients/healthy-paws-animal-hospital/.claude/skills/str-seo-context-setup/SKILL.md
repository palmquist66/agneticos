---
name: str-seo-context-setup
description: >
  Build the SEO context foundation before any SEO or AEO work begins. This is "step zero" —
  the interactive interview that gathers business details, GBP data, competitor profiles,
  service areas, and target keywords into structured files that every other SEO skill reads.
  Use this whenever the user says "set up SEO context", "SEO intake", "SEO foundation",
  "business profile for SEO", "add competitors", "update GBP details", "update SEO context",
  or before running any SEO audit/optimization on a new client. Also trigger when starting
  an SEO project and `brand_context/seo/business-profile.md` doesn't exist yet — the context
  isn't set up. Do NOT trigger for actual SEO audits, content optimization, or keyword
  research — those are separate skills that consume this context.
---

# SEO Context Setup

The difference between generic SEO advice and business-specific SEO work is context. This skill builds that context through a structured interview, saving everything to files that every subsequent SEO prompt reads automatically. Run it once per client, update as things change.

## Outcome

Structured context files in `brand_context/seo/`:

```
brand_context/seo/
  business-profile.md    ← NAP, website, GBP URL, service areas, target keywords
  gbp-details.md         ← categories, attributes, services, photos, hours
  competitors/
    {competitor-slug}.md  ← one file per competitor
```

These files are the single source of truth for all SEO work. Every SEO skill reads from here instead of asking the user to repeat their business details.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `brand_context/seo/business-profile.md` | full | Check if setup already exists (update mode vs first-run) |
| `brand_context/seo/gbp-details.md` | full | Check existing GBP data |
| `brand_context/seo/competitors/` | scan filenames | Know which competitors are already profiled |
| `context/learnings.md` | `## str-seo-context-setup` section | Apply previous corrections |

## Skill Relationships

| Direction | Skill | Relationship |
|-----------|-------|-------------|
| Downstream | `str-ai-seo` | Reads business profile, GBP details, and competitors for AEO audits |
| Downstream | any future SEO skill | All SEO skills should check `brand_context/seo/` before starting |
| Upstream | `mkt-brand-voice` | Voice profile helps tone SEO content, but isn't required here |

## Before You Start

Check if `brand_context/seo/business-profile.md` exists.

- **Exists** → This is an **update session**. Show what's on file: "Here's what I have. What needs updating?" Let the user update specific sections without re-answering everything.
- **Doesn't exist** → This is a **first-run setup**. Walk through the full interview below.

Either way, read `context/learnings.md` → `## str-seo-context-setup` and apply any rules.

## Step 1: Business Profile

Gather the core business identity. Ask for everything in one block — don't drip-feed questions one at a time.

**Ask:**
> I need your business details to set up the SEO foundation. Give me as much as you have:
>
> 1. **Business name** (exactly as it appears on Google)
> 2. **Full address**
> 3. **Phone number**
> 4. **Website URL**
> 5. **Google Business Profile URL** (the maps.google.com link or the GBP dashboard URL)
> 6. **Service areas** — which cities/neighborhoods do you serve?
> 7. **Target keywords** — what searches should find you? (services + locations, e.g., "fear free vet lake in the hills", "cat vet algonquin il")

The user may not have all of these ready. Take what they give, note what's missing, and move on. Missing fields get marked `[TBD]` in the output file — they can fill gaps later.

**If the user provides a GBP URL or website URL**, offer to scrape it for details using `tool-firecrawl-scraper` or `WebFetch` to pre-populate fields they didn't provide (address, phone, service list, hours). This saves them from manually typing what's already public.

Save to `brand_context/seo/business-profile.md` using this format:

```markdown
# Business Profile — SEO Context

## Identity
- **Business name:** {name}
- **Address:** {full address}
- **Phone:** {phone}
- **Website:** {url}
- **GBP URL:** {url}

## Service Areas
{List of cities/neighborhoods served, one per line}

## Target Keywords
{List of target search terms, grouped by category if useful}

---
*Last updated: {YYYY-MM-DD}*
```

## Step 2: Google Business Profile Details

The GBP profile is the single most important local SEO asset. Capture its current state so audits can compare against competitors.

**Data gathering order (try each, use what works):**

1. **Firecrawl Yelp scrape** — scrape the Yelp listing for the business and each competitor. Yelp renders in Firecrawl and gives: services (verified), reviews, hours, photos, amenities. Save raw scrapes to `brand_context/seo/scraped/yelp-{slug}.md` for reference.
2. **Directory scraping** — search BirdEye, GeniusVets, TopVet, Checkbook for aggregated review data (includes Google reviews in the aggregate). Use WebSearch + WebFetch.
3. **WebSearch** — search for "{business name} {city} veterinarian" and similar to pick up categories, descriptions, and other data from Google's own search results.
4. **Co-work handoff** — for data that ONLY lives on the rendered Google Maps page (exact categories, attributes, GBP description, photo counts, posts), generate a co-work prompt. See `references/cowork-gbp-prompt.md` for the template.

**Ask the user what they have, then fill gaps automatically:**
> Now tell me about your Google Business Profile — what you have set up today:
>
> 1. **Primary category** (e.g., "Animal hospital", "Veterinarian")
> 2. **Secondary categories** (if any)
> 3. **Services listed** on GBP (the individual services, not categories)
> 4. **Attributes** you've enabled (e.g., "wheelchair accessible", "women-owned")
> 5. **Photo situation** — roughly how many? When were the last ones added? Team photos, facility, exterior?
> 6. **Hours of operation**
> 7. **Description** (the business description on GBP)

Take what they have. For anything they're unsure about, try to fill from Yelp/directory scrapes first. If gaps remain, generate the co-work prompt (Step 2B).

Save to `brand_context/seo/gbp-details.md` using the standard format (see existing files for template).

## Step 2B: Co-Work GBP Handoff (Browser Data)

Some GBP data only exists on the rendered Google Maps page and can't be scraped by any API or tool. When gaps remain after Step 2 (categories, attributes, description, photo counts, posts), generate a co-work prompt for the user.

**Read `references/cowork-gbp-prompt.md`** for the full template and instructions.

**Generate the prompt by:**
1. Reading all business/competitor URLs from `brand_context/seo/`
2. Filling the template with actual business names and Google Maps URLs
3. Outputting it as a single copyable code block
4. Telling the user:

> **Some GBP data can only be read from the live Google Maps page.** I've prepared a prompt you can paste into Claude co-work (browser mode). Here's how:
>
> 1. Open [claude.ai](https://claude.ai) in Chrome with the Claude extension active
> 2. Open Google Maps in another tab
> 3. Paste the prompt below into the co-work chat
> 4. Navigate to each URL when prompted — co-work reads the page and extracts the data
> 5. When done, copy the full output and paste it back here
>
> Takes about 5 minutes. I'll parse the output and update all the context files automatically.

**Only generate this if there are actual gaps.** If the user provided complete GBP data in the interview, skip this step entirely.

## Step 2C: Parse Co-Work Output

When the user pastes co-work output back into Code:

1. **Detect the format** — look for `=== GBP DATA:` markers
2. **Split by business** — each `=== GBP DATA: {name} ===` to `=== END: {name} ===` block is one business
3. **Extract fields** by line prefix: RATING, REVIEWS, PRIMARY_CATEGORY, SECONDARY_CATEGORIES, DESCRIPTION, ATTRIBUTES (multi-line), SERVICES (multi-line), PHOTOS, POSTS, HOURS, REVIEWS_SNAPSHOT
4. **Match to files:**
   - Client business name → update `brand_context/seo/gbp-details.md`
   - Competitor names → update matching `brand_context/seo/competitors/{slug}.md`
5. **Merge, don't overwrite** — keep existing Yelp/directory data and ADD the Google-specific fields
6. **Mark source** — add `[verified via GBP {date}]` next to fields that came from co-work

## Step 3: Competitor Profiles

Competitors are what make SEO audits actionable — you can't find gaps without something to compare against. Gather at least 2-3 competitors.

**Ask:**
> Who are your main local competitors? For each one, I need:
>
> 1. **Business name**
> 2. **Address** (or at least the city)
> 3. **Website URL**
> 4. **Google Business Profile URL** (if you have it — I can find it if not)
> 5. **Why they're a competitor** (same service area? Same specialty? Showing up where you want to rank?)

Let the user list them all at once or add them one by one. For each competitor, create a separate file at `brand_context/seo/competitors/{slug}.md`:

```markdown
# {Competitor Name} — Competitor Profile

## Identity
- **Business name:** {name}
- **Address:** {address}
- **Website:** {url}
- **GBP URL:** {url}

## Why They're a Competitor
{Brief note on competitive relationship}

## Known Strengths
{Fill from user input or mark "Needs research"}

## Known Weaknesses
{Fill from user input or mark "Needs research"}

---
*Last updated: {YYYY-MM-DD}*
```

The slug is the competitor name in lowercase with spaces replaced by hyphens (e.g., `winding-creek-animal-hospital.md`).

If the user doesn't have GBP URLs for competitors, search for them. A quick web search for "{competitor name} {city} google business profile" usually surfaces the link.

## Step 4: Validate and Summarize

After gathering everything, show the user a summary of what was captured:

```
SEO Context Setup Complete

Business: {name}
  Address: {address}
  Phone: {phone}
  Website: {url}
  GBP: {url}
  Service areas: {count} areas
  Target keywords: {count} keywords

GBP Profile:
  Primary category: {category}
  Services listed: {count}
  Photos: {status}

Competitors: {count}
  - {name 1}
  - {name 2}
  - {name 3}

Missing/TBD: {list any gaps}

Files saved:
  brand_context/seo/business-profile.md
  brand_context/seo/gbp-details.md
  brand_context/seo/competitors/{slug-1}.md
  brand_context/seo/competitors/{slug-2}.md
```

Ask: "Anything to add or fix? Otherwise this is locked in — every SEO prompt from here reads from these files."

## Step 5: Feedback

After the user confirms, ask: "How did this flow? Too many questions? Too few? Anything I should ask differently next time?"

Log feedback to `context/learnings.md` under `## str-seo-context-setup` with the date.

## Rules

*No rules yet — entries added when the user flags issues during runs.*

## Self-Update

If the user flags an issue with the interview flow — wrong questions, missing fields, bad file format, unnecessary steps — update the `## Rules` section in this SKILL.md immediately with the correction. Format: `- {YYYY-MM-DD}: {What was wrong and the rule to prevent it}`. Don't just log it to learnings; fix the skill so it doesn't repeat the mistake.
