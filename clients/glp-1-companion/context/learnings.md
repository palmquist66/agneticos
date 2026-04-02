# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well

## What doesn't work well


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

## tool-firecrawl-scraper

## str-trending-research

## viz-nano-banana

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

## pattern-engine
- 2026-04-02: First implementation — weight↔dose and side effect↔dose correlation. Pure Python, no LLM. Inserted after get_proactive_insights (line ~3099). ~200 lines of analysis + ~40 lines dashboard UI.
- parse_dosage_value() handles all existing GLP1_DOSAGES formats including "(daily)" suffix and "Other" (returns None).
- detect_dose_changes() is the shared foundation — both analyzers depend on it. Future analyzers (food, glucose) should reuse it.
- Cache invalidation must be added at every new logging point — currently covers weight, scheduled med, manual med, side effect. If new log types are added, add `st.session_state.pop("pattern_insights_cache", None)` there too.

## str-90-day-plan
- 2026-04-02: First plan generated for GLP-1 Companion (product type). Used positioning + ICP + SNAQ competitive analysis + current app state audit to build 3-phase plan with 31 kanban tasks.
- Pattern: Phase 1 should always close the gap between positioning promise and product reality — GLP-1's "Pattern Layer" positioning required pattern engine as Week 1 priority.
- Kanban summary table at the end is critical — user immediately wanted to pull tasks into their board.
