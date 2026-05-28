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
- 2026-05-23: For verbatim content audits, Firecrawl markdown scrape beats WebFetch (WebFetch paraphrases via a small model). Use Firecrawl `map` to get the real live URL inventory before guessing slugs.
- 2026-05-23: To screenshot a LOCAL site for visual comparison, Playwright with the system Chrome works with no bundled browser download: `chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })`. Pair with live full-page Firecrawl screenshots to compare a WP→Astro rebuild section by section.
- 2026-05-24: To privatize a Vercel demo on the FREE/Hobby plan, plan-level Deployment Protection does NOT work — "Standard Protection" leaves the production `*.vercel.app` URL public (only preview/hash URLs get 401), and Password / "All Deployments" protection need the $150/mo Pro add-on. Free, reliable fix: a Vercel Edge Middleware at the project root (`middleware.ts` + `@vercel/edge`) enforcing HTTP Basic Auth on `matcher: '/:path*'` — runs per-request on ALL URLs incl. production, plan-independent. Works for a static Astro site (middleware.ts at root, NOT src/, so Astro ignores it; only Vercel bundles it). Gotcha: the `WWW-Authenticate` realm must be plain ASCII — an em dash in it made the runtime drop the header, so the browser never showed the login prompt (just rendered the 401 body).
- 2026-05-28: When the gws Google Slides path is down, Gamma (MCP) is a reliable presentation fallback — generates a clean deck fast and exports to PPTX, which imports straight into Google Slides via File → Import slides. Used it for Karen's call deck. (Gamma adds an em-dash byline by default — strip it, James never uses em dashes.)
- 2026-05-28: For local-business GA4 analysis, NEVER trust topline traffic/form numbers at face value. Two traps caught this session: (1) generic `form_submit` lumped new-patient leads with ~72% existing-client admin (refills/records) — segment by the specific tagged events instead; (2) topline sessions were inflated by bots/overseas (more traffic from Lanzhou + Singapore than local Chicago). Always segment leads by specific event, check geography for local vs national, and anchor client-facing numbers on the purest signal (here: appointment-form submissions) with precise wording ("inbound contacts," not "new patients").
- 2026-05-28: When walking a non-technical client (or James) through an analytics/martech tool, screenshots-one-at-a-time works but is slow. For a one-time baseline it's fine; flag early that the scalable path is the API/MCP, not endless screenshots. James values a saved cheat sheet + "what to ignore" prioritization after any tool walkthrough.

## What doesn't work well
- 2026-03-29: Don't assume "we" framing — user is a contractor, not part of the client's business. Always use third-person for the practice in client-facing materials
- 2026-03-29: Don't assign tasks to specific roles (practice manager, front desk staff) in presentations — the consultant doesn't know the client's team structure
- 2026-03-29: Gamma has a 10-slide max — plan content to fit within that limit upfront
- 2026-04-09: When outputting email drafts or copy for the user, use plain text — markdown formatting (bold headers, horizontal rules, indented blocks) can cause weird indentation in the terminal that the user has to fix manually
- 2026-04-20: Markdown files don't paste cleanly into Google Docs — tables break, syntax shows through. For client-facing docs, create a separate Google Docs-friendly version: ALL CAPS headers, bullet lists instead of tables, no markdown syntax
- 2026-04-20: Business name "JP Digital Works" is not confirmed. Use "Jim Palmquist" and palmquist66@gmail.com until decided. Don't use jpdigitalworks.com email or JP Digital Works branding in any deliverables
- 2026-05-08: GBP API access: James does NOT have GBP manager access for HPAH (pending Karen's approval). Competitor data IS accessible via public Google Maps scraping/browsing. Don't confuse API access (requires manager role) with public data access (anyone can browse). When discussing automation, be accurate about what's accessible now vs what requires pending permissions.
- 2026-05-15: AI visibility testing means querying actual AI models (ChatGPT, Perplexity, Claude) and recording their responses — NOT running web searches to see what sources exist. Web search shows what Google ranks; AI visibility shows what AI models actually recommend. These are different things. For a proper test: answer as Claude from training data, then have the user run the same queries in ChatGPT and Perplexity for a 3-model comparison.
- 2026-05-18: When drafting text messages for James, keep them SHORT. First drafts tend to run long — a text message should be 1-3 sentences max. James will rewrite in his own voice anyway; shorter drafts are closer to what he actually sends.
- 2026-05-22: Always run humanizer on ANY text output the user will send — email drafts, text messages, copy, etc. Don't wait for the user to ask. Treat it like a pipeline step: draft → humanize → present.
- 2026-05-23: When making a rebuild's nav match a live site, don't orphan NEW pages. The live nav won't link pages that don't exist on the live site (e.g., GEO/location pages), so matching it can hide the very additions being showcased. Keep new pages linked via an added nav/footer section. (Caught only because James asked "where are the location pages?")
- 2026-05-23: Verify the EXACT URL handed to the user is publicly reachable. Vercel custom aliases sit behind Deployment Protection (401) while the auto-assigned production domain (`<proj>-<scope>.vercel.app`) is public. I gave the protected alias first — check with a fetch before sharing.
- 2026-05-23: Vercel CLI device-login can report "signed in" but silently NOT persist the token on old versions (Homebrew/npm-global v50.22.1 left an empty 3-byte auth.json). Fix: `npm i -g vercel@latest` (v54+), then re-login. Always confirm with `vercel whoami`, not the login success message.
- 2026-05-24: Verify the RENDERED output (built HTML / live DOM), not just the source, before telling the user a visual property is correct. Claimed the service-card images were uniform height because the source had `h-44`; the built HTML showed the class was silently overridden by an unlayered `img{height:auto}` in global.css. Checking `dist/` caught it — after two wrong reassurances.
- 2026-05-24: Before declaring anything "locked"/"safe"/"done," test EVERY relevant URL/endpoint, not a sample. Told James the Vercel demo was private after checking 2 of 5 aliases (both 401); a 3rd alias — the production domain — was serving the full site publicly. Took the whole deployment offline to be sure. (Extends the 2026-05-23 Vercel-URL lesson.)
- 2026-05-24: A fresh Vercel project's FIRST deploy auto-targets PRODUCTION (creates the public `<project>.vercel.app` alias) even with a bare `vercel deploy` — no `--prod` needed. This leaked HPAH content twice before the Basic-Auth middleware gate was in place. Don't deploy client content to a new Vercel project assuming it's a private preview; put the protection in place first, deploy, then verify with a no-auth fetch (expect 401) BEFORE sharing. Note: after the first deploy, subsequent `vercel deploy` calls ARE previews — to update the shared production URL you must use `vercel deploy --prod`.
- 2026-05-24: Load saved persistent memory (user/feedback preferences) BEFORE drafting anything the user will send, not at wrap-up. Drafted Karen's email with em dashes despite a saved `no-em-dashes` feedback memory; only caught it when reading MEMORY.md during wrap-up. Check MEMORY.md at the start of any content task.
- 2026-05-26: Reinforces 2026-05-18 — when James asks for a text to Karen, give the bare human sentence(s) and NOTHING else. Keep strategic framing OUT of the text itself (he rejected "which is actually a big part of what I want to talk through" as too much). He also rejected explanatory commentary wrapped around the draft. Default: one or two plain sentences, no angle, no pitch baked in. The strategy lives in the call prep, not the text.
- 2026-05-28: Check beta/free status before putting ANY pricing into a client deliverable. Drafted Karen's call-prep with a paid-offer frame; James corrected — HPAH is a free beta customer (it's in the client CLAUDE.md). Reframed "free + zero risk" as a strength.
- 2026-05-28: When a tool's auth fails, confirm whether it's config or the tool BEFORE recreating credentials. Sank time into gws Google auth (logout/login, building a brand-new OAuth client) — a fresh, valid Desktop client threw the IDENTICAL "missing response_type" error, proving it's a gws bug, not config. One fresh-client test would have saved the whole detour.


# Individual Skills
## meta-skill-creator

## mkt-brand-voice
- 2026-03-29: Firecrawl branding extraction (logo, colors, fonts) auto-populated assets.md — saves significant manual work
- 2026-03-29: Scraping 4+ pages (homepage, about, transparency, pet experience) gave enough voice samples to build a rich profile

## mkt-positioning
- 2026-03-29: "The Respectful Experience" angle approved — experience-first framing differentiates well in a market where every vet claims "compassionate care"

## mkt-icp

## str-ai-seo
- 2026-05-06: Local GEO is fundamentally different from content-site GEO — requires geographic precision, entity consistency, and review ecosystem signals on top of content optimization
- 2026-05-06: ChatGPT now pulls GBP data directly for local queries — GBP posting (what Karen is doing) feeds the AI pipeline, not just traditional local SEO
- 2026-05-06: Reddit appears in 40% of AI-generated answers. Zero Reddit presence = zero citations from the highest-impact community source. Even a few helpful comments per month compound over time
- 2026-05-06: ChatGPT recommends only 1.2% of local businesses; Perplexity 7.4%; Gemini 11%. AI local visibility is up to 30x harder than traditional Google ranking
- 2026-05-06: 43% of AI citations come from FAQ-structured content with schema markup — FAQ sections with FAQPage schema are the single highest-performing content pattern for AI citations
- 2026-05-06: Only 8.6% overlap between ChatGPT and Perplexity recommendations — need broad coverage across multiple platforms, not single-channel optimization

## meta-wrap-up

## tool-firecrawl-scraper
- 2026-05-22: After replacing AI copy with WP content, user still sees mismatches on visual comparison. Need a systematic page-by-page side-by-side review (open WP page + Astro page together) rather than trusting scraped markdown alone. Markdown scrapes miss layout, emphasis, and structural nuances that only visual comparison catches.

## str-trending-research

## viz-nano-banana

## viz-ugc-heygen

## mkt-ugc-scripts

## ops-cron

## mkt-content-repurposing

## mkt-copywriting
- 2026-05-24: Comms with Karen (HPAH) are friend-to-friend, not consultant-to-client. James is a friend helping out; HPAH is a beta customer. Write friendly, personal, first-person — use "I", never "we"/agency voice. Don't sell the website (a 3rd-party designer builds it); the framing is "here's what the additions would look like," not a pitch.

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

## str-90-day-plan
- 2026-05-28: First run for HPAH. Worked well grounded in rich session context (passed access status, GA4 findings, positioning, ICP via args) — no long interview needed. Led with a ranked priority list (what James actually asked for) BEFORE the phased roadmap, and tagged every task NOW/GBP/WP by access dependency. Key value-add: surfacing that the top 3 growth levers (conversion tracking, GBP, reviews) need no WordPress, so growth isn't blocked on the takeover. For a local service business, used "lead milestones" instead of revenue milestones. Saved to the project brief folder (per user instruction) rather than the default `projects/str-90-day-plan/`.

## str-gbp-audit
- 2026-04-14: The audit ran with incomplete data (estimated categories, unknown attributes/photos/description). Enriching context files with Firecrawl Yelp scrapes before running the audit produces significantly better competitor comparisons.
- 2026-04-14: Co-work hybrid approach: Code does analysis/deliverables, co-work (Chrome extension) reads rendered Google Maps pages for data Code can't scrape. User pastes structured output back into Code for parsing.
- 2026-04-14: Step 1 (Category Audit) must ASK the user for 3 target keywords before running — don't pick silently from the keyword list. The user chooses which searches matter most.
