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

## What doesn't work well
- 2026-03-29: Don't assume "we" framing — user is a contractor, not part of the client's business. Always use third-person for the practice in client-facing materials
- 2026-03-29: Don't assign tasks to specific roles (practice manager, front desk staff) in presentations — the consultant doesn't know the client's team structure
- 2026-03-29: Gamma has a 10-slide max — plan content to fit within that limit upfront


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
