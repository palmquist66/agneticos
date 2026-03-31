# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well
- 2026-03-30: Full onboarding → research → content pipeline in one session landed well. User prefers "just do it" flow over menus.
- 2026-03-30: Timely daily posts (tied to today's actual games) resonate more than evergreen batch content.

## What doesn't work well
- 2026-03-30: WebSearch with site:reddit.com and site:x.com returned mostly empty results. Need OPENAI_API_KEY and XAI_API_KEY for rich engagement data.
- 2026-03-30: Every output intended for a human (social posts, captions, emails, copy) MUST go through humanizer automatically — don't wait for the user to ask. This is a hard rule.
- 2026-03-30: Copy-paste output displayed in chat has bad formatting/indentation. Always save human-facing output to a .txt file in ~/Downloads/ so it's clean to copy-paste. Never rely on chat output for copy-paste.
- 2026-03-31: When delivering content, explicitly confirm that voice profile was loaded and humanizer was run. Don't make the user ask — proactively state it: "Written in BetBro voice, humanizer passed (score: X)." This applies to every content deliverable, every time.
- 2026-03-31: HARD RULE — every piece of content output (replies, posts, captions, scripts, copy) MUST load brand_context/voice-profile.md + brand_context/positioning.md AND run through tool-humanizer BEFORE saving. No exceptions. User had to ask 5+ times this session. This is not optional — it's the pipeline: draft → voice check → humanizer → save. If you skip it, you will be corrected.
- 2026-03-31: X replies should be additive, not negative. Don't correct or contradict the OP. Add value, layer nuance, share angles they missed. People follow accounts that make them smarter, not accounts that correct them.
- 2026-03-31: No links in X replies. X algorithm suppresses replies with links. Save links for your own posts.
- 2026-03-31: Always cross-reference props against BetBro's own app data before endorsing or rejecting a bet in a reply. Never contradict the product — if the app says walk away, the reply says walk away.


# Individual Skills
## meta-skill-creator

## mkt-brand-voice

## mkt-positioning

## mkt-icp

## str-ai-seo

## meta-wrap-up

## tool-firecrawl-scraper

## str-trending-research
- 2026-03-30: Always verify game dates — pulled Elite 8 data that had already played. User caught it. Daily content must be confirmed against today's actual schedule.
- 2026-03-30: Best content angles came from competitive white space (walk-away signal) and real pricing gaps ($199 vs free). Specific beats generic.
- 2026-03-30: Don't frame slim margins as comfortable edges. Davis Martin "1-out cushion" (16.5 avg vs 15.5 line) was called out as misleading — 1 out is razor thin, not a cushion. Be honest about how tight the math is.

## viz-nano-banana

## viz-ugc-heygen

## mkt-ugc-scripts

## ops-cron
- 2026-03-30: User wants to post manually to keep accounts feeling human. Cron generates content + reminders, user copies and posts. Don't automate posting.
- 2026-03-31: x-engagement-replies cron job created. Key lessons from building it: no links in replies (X suppresses them), always additive tone (never dunk on OP), cross-reference BetBro app data before endorsing props, output must be plain text with no markdown for clean copy-paste.

## mkt-content-repurposing

## mkt-copywriting

## tool-humanizer
- 2026-03-30: Must be called automatically on ALL human-facing output — social captions, emails, copy, video scripts. User should never have to ask "did you run it thru humanizer?"
- 2026-03-31: User asked 5+ times in one session whether output used voice/brand/humanizer. This is a BLOCKING failure. The pipeline is: load voice-profile.md → draft content → invoke /humanizer skill → save final version. Every time. No manual rewrites pretending to be humanizer runs — actually invoke the skill.

## tool-youtube

## viz-excalidraw-diagram

## tool-stitch

## viz-stitch-design

## ops-user-feedback
