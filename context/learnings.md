# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well
- 2026-04-08: GSD planning workflow (research → plan → verify → revise loop) worked smoothly for complex multi-book phase
- 2026-04-10: No feedback — routine session. Phase 2.1 gap closure plans 03-04 executed smoothly via parallel agents.
- 2026-04-21: No feedback — routine session. Phase 2.2 Wave 1 (shared infra) executed cleanly. Wave 2 paused pending mitmproxy captures.
- 2026-04-21: Brand naming brainstorm session — parallel research agents (niche vs general, rebranding costs, naming patterns) worked well. Iterative questioning approach helped narrow from wide field to 3 finalists. User found it "very helpful in generating ideas."
- 2026-04-27: No feedback — routine session. VetForge AI landing page built and deployed end-to-end (scaffold → code → GitHub → Vercel) in one session. Parallel file writes kept it efficient.
- 2026-04-29: No feedback — routine session. Impeccable critique (26/40) + top 3 fixes applied to VetForge site. Parallel assessment agents (LLM review + automated scan) worked well for comprehensive critique.
- 2026-04-30: Multi-option design approach paid off — created 3 landing page variants (warm+light, impeccable polish, Claude Design navy+orange), served on separate ports for side-by-side comparison. Wife picked the winner (site-v3). Having concrete options to compare > iterating on a single direction.

## What doesn't work well
- 2026-04-08: meta-wrap-up did not auto-trigger on "I'm done" / "done for today" session-end signals. Claude must actively watch for these triggers and run the skill without being asked.
- 2026-04-09: Spent entire day debugging FanDuel CAPTCHA loop (Arkose Labs). Massive token burn. When Playwright/bot-detection issues resist multiple fix attempts, pivot to a fundamentally different approach (e.g. WebView-based login on device) rather than iterating on stealth tweaks that may never work against actively-updated bot detection.


# Individual Skills
## meta-skill-creator

## mkt-brand-voice

## mkt-positioning
- 2026-04-13: No feedback — positioning update landed well. Vet-niche-first angle with buyer group distribution was well received. Key insight: when client has a built-in distribution channel (buyer groups), the positioning should optimize for peer trust and referral context, not broad market appeal.

## mkt-icp
- 2026-04-13: No feedback — ICP rewrite for vet practices landed well. Important to include distribution strategy section (how to reach the ICP, not just who they are). Buyer group channel mapping was valuable context.

## str-90-day-plan
- 2026-04-13: No feedback — 90-day plan landed well. Key correction mid-session: HPAH is a founding partner, not a client to convert to paid. Revenue milestones should only count paying clients. Always ask about the client relationship dynamic before assuming monetization.
- 2026-04-13: User flagged that pricing in the plan may be too high. His AI-powered workflow gives him very low overhead — he wants to price low enough to be a no-brainer. Don't default to agency-level pricing for AI-native solo operators.

## str-ai-seo

## meta-wrap-up
- 2026-04-08: Failed to auto-trigger on "ok thats it im done for the day" and "ok im done for now ill be back later". These are clear session-end signals. Must treat ANY variant of "I'm done" as a trigger — not just exact phrase matches.

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

## impeccable
- 2026-04-30: Tailwind v4 CSS specificity gotcha — global element styles (a, h1-h3) must be wrapped in `@layer base` or they override Tailwind utility classes like `text-white`. Unlayered styles win over `@layer utilities` in the cascade. Always layer global resets.
