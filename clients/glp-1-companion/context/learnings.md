# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well
- 2026-05-23: For native-module integrations where the package isn't installed yet, `require()` the module lazily inside platform branches and type it as `any`. The wrapper file (`lib/health.ts`) then type-checks clean *before* `npx expo install` runs, isolating native-API specifics to one file. Pairs well with verifying exact API signatures against the library's source on GitHub (`gh api .../git/trees/master?recursive=1` + fetch the file) rather than guessing — caught that kingstinct's query `filter` is a nested `date:{startDate,endDate}` of Date objects, not flat ISO strings.
- 2026-05-23: When adding a new sync source, mirror the existing one's data model instead of inventing a parallel one. Native health slotted into the Dexcom pattern exactly (DataSourceConnection + SyncLog + `source` tag + composite-unique dedup) because the schema already documented `apple_health` and `/api/sync/status` already stubbed it. Read the established pattern first.

## What doesn't work well
- 2026-05-06: When adding API routes that need to be called externally (cron, webhooks, service workers), always check the auth middleware (e.g. Clerk's `proxy.ts`) and add them to the public routes list DURING implementation — not after debugging 401s.
- 2026-05-06: Always inspect existing data formats before writing parsers. Medication schedule `times` were stored as `"1753"` not `"17:53"` — the time-matching code should have handled both formats from the start. Check Prisma Studio for actual data shapes before coding.
- 2026-05-06: When adding env vars to `.env`, always verify they were written (grep immediately after) and restart the dev server. Next.js only reads `.env` at startup. Multiple debugging rounds were caused by env var mismatches.
- 2026-05-06: Next.js `force-dynamic` + unbounded Prisma queries + Turbopack dev mode is a machine-crashing combo on resource-constrained hardware (Mac Mini). Always add `take:` limits to every `findMany` query — even when a `where` clause seems sufficient. Combined with `revalidatePath` cascades that re-trigger those queries, the memory spiral happens fast. Use `revalidate = N` instead of `force-dynamic` on data-heavy pages. Run `next start` (production) instead of `next dev` when possible.
- 2026-05-06: Streaming fetch (ReadableStream) without an AbortController leaks memory when components unmount mid-stream. Always create an AbortController, pass its signal to fetch, and abort on cleanup.
- 2026-04-02: Streamlit tab render order causes subtle bugs — tabs render top-to-bottom on every script run. DB writes in later tabs (Settings, Medication) aren't visible to earlier tabs (Health) without st.rerun(). Always add st.rerun() after any DB mutation that should be reflected across tabs.
- 2026-04-02: Python local `import X` inside a function creates a local variable scope for X across the ENTIRE function — not just after the import line. If any code path uses X before the import executes, it errors. Fix: rely on top-level imports, remove redundant local imports.
- 2026-04-02: Streamlit file_uploader widget can lose state on button-triggered reruns. Never put button handlers inside the `if uploaded_file` block. Store parsed data in session_state, put the action button outside.
- 2026-04-04: Never rely on session_state for values that must survive app restarts/reconnects. Session_state is volatile — WebSocket drops, deployments, and restarts silently wipe it. For anything persisted in DB, query the DB directly where needed. The glucose target line bug was caused by chart reading session_state instead of DB.


# Individual Skills
## meta-skill-creator

## mkt-brand-voice
- Built from interview (Mode 3) — site was down during first session. Revisit with URL extraction when glp1companion.io is back up.

## mkt-positioning
- "The Pattern Layer" selected as primary angle — differentiates from saturated "all-in-one" claims
- Key competitors: Shotsy, Glapp, MeAgain, Pep, Dose AI
- MeAgain is the closest competitor messaging-wise ("Everything You Need in One Place")
- White space: pattern recognition as identity, between-appointment utility, empathetic brand voice

## mkt-icp
- Primary: adults on GLP-1s (new starters + established users)
- Secondary segment: Type 2 diabetics on GLP-1s — intentionally deprioritized due to more competitors
- Tertiary: GLP-1 curious (content marketing audience, pre-prescription)

## str-ai-seo

## meta-wrap-up

## dexcom-sync
- 2026-05-07: Dexcom sandbox (`sandbox-api.dexcom.com`) redirects OAuth login to `developer-api-prod-us.platform.dexcomdev.com` which has a broken SSL cert. Safari blocks entirely, Chrome may also block without bypass option. Created a mock-connect route for dev testing as workaround.
- 2026-05-07: Dexcom sandbox strips the `scope` parameter during redirect — `scope=offline_access` becomes `scope=`. May need investigation when sandbox is back up.
- 2026-05-07: Next.js dev server port conflicts are common in this workspace (OpenClaw mission-control auto-respawns on 3000 via launchd). Keep DEXCOM_REDIRECT_URI in .env aligned with actual running port, and update the Dexcom developer portal to match.

## fitbit-sync
- 2026-05-08: Fitbit requires PKCE (code_verifier + SHA-256 code_challenge) for OAuth — unlike Dexcom which uses plain OAuth 2.0. Store code_verifier in a second httpOnly cookie alongside CSRF state.
- 2026-05-08: Fitbit token exchange uses HTTP Basic Auth header (`Authorization: Basic base64(client_id:client_secret)`) — not POST body params like Dexcom. Token refresh also uses Basic Auth.
- 2026-05-08: Fitbit returns weight in the user's profile unit preference (kg or lbs). No unit field in the API response. Used heuristic: if any weight < 100, treat all as kg. Fragile for very light people (~95 lbs) but covers the vast majority.
- 2026-05-08: Google Fit REST API shut down June 30 2025. Replaced all `google_fit` references with `fitbit` across schema comments, UI components, status endpoint, and .env.example.
- 2026-05-08: When adding new data sources, check hardcoded source names in toast messages (e.g., "Your Dexcom session expired"). Use dynamic source name lookups instead.

## tool-firecrawl-scraper

## str-trending-research

## viz-nano-banana
- 2026-05-06: When generating brand assets (logos, banners, social profile images), ALWAYS check the project's design system first (design-system/tokens.css, globals.css) before using brand_context/assets.md colors. The design system is the source of truth for colors — assets.md may be outdated. Generated 3 rounds of logos because the first used old blue (#1C83E1) instead of the app's actual teal palette (#0F5F5A, #4DB6AC, #FF8A6A, #FFC66D).
- 2026-05-06: Also check if a logo already exists in the project before generating a new one from scratch. User noted there was already a logo in the app-redesign folder.
- 2026-05-06: For Twitter/X banners, shift content to center-right — the profile picture overlaps the bottom-left corner of the banner image.
- 2026-05-06: Gemini API key must be passed via --api-key flag when running from Claude Code — environment variable sourcing doesn't reliably pass through to uv-run Python subprocesses.

## viz-ugc-heygen

## mkt-ugc-scripts

## ops-cron

## mkt-content-repurposing

## mkt-copywriting

## tool-humanizer

## tool-youtube

## viz-excalidraw-diagram

## tool-stitch

## viz-stitch-design

## pdf-export
- 2026-04-06: fpdf2 Helvetica font only supports latin-1. Any user-supplied text (medication names, dosages, notes, symptoms) must be sanitized before passing to pdf.cell(). Added `_latin1_safe()` wrapper that encodes with errors='replace'. Without this, characters like checkmarks crash the export on Streamlit Cloud.
- 2026-04-06: matplotlib Agg backend works on Streamlit Cloud with no system deps. Charts rendered to BytesIO PNG, embedded via pdf.image(). Always call plt.close(fig) after saving to prevent memory leaks.

## pattern-engine
- 2026-04-02: First implementation — weight↔dose and side effect↔dose correlation. Pure Python, no LLM. Inserted after get_proactive_insights (line ~3099). ~200 lines of analysis + ~40 lines dashboard UI.
- parse_dosage_value() handles all existing GLP1_DOSAGES formats including "(daily)" suffix and "Other" (returns None).
- detect_dose_changes() is the shared foundation — both analyzers depend on it. Future analyzers (food, glucose) should reuse it.
- Cache invalidation must be added at every new logging point — now covers weight, scheduled med, manual med, side effect, AND all 4 food logging paths (photo, voice, recipe, manual).
- 2026-04-02: Added food/protein correlation analyzer. FoodLog model now has protein/fat/calories columns (auto-migrated via ALTER TABLE). analyze_food_protein_correlation() uses median split on daily protein totals, compares weight trends 1-3 days after high vs low protein days. Also flags low daily protein (<60g) as a muscle preservation warning for GLP-1 users.
- Historical food logs have NULL nutrition columns — analyzer only works on data logged after this update. Consider a backfill script that parses the notes field (e.g., "📸 AI | Cal: 450 | C: 30g | P: 25g | F: 15g") to populate old rows.

## str-90-day-plan
- 2026-04-02: First plan generated for GLP-1 Companion (product type). Used positioning + ICP + SNAQ competitive analysis + current app state audit to build 3-phase plan with 31 kanban tasks.
- Pattern: Phase 1 should always close the gap between positioning promise and product reality — GLP-1's "Pattern Layer" positioning required pattern engine as Week 1 priority.
- Kanban summary table at the end is critical — user immediately wanted to pull tasks into their board.
