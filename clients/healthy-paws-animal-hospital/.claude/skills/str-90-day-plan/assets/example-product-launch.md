# 90-Day Survival Plan: GLP-1 Companion

**Goal:** Go from working MVP to differentiated product with 100 active users by day 90
**Positioning:** "The Pattern Layer" — stop tracking, start seeing
**Live URL:** https://glp1companion-ybxqlfaewlaev55yeeentt.streamlit.app
**Domain:** glp1companion.io (purchased, needs setup)

---

### Current State (Day 0)

**What's built:**
- Streamlit app on Streamlit Cloud + PostgreSQL on Render
- Landing page with marketing copy
- Auth (login, signup, password reset)
- Dashboard with daily metrics (glucose, weight, meals, GLP-1 status)
- Weight tracking + charting
- Glucose tracking + charting
- Food logging (with AI photo recognition)
- Medication tracking (GLP-1 + diabetes meds)
- Side effect logging
- Dexcom CGM import
- Google Fit sync
- AI chat with health context
- Admin dashboard

**What's NOT built (and needs to be):**
- Pattern recognition — the core differentiator. App collects data but doesn't surface correlations.
- Doctor-ready PDF export — between-appointments bridge
- Protein/fiber tracking emphasis — critical for GLP-1 nutrition
- Hydration tracking
- Injection site rotation tracking
- Titration schedule support
- Push notifications / reminders
- Community-level benchmarks ("what's normal at week 3?")
- Mobile-native experience (currently mobile web via Streamlit)
- Custom domain working
- Any user acquisition beyond word of mouth

---

## Phase 1: Ship the Differentiator (Weeks 1-4)

The whole positioning is "see the patterns." If the app doesn't surface patterns, the marketing is a lie. This phase makes the core promise real.

### Week 1: Pattern Engine MVP

| Task | Deliverable |
|------|-------------|
| Build correlation analysis between weight trends and dose changes | Pattern: "Weight dropped X lbs in the 2 weeks after dose increase to Y mg" |
| Build side effect timeline mapped against medication changes | Pattern: "Nausea peaked day 2-3 after dose increase, resolved by day 5" |
| Add "Insights" card to dashboard showing top 2-3 active patterns | Dashboard shows real connected data, not just numbers |
| Surface food → weight correlations (protein days vs non-protein days) | "On days you hit 80g+ protein, your weight trend was X" |

**Week 1 Milestone:** Dashboard shows at least 2 auto-generated pattern insights

---

### Week 2: Doctor Export + Nutrition Focus

| Task | Deliverable |
|------|-------------|
| Build PDF export — weight chart, medication timeline, side effects, patterns | One-tap "Export for my doctor" button |
| Add protein and fiber tracking to food log (dedicated fields, not buried in AI parse) | Protein/fiber prominently tracked per meal |
| Add daily protein target with progress bar | User sees "62g / 100g protein today" on dashboard |
| Add hydration tracking (simple glass counter) | Water intake tracked and visible |

**Week 2 Milestone:** User can export a PDF they'd actually hand to their doctor

---

### Week 3: Medication Intelligence

| Task | Deliverable |
|------|-------------|
| Add titration schedule builder (user sets their escalation plan) | Visual timeline: "Week 1-4: 0.25mg → Week 5-8: 0.5mg → ..." |
| Add injection site rotation tracker with body map | Rotate between 6-8 sites, app suggests next site |
| Add medication reminder notifications | Push/email reminder on injection day |
| Build dose-response analysis ("Here's what changed when you went from 0.5 to 1.0mg") | Pattern card per dose transition |

**Week 3 Milestone:** Medication tab is the best GLP-1 dose tracker on the market

---

### Week 4: Polish + Domain

| Task | Deliverable |
|------|-------------|
| Fix custom domain — get glp1companion.io pointing to the app | Professional URL live |
| Mobile UX pass — fix any remaining keyboard, scroll, tap issues | Clean mobile experience |
| Onboarding flow for new users (medication, goals, starting weight) | First 60 seconds feel guided, not overwhelming |
| Branded colors throughout (replace Streamlit defaults with #1C83E1 brand blue) | Consistent, professional look |

**4-Week Milestone:** The app delivers on "The Pattern Layer" promise. A user who tracks for 1 week sees real insights.

---

## Phase 2: Get to 50 Users (Weeks 5-8)

The product now works. Time to get people using it.

### Week 5-6: Content + Community Seeding

| Task | Deliverable |
|------|-------------|
| Write 5 Reddit posts for r/Ozempic, r/Semaglutide, r/tirzepatide — helpful posts with app mention | Posts live, tracking engagement |
| Create 3 short demo videos (< 60 sec each) showing pattern insights, food logging, doctor export | Videos for TikTok/Reels/YouTube Shorts |
| Write 3 SEO blog posts on glp1companion.io (target: "GLP-1 tracking app", "Ozempic side effects tracker", "what to track on semaglutide") | Blog content driving organic search |
| Set up basic analytics (user signups, daily active, feature usage) | Know what's working |
| Add "Share my progress" feature — shareable image of weight chart + milestones | Users become marketing channel |

**Week 6 Milestone:** 25 signups, 10 active users tracking consistently

---

### Week 7-8: Feedback Loop + Retention

| Task | Deliverable |
|------|-------------|
| In-app feedback button — "What's missing? What's broken?" | Direct user input pipeline |
| Weekly email digest — "Here's what your data showed this week" | Retention + re-engagement |
| Add streak tracking — consecutive days logged | Gamification for daily use |
| Build "What's normal?" benchmarks — anonymous aggregate data ("Average weight change in month 1: X lbs") | The community data moat starts here |
| Fix top 5 user-reported issues | Quality pass |

**8-Week Milestone:** 50 users, 20 active weekly, top issues resolved

---

## Phase 3: Monetization Prep + Scale (Weeks 9-12)

### Week 9-10: Premium Features

| Task | Deliverable |
|------|-------------|
| Design freemium split — free (basic tracking) vs premium (patterns, export, AI chat, benchmarks) | Pricing page + paywall |
| Implement Stripe payment ($4.99/mo or $39.99/year — undercut SNAQ's $100/year) | Payments working |
| Add AI meal planning based on GLP-1 nutrition needs (premium) | Premium-worthy feature |
| Add CGM glucose prediction patterns (premium) | "Based on your data, your glucose typically spikes after X" |

**Week 10 Milestone:** Premium tier live, first 5 paying users

---

### Week 11-12: Scale What Works

| Task | Deliverable |
|------|-------------|
| Double down on top acquisition channel (Reddit? TikTok? SEO?) | Invest in what's actually driving signups |
| Partner outreach — contact 10 GLP-1 influencers/creators for review | Influencer pipeline started |
| App Store consideration — evaluate React Native / Flutter rebuild vs Streamlit PWA | Decision on mobile-native path |
| Provider-facing view (read-only dashboard for doctors) — design only | Spec for B2B expansion |
| "Refer a friend" feature with incentive | Viral loop |

**12-Week Milestone:** 100 users, 10 paying, clear path to $1K MRR

---

## Daily Action Checklist

- [ ] Check analytics — new signups, active users, feature usage
- [ ] Respond to any user feedback within 24 hours
- [ ] Ship one improvement (bug fix, UI tweak, or small feature)
- [ ] Post or engage in one GLP-1 community (Reddit, Facebook, TikTok)

---

## Revenue Milestones

| Week | Target | Minimum Viable |
|------|--------|----------------|
| 4 | 0 users paying, product works | Pattern engine live, PDF export works |
| 8 | 50 users, 20 active | Content published, analytics running |
| 12 | 100 users, 10 paying ($50-500 MRR) | Stripe live, premium features working |

---

## Early Warning Signs

### Week 2: If pattern engine isn't surfacing useful insights...
- **Problem:** Not enough data types connected, or correlations are noise
- **Fix:** Focus on the 2 most reliable patterns (dose→side effect, dose→weight change) and nail those before expanding

### Week 4: If the app still feels like "just another tracker"...
- **Problem:** Patterns aren't visible enough, or onboarding doesn't show value fast enough
- **Fix:** Pre-populate demo data for new users so they immediately see what patterns look like

### Week 8: If under 20 active users...
- **Problem:** Acquisition channels aren't working or retention is poor
- **Fix:** Interview the 5 most active users — what brought them, what keeps them. Double down on that.

### Week 12: If nobody converts to paid...
- **Problem:** Free tier too generous, or premium features aren't compelling enough
- **Fix:** Adjust the freemium split — move doctor PDF export or AI chat behind paywall

---

## Competitive Advantages to Protect

1. **Pattern recognition as identity** — not a feature, the whole product promise
2. **GLP-1 native from day one** — not a diet app with meds bolted on
3. **Undercut on price** — $40/year vs SNAQ's $100/year, free tier more generous
4. **Between-appointment PDF** — nobody else owns this use case
5. **Community benchmarks** — anonymous aggregate data becomes a moat over time
6. **Empathetic brand voice** — competitors sound like utility tools, we sound human

---

*Created: 2026-04-02*
