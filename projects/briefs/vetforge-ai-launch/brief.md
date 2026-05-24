---
project: vetforge-ai-launch
status: active
level: 2
created: 2026-04-27
---

# VetForge AI - Business Launch

## Goal
Launch VetForge AI as an AI-powered marketing agency for veterinary practices, operating under Palmquist Ventures LLC.

## Business Structure
- **LLC:** Palmquist Ventures LLC (Illinois)
- **DBA:** VetForge AI
- **Domain:** vetforgeai.com
- **Held domain:** jpdigitalworks.com (reserved for future use)
- **Niche:** AI-powered marketing for veterinary practices
- **Expansion path:** All local businesses (later)

## Deliverables

### Phase 1: Legal & Digital Foundation
- [x] Register vetforgeai.com (GoDaddy, 2026-04-27)
- [x] File Palmquist Ventures LLC (Illinois SOS, $153.38, Packet #1777313912161863, 2026-04-27)
- [x] Get EIN from IRS (free, 2026-04-27)
- [ ] Open business bank account
- [ ] File DBA "VetForge AI" in county (~$50-100)

### Phase 2: Brand Identity
- [x] Logo design — VF monogram + wordmark SVG (full + icon variants, 2026-04-27)
- [x] Color palette — Blue gradient (#3B82F6 → #1D4ED8), dark theme (#0A0F1C, #111827, #1E293B), muted text (#94A3B8)
- [x] Typography — Inter (sans-serif)
- [ ] Brand guidelines doc (formal — currently defined in code via Tailwind theme)

### Phase 3: Brand Presence
- [ ] Claim @vetforgeai on X
- [ ] Claim @vetforgeai on Instagram
- [ ] Claim @vetforgeai on LinkedIn (company page)
- [ ] Claim @vetforgeai on Facebook (business page)
- [ ] Claim @vetforgeai on TikTok

### Phase 4: Web & Online Presence
- [x] Build vetforgeai.com — Next.js 15 + Tailwind v4 + Resend, deployed on Vercel (2026-04-27)
- [x] DNS configured — vetforgeai.com + www.vetforgeai.com pointing to Vercel
- [x] Contact form — sends to palmquist66@gmail.com via Resend (fixed 2026-04-28)
- [x] SEO — metadata, 3 JSON-LD schemas, dynamic OG image, sitemap
- [x] Set up business email — Google Workspace, james@vetforgeai.com (+ aliases hello@, info@), MX/DKIM via GoDaddy auto-config (2026-05-06)
- [x] Google Business Profile — created as service-area business (Chicago metro), pending verification (2026-05-06)

### Phase 5: Legal Protection
- [ ] File trademark "VetForge AI" in Class 35 (marketing services) at USPTO (~$250-350)
- [ ] Optional: File in Class 42 (software/SaaS services)

### Phase 6: Service Packaging
- [x] Define service tiers / offerings — Spark/Forge/Foundry 3-tier bundle (2026-05-23)
- [x] Pricing structure — $600/$1,200/$2,200/mo + $500 setup, month-to-month w/ annual (2 mo free) option (2026-05-23)
- [x] Client onboarding process — 7-step flow from free audit → delivery (2026-05-23)
- [x] Internal delivery & capacity model — per-task AI/human hour split, effective $/hr per tier, solo capacity ceiling, danger zones, HPAH beta validation plan (2026-05-23)
- See `2026-05-23_service-packaging.md` for full tiers, comparison matrix, add-ons, sales notes
- See `2026-05-23_delivery-capacity-model.md` (internal) for hours/AI-leverage per service + capacity math

## Key Decisions Made
- **2026-04-27:** Name finalized as VetForge AI (vetforgeai.com available, no USPTO trademark conflict)
- **2026-04-27:** LLC name decided as Palmquist Ventures LLC (broad umbrella entity)
- **2026-04-27:** Structure = LLC + DBA (not separate LLC per brand)
- **2026-04-28:** Core differentiator = AI content built on practice-specific brand voice profiles (not generic AI slop)
- **2026-04-28:** Contact form sends to palmquist66@gmail.com (no inbox for hello@vetforgeai.com yet)
- **2026-05-06:** Business email set up via Google Workspace (Business Starter, $7.20/mo). Primary: james@vetforgeai.com. Aliases: hello@, info@. DKIM authenticated via GoDaddy.
- **2026-05-06:** GBP created as service-area business in Chicago metro. Pending Google verification.
- **2026-05-23:** Service packaging defined — 3 tiers (Spark $600 / Forge $1,200 / Foundry $2,200), $500 one-time setup fee (covers brand voice profile build), month-to-month default with annual option (2 months free). Entry priced as a buyer-group "no-brainer" well under agency rates. First milestone = 5 Forge clients = $6k/mo MRR.
- **2026-05-23:** Repositioned model from advisor → operator. Tiers now sell ongoing website maintenance + AI-search optimization (keeping clients found in ChatGPT/Perplexity/AI Overviews + legacy Google), not just reports the client implements. Added two engagement models: **Handoff** (Spark — for practices locked into a current web-dev contract; we provide strategy/content/dev-ready specs, their dev implements; upgrades to Forge when contract ends) and **Operator** (Forge/Foundry — we build, host, and maintain). Added one-time **Website Rebuild** on-ramp (from $2,500, HPAH is the proof case) that flows into Operator maintenance.
- **2026-05-23:** Added "How We Work — Your Site, Your Say" control principles (apply to all tiers): (1) we still report on everything monthly even though we implement; (2) client controls approval — Review-first (preview link, approve before live) vs Auto-pilot, default Review-first; (3) post-it-yourself publishing — client drops a blog/update file in a shared folder, we optimize for brand voice + AI-search and publish (Operator tiers publish directly; Handoff = we optimize + hand to their dev). Onboarding sets approval preference + shared folder.

## Notes
- No existing "VetForge" trademark found in USPTO
- VetForge LLC exists (federal contractor, Chattanooga TN) but completely different industry — low risk
- jpdigitalworks.com owned, held for potential future use under same LLC
