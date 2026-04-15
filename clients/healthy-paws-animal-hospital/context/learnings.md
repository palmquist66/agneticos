# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well
- 2026-03-29: Firecrawl enrichment significantly improved brand context quality — real website copy made voice-profile and samples feel authentic vs. generic
- 2026-03-29: Reading .numbers files via `uv run --with numbers-parser` works reliably — good workaround for Apple spreadsheet data
- 2026-03-29: Gamma presentations with themed templates (Sprout for green/health) land well for client-facing materials
- 2026-03-31: For client-facing decks presenting to non-SEO audiences, explain every technical term inline. The audience is practice owners/managers, not marketers.
- 2026-04-06: Google Slides API via service account works for direct deck editing. Service account: `sgp-updater@sgp-model.iam.gserviceaccount.com`, key at `/Users/jamespalmquist/PycharmProjects/SGP Correlations NBA/credentials.json`. Share doc with service account email + enable Slides API in GCP console.
- 2026-04-06: `replaceAllText` is the cleanest approach for text fixes — one batch call for all replacements. Watch for curly vs straight quote mismatches (Gamma uses straight quotes).
- 2026-04-09: `replaceAllText` matches substrings — "Location Pages" will also match inside "Service/Location Pages". Use longer, more unique strings or fix collateral damage immediately.
- 2026-04-09: Google Slides API is good for text swaps but bad for visual layout work. Repositioning elements without seeing the result usually makes things worse. For layout changes, delete and rebuild with precise sizes, or let the user drag in Slides.
- 2026-04-09: Always confirm which section of a slide the user is referring to before deleting elements. Ask before acting on ambiguous references.
- 2026-04-12: Jim P does NOT manage the HP website — they have a separate developer/service. Website changes (service pages, schema, technical SEO) should be packaged as a developer handoff brief, not treated as something Jim P executes.
- 2026-04-12: For non-technical clients, convert markdown deliverables to email (plain text) or Google Doc/PDF format. Markdown files are useless to practice managers.

## What doesn't work well
- 2026-03-29: Don't assume "we" framing — user is a contractor, not part of the client's business. Always use third-person for the practice in client-facing materials
- 2026-03-29: Don't assign tasks to specific roles (practice manager, front desk staff) in presentations — the consultant doesn't know the client's team structure
- 2026-03-29: Gamma has a 10-slide max — plan content to fit within that limit upfront
- 2026-04-09: When outputting email drafts or copy for the user, use plain text — markdown formatting (bold headers, horizontal rules, indented blocks) can cause weird indentation in the terminal that the user has to fix manually


# Individual Skills
## meta-skill-creator

## mkt-brand-voice
- 2026-03-29: Firecrawl branding extraction (logo, colors, fonts) auto-populated assets.md — saves significant manual work
- 2026-03-29: Scraping 4+ pages (homepage, about, transparency, pet experience) gave enough voice samples to build a rich profile

## mkt-positioning
- 2026-03-29: "The Respectful Experience" angle approved — experience-first framing differentiates well in a market where every vet claims "compassionate care"

## mkt-icp

## str-ai-seo

## meta-wrap-up

## tool-firecrawl-scraper

## str-trending-research

## viz-nano-banana

## viz-ugc-heygen

## mkt-ugc-scripts

## ops-cron

## mkt-content-repurposing

## mkt-copywriting

## tool-humanizer
- 2026-03-30: Em dashes are a strong AI tell in casual/short-form content — replace with periods or commas. Even 2 in a short email is too many. Be more aggressive about flagging these.
- 2026-03-31: Always run humanizer BEFORE sending to Gamma, not after. Can't edit Gamma decks after generation.
- 2026-03-31: Presentation decks for non-technical audiences need all acronyms (NAP, DR, GBP, AEO) explained inline on first use. Don't assume the audience knows SEO terminology.
- 2026-03-31: Slide titles like "The Easiest Wins I've Ever Seen" read as clickbait/AI. Use factual titles that describe the content.

## tool-youtube

## viz-excalidraw-diagram

## tool-stitch

## viz-stitch-design

## str-seo-context-setup
- 2026-04-14: Google Maps pages are completely unscrappable — even Firecrawl with stealth mode and browser actions only returns the navigation shell. Google aggressively blocks headless browsers.
- 2026-04-14: Yelp scraping via Firecrawl works excellently — returns 40-50K chars per listing with services, reviews, hours, photos, amenities, and review themes.
- 2026-04-14: Directory scraping (BirdEye, Checkbook, GeniusVets, TopVet) fills Google review aggregates and pricing data that neither Google Maps nor Yelp provide directly.
- 2026-04-14: Data gathering should follow this priority: (1) Firecrawl Yelp scrape, (2) directory scraping via WebSearch, (3) co-work handoff for Google Maps-only data (categories, attributes, description, photo counts, posts).
- 2026-04-14: load_dotenv needs `override=True` to work when FIRECRAWL_API_KEY exists as empty string in environment.

## str-gbp-audit
- 2026-04-14: The audit ran with incomplete data (estimated categories, unknown attributes/photos/description). Enriching context files with Firecrawl Yelp scrapes before running the audit produces significantly better competitor comparisons.
- 2026-04-14: Co-work hybrid approach: Code does analysis/deliverables, co-work (Chrome extension) reads rendered Google Maps pages for data Code can't scrape. User pastes structured output back into Code for parsing.
