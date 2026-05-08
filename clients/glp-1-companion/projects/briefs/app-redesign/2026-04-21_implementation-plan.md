# Implementation Plan: GLP-1 Companion Redesign

Phased execution order. Each phase ships a usable increment — the app works at every stage.

**Last updated:** 2026-05-08

---

## Progress Overview

| Phase | Status | Completed |
|-------|--------|-----------|
| **1: Foundation** | COMPLETE | Apr 28 |
| **2: Logging** | COMPLETE | Apr 28 – May 5 |
| **3: Today Screen** | COMPLETE | Apr 28 – May 5 |
| **4: Trends + AI** | COMPLETE | Apr 28 – May 6 |
| **5: Meds + Profile** | COMPLETE | Apr 28 – May 6 |
| **6: Data Sync + Onboarding** | PARTIAL | May 7 (Dexcom + onboarding done, Google Fit + sync-on-open remaining) |
| **7: PWA + Polish** | PARTIAL | May 5-6 (push notifications + design system done, landing page + polish remaining) |
| **8: Capacitor Native** | NOT STARTED | — |

**MVP status:** The critical path (Phases 1-4) is complete. The app is deployable as a beta today with manual data entry, full charting, AI chat, pattern detection, and Dexcom sync.

---

## Architecture Decisions (Before Code)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 (App Router) | Fastest rebuild path, SSR landing page + client app |
| Styling | Tailwind CSS 4 + shadcn/ui | Consistent components, mobile-first responsive |
| Database | PostgreSQL + Prisma 7 | Keep existing schema logic, type-safe queries |
| Auth | Clerk (proxy.ts) | Social login, secure password reset, session management |
| AI | Anthropic Claude via Vercel AI SDK | Real AI (replaces keyword matching), streaming responses |
| Charts | Recharts | Good mobile web support, interactive tooltips |
| PDF | Server-side inline styles | Doctor export with brand colors |
| PWA | Custom service worker + manifest | Push notifications, installable |
| Encryption | AES-256-GCM | OAuth token storage |
| Native (future) | Capacitor 8 | HealthKit, Health Connect, native push |
| Hosting | Vercel (planned) | Zero-config Next.js deployment |
| Database hosting | Neon or Supabase Postgres | Serverless Postgres, free tier for MVP |

### Project Structure (as built)

```
projects/briefs/app-redesign/
├── brief.md
├── 2026-04-21_platform-evaluation.md
├── 2026-04-21_information-architecture.md
├── 2026-04-21_user-flows.md
├── 2026-04-21_screen-specs.md
├── 2026-04-21_implementation-plan.md       ← this file
├── 2026-04-28_onboarding-flow.md
├── 2026-04-28_data-sync-hub.md
├── design-system/                           ← tokens, typography, color palette
└── app/                                     ← all source code
    ├── package.json
    ├── next.config.ts
    ├── prisma/schema.prisma                 ← 11-table schema + PushSubscription
    ├── public/
    │   ├── manifest.json                    ← PWA manifest
    │   ├── sw.js                            ← service worker (push + caching)
    │   ├── logo-mark.png
    │   ├── logo-mark.svg
    │   └── logo-lockup.png
    └── src/
        ├── proxy.ts                         ← Clerk auth (Next.js 16 pattern)
        ├── app/
        │   ├── globals.css                  ← design system (teal/coral/amber)
        │   ├── layout.tsx                   ← Poppins + Inter fonts
        │   ├── page.tsx                     ← landing page
        │   ├── (marketing)/layout.tsx
        │   ├── (auth)/sign-in/ + sign-up/
        │   ├── (app)/
        │   │   ├── layout.tsx               ← bottom nav + FAB
        │   │   ├── today/page.tsx + actions.ts
        │   │   ├── trends/page.tsx
        │   │   ├── meds/page.tsx + actions.ts
        │   │   ├── meds/[id]/page.tsx
        │   │   ├── profile/page.tsx + actions.ts + push-actions.ts
        │   │   └── log/
        │   │       ├── actions.ts
        │   │       ├── meal-photo/page.tsx
        │   │       ├── meal-text/page.tsx
        │   │       ├── recipe/page.tsx
        │   │       ├── weight/page.tsx + weight-form.tsx
        │   │       ├── glucose/page.tsx
        │   │       ├── side-effect/page.tsx
        │   │       └── glp1-dose/page.tsx + dose-form.tsx
        │   ├── onboarding/
        │   │   ├── actions.ts
        │   │   ├── medication/page.tsx + medication-form.tsx
        │   │   ├── goals/page.tsx + goals-form.tsx
        │   │   ├── connect/page.tsx + connect-form.tsx
        │   │   └── ready/page.tsx
        │   └── api/
        │       ├── ai/analyze-food/route.ts
        │       ├── ai/chat/route.ts
        │       ├── ai/deep-analysis/route.ts
        │       ├── export/doctor-report/route.ts
        │       ├── notifications/send/route.ts
        │       ├── notifications/mark-taken/route.ts
        │       ├── notifications/snooze/route.ts
        │       ├── sync/dexcom/route.ts
        │       ├── sync/dexcom/callback/route.ts
        │       ├── sync/dexcom/pull/route.ts
        │       ├── sync/dexcom/disconnect/route.ts
        │       ├── sync/dexcom/mock-connect/route.ts
        │       └── sync/status/route.ts
        ├── components/
        │   ├── ui/ (button, card, badge, separator, avatar, sheet)
        │   ├── nav/ (bottom-nav, fab, fab-sheet, app-header)
        │   ├── today/ (glp1-status-card, medication-checkin, todays-numbers,
        │   │          pattern-spotlight, recent-activity, activity-item, entry-edit-sheet)
        │   ├── trends/ (weight-trend-chart, glucose-trend-chart, pattern-cards,
        │   │           time-range-selector, ai-chat, deep-analysis)
        │   ├── meds/ (active-medications, titration-timeline, add-medication-sheet,
        │   │         med-details-card, med-detail-actions, injection-site-history)
        │   ├── profile/ (profile-info-card, health-targets-card, data-sources-card,
        │   │            dexcom-callback-toast, theme-toggle)
        │   ├── log/ (log-page-layout, chip-group, number-input, nutrition-display,
        │   │        meal-confirmation, injection-site-picker)
        │   ├── push/ (sw-register, notification-toggle)
        │   ├── sync/ (auto-sync)
        │   └── theme-provider.tsx
        └── lib/
            ├── db.ts                        ← Prisma client (pool: 10)
            ├── auth.ts                      ← auth helpers
            ├── pattern-engine.ts            ← TypeScript port of Python patterns
            ├── today-queries.ts             ← bounded queries for Today
            ├── trends-queries.ts            ← bounded queries for Trends
            ├── crypto.ts                    ← AES-256-GCM token encryption
            ├── dexcom.ts                    ← Dexcom API client
            ├── push.ts                      ← client-side push helpers
            ├── push-server.ts               ← VAPID + HMAC action tokens
            ├── utils.ts
            └── types/                       ← shared TypeScript types
```

---

## Phase 1: Foundation ~ COMPLETE

**Goal:** App shell running with auth, database, and navigation.
**Completed:** April 28, 2026

| Task | Status | Files |
|------|--------|-------|
| Initialize Next.js 16 project | [x] | `app/package.json`, `app/next.config.ts` |
| Install core deps (shadcn/ui, Prisma, Clerk, Recharts) | [x] | `app/package.json` |
| Prisma schema (11 tables) | [x] | `prisma/schema.prisma` — User, GlucoseLog, WeightLog, FoodLog, MedicationLog, MedicationSchedule, SideEffect, InjectionSite, TitrationSchedule, DataSourceConnection, SyncLog |
| Clerk auth setup (proxy.ts) | [x] | `src/proxy.ts`, `src/lib/auth.ts` |
| Environment config | [x] | `app/.env.example` |
| Bottom navigation bar (4 tabs + FAB) | [x] | `components/nav/bottom-nav.tsx` |
| App layout with auth check | [x] | `app/(app)/layout.tsx` |
| Route groups (marketing, auth, app, onboarding) | [x] | `app/(marketing)/`, `app/(auth)/`, `app/(app)/`, `app/onboarding/` |
| FAB action sheet (7 options) | [x] | `components/nav/fab.tsx`, `components/nav/fab-sheet.tsx` |
| App header with logo | [x] | `components/nav/app-header.tsx` |
| Empty state screens for all 4 tabs | [x] | `today/page.tsx`, `trends/page.tsx`, `meds/page.tsx`, `profile/page.tsx` |
| Landing page | [x] | `app/page.tsx` |

**Notes:** Next.js 16 renames middleware.ts to proxy.ts. Prisma v7 uses `prisma.config.ts` for datasource URL. shadcn/ui uses @base-ui/react (no `asChild`).

---

## Phase 2: Logging ~ COMPLETE

**Goal:** Every FAB logging flow works end to end.

| Task | Status | Files |
|------|--------|-------|
| Log Weight | [x] | `log/weight/page.tsx`, `log/weight/weight-form.tsx`, `components/log/number-input.tsx` |
| Log Glucose | [x] | `log/glucose/page.tsx`, `components/log/chip-group.tsx` |
| Log Side Effect | [x] | `log/side-effect/page.tsx` |
| Log GLP-1 Dose | [x] | `log/glp1-dose/page.tsx`, `log/glp1-dose/dose-form.tsx`, `components/log/injection-site-picker.tsx` |
| Snap a Meal (camera) | [x] | `log/meal-photo/page.tsx`, `components/log/meal-confirmation.tsx`, `components/log/nutrition-display.tsx` |
| Describe a Meal (text) | [x] | `log/meal-text/page.tsx` |
| Log a Recipe | [x] | `log/recipe/page.tsx` |
| AI food analysis API | [x] | `api/ai/analyze-food/route.ts` |
| Server actions for all log types | [x] | `log/actions.ts` |
| Shared log page layout | [x] | `components/log/log-page-layout.tsx` |

---

## Phase 3: Today Screen ~ COMPLETE

**Goal:** Home screen shows real data and medication check-in works.

| Task | Status | Files |
|------|--------|-------|
| Today's Numbers row | [x] | `components/today/todays-numbers.tsx` |
| Medication Check-In card | [x] | `components/today/medication-checkin.tsx` |
| GLP-1 Status card | [x] | `components/today/glp1-status-card.tsx` |
| Recent Activity feed | [x] | `components/today/recent-activity.tsx`, `components/today/activity-item.tsx` |
| Entry edit/delete | [x] | `components/today/entry-edit-sheet.tsx` |
| Pattern Spotlight | [x] | `components/today/pattern-spotlight.tsx` |
| Today page with all cards | [x] | `app/(app)/today/page.tsx` |
| Today server actions | [x] | `app/(app)/today/actions.ts` |
| Today data queries (bounded) | [x] | `lib/today-queries.ts` |

---

## Phase 4: Trends + AI ~ COMPLETE

**Goal:** Charts, patterns, and real AI chat.

| Task | Status | Files |
|------|--------|-------|
| Time range selector (7d/14d/30d/60d/90d) | [x] | `components/trends/time-range-selector.tsx` |
| Weight trend chart | [x] | `components/trends/weight-trend-chart.tsx` |
| Glucose trend chart | [x] | `components/trends/glucose-trend-chart.tsx` |
| Pattern engine (TypeScript port) | [x] | `lib/pattern-engine.ts` |
| Pattern cards | [x] | `components/trends/pattern-cards.tsx` |
| AI chat — API route (streaming) | [x] | `api/ai/chat/route.ts` |
| AI chat — UI (inline on Trends) | [x] | `components/trends/ai-chat.tsx` |
| Deep Analysis | [x] | `components/trends/deep-analysis.tsx`, `api/ai/deep-analysis/route.ts` |
| Trends page with all sections | [x] | `app/(app)/trends/page.tsx` |
| Trends data queries (bounded) | [x] | `lib/trends-queries.ts` |

---

## Phase 5: Meds + Profile ~ COMPLETE

**Goal:** Medication management and profile/settings are complete.

### Meds Tab

| Task | Status | Files |
|------|--------|-------|
| Active Medications list | [x] | `components/meds/active-medications.tsx` |
| Medication Detail screen | [x] | `app/(app)/meds/[id]/page.tsx`, `components/meds/med-details-card.tsx`, `components/meds/med-detail-actions.tsx` |
| Add Medication flow | [x] | `components/meds/add-medication-sheet.tsx` |
| Titration Timeline | [x] | `components/meds/titration-timeline.tsx` |
| Injection Site History | [x] | `components/meds/injection-site-history.tsx` |
| Meds page | [x] | `app/(app)/meds/page.tsx` |
| Meds server actions | [x] | `app/(app)/meds/actions.ts` |

### Profile Tab

| Task | Status | Files |
|------|--------|-------|
| Your Info section | [x] | `components/profile/profile-info-card.tsx` |
| Health Targets section | [x] | `components/profile/health-targets-card.tsx` |
| Connected Data Sources (UI) | [x] | `components/profile/data-sources-card.tsx` |
| Doctor Export (PDF) | [x] | `api/export/doctor-report/route.ts` |
| Theme toggle (dark mode) | [x] | `components/profile/theme-toggle.tsx`, `components/theme-provider.tsx` |
| Profile page | [x] | `app/(app)/profile/page.tsx` |
| Profile server actions | [x] | `app/(app)/profile/actions.ts` |

---

## Phase 6: Data Sync + Onboarding ~ PARTIAL

**Goal:** Connect external data sources. Guide new users through setup.

### Onboarding ~ COMPLETE

| Task | Status | Files |
|------|--------|-------|
| Onboarding flow routing | [x] | `app/onboarding/layout.tsx` |
| Step 1: Medication | [x] | `onboarding/medication/page.tsx`, `onboarding/medication/medication-form.tsx` |
| Step 2: Goals | [x] | `onboarding/goals/page.tsx`, `onboarding/goals/goals-form.tsx` |
| Step 3: Connect Data | [x] | `onboarding/connect/page.tsx`, `onboarding/connect/connect-form.tsx` |
| Step 4: Ready | [x] | `onboarding/ready/page.tsx` |
| Onboarding server actions | [x] | `onboarding/actions.ts` |

### Data Source Sync ~ PARTIAL

| Task | Status | Files |
|------|--------|-------|
| Dexcom OAuth integration | [x] | `api/sync/dexcom/route.ts`, `api/sync/dexcom/callback/route.ts`, `lib/dexcom.ts`, `lib/crypto.ts` |
| Dexcom sync (pull glucose data) | [x] | `api/sync/dexcom/pull/route.ts` |
| Dexcom disconnect | [x] | `api/sync/dexcom/disconnect/route.ts` |
| Dexcom mock-connect (dev) | [x] | `api/sync/dexcom/mock-connect/route.ts` |
| Dexcom sync UI | [x] | `components/profile/data-sources-card.tsx`, `components/profile/dexcom-callback-toast.tsx` |
| Sync status API | [x] | `api/sync/status/route.ts` |
| Google Fit OAuth integration | [ ] | — |
| Google Fit sync UI | [ ] | — |
| Apple Health placeholder | [ ] | — |
| Sync-on-open (auto-sync if stale) | [x] | `components/sync/auto-sync.tsx` — mounts in app layout, checks connected sources, pulls if >15 min stale |

**Known issues:**
- Dexcom sandbox SSL broken — `sandbox-api.dexcom.com` redirects to `developer-api-prod-us.platform.dexcomdev.com` with invalid cert
- Mock-connect route must be deleted before production
- Apply for Dexcom Limited Access once real OAuth validated (allows 5 real users)

---

## Phase 7: PWA + Landing Page + Polish ~ PARTIAL

**Goal:** Installable PWA, marketing landing page, production-ready polish.

### PWA

| Task | Status | Notes |
|------|--------|-------|
| Service worker | [x] | `public/sw.js` — handles push events, mark-taken, snooze |
| PWA manifest | [x] | `public/manifest.json` |
| Push notifications (med reminders) | [x] | Full VAPID flow: `lib/push.ts`, `lib/push-server.ts`, `api/notifications/send/route.ts`, `api/notifications/mark-taken/route.ts`, `api/notifications/snooze/route.ts`, `components/push/sw-register.tsx`, `components/push/notification-toggle.tsx` |
| Install prompt | [ ] | Custom "Add to Home Screen" banner |
| Offline support (cache + queue) | [ ] | — |
| App icon set (all sizes) | [ ] | — |

### Design System + Branding

| Task | Status | Notes |
|------|--------|-------|
| Brand colors (teal/coral/amber) | [x] | `globals.css` — full theme with dark mode tokens |
| Typography (Poppins + Inter) | [x] | `layout.tsx` |
| Color-coded icons across components | [x] | activity-item, medication-checkin, number-input, deep-analysis, recent-activity, onboarding |
| Logo assets | [x] | `public/logo-mark.png`, `logo-mark.svg`, `logo-lockup.png` |
| Dark mode visual verification | [x] | Verified May 8 |

### Performance

| Task | Status | Notes |
|------|--------|-------|
| Bounded DB queries (all pages) | [x] | `take:` limits on all 14+ unbounded queries across today-queries.ts, trends-queries.ts, doctor-report |
| Connection pool tuning | [x] | Prisma pool bumped from 5 to 10 |
| ISR caching (Trends) | [x] | `revalidate = 60` replaces `force-dynamic` |
| AI chat abort controller | [x] | Prevents stream memory leaks on unmount |
| Chart memoization | [x] | `useMemo` on filtered data + computed values |

### Landing Page

| Task | Status | Notes |
|------|--------|-------|
| Basic landing page | [x] | `app/page.tsx` — hero CTA exists |
| Full landing page rebuild | [ ] | Responsive, feature sections, social proof |
| SEO (meta, OG, sitemap) | [ ] | — |
| Analytics | [ ] | — |

### Polish

| Task | Status | Notes |
|------|--------|-------|
| Loading states / skeletons | [x] | Skeleton primitive + loading.tsx for today, trends, meds, meds/[id], profile |
| Error handling / boundaries | [ ] | — |
| Animations | [ ] | — |
| Accessibility (WCAG AA) | [ ] | — |
| Mobile testing (Safari, Chrome) | [ ] | — |
| Security cleanup | [ ] | Remove mock-connect, audit routes, remove hardcoded creds |
| Data migration script | [ ] | Streamlit Postgres → new schema (if needed) |

---

## Phase 8: Capacitor Native Wrapper ~ NOT STARTED

**Goal:** Native app with HealthKit, Health Connect, native push, App Store ready.

| Task | Status |
|------|--------|
| Capacitor setup + static export config | [ ] |
| Apple HealthKit (capacitor-health plugin) | [ ] |
| Google Health Connect | [ ] |
| Native push notifications (replace web push) | [ ] |
| iOS build + TestFlight | [ ] |
| Android build + internal testing | [ ] |
| App Store submission | [ ] |
| Google Play submission | [ ] |

---

## Phase Summary

| Phase | Status | What Ships | User Value |
|-------|--------|-----------|------------|
| **1: Foundation** | COMPLETE | Auth, navigation, app shell | Can sign up and navigate |
| **2: Logging** | COMPLETE | All 7 FAB logging flows | Can log meals, weight, glucose, meds, side effects |
| **3: Today** | COMPLETE | Home screen with live data | Daily snapshot, med check-in, recent activity |
| **4: Trends + AI** | COMPLETE | Charts, patterns, real AI chat | See patterns, ask questions, get real answers |
| **5: Meds + Profile** | COMPLETE | Medication management, settings, PDF export | Full medication tracking, doctor exports |
| **6: Data Sync + Onboarding** | PARTIAL | Dexcom sync + onboarding done | Guided setup, Dexcom glucose import |
| **7: PWA + Polish** | PARTIAL | Push notifications + design system done | Med reminders, branded look |
| **8: Capacitor Native** | NOT STARTED | — | — |

### What's Left to Deploy as Beta

The critical path (Phases 1-4) is complete. To ship a production beta:

**Must-do:**
- [ ] Deploy to Vercel (or equivalent)
- [ ] Provision production PostgreSQL (Neon / Supabase)
- [ ] Set production environment variables (Clerk, DB, Anthropic, VAPID, Dexcom, Encryption key)
- [ ] Security audit: remove mock-connect route, verify all API routes are auth-gated
- [ ] Validate Dexcom real OAuth (once sandbox SSL is fixed) or apply for Limited Access

**Should-do before public beta:**
- [x] Dark mode visual pass — verified May 8
- [x] Glucose data flows to Trends page — mock-connect data confirmed rendering in charts
- [x] Loading states / skeleton screens — May 8
- [ ] Error boundaries on all pages
- [ ] Full landing page with feature sections
- [ ] SEO basics (meta tags, OG images)
- [ ] App icon set for PWA install

**Can wait:**
- [ ] Google Fit integration
- [ ] Apple Health (requires Capacitor)
- [ ] Sync-on-open
- [ ] Offline support
- [ ] Capacitor native wrapper + App Store
- [ ] Analytics
- [ ] Data migration from Streamlit

### Risk Mitigation

| Risk | Status |
|------|--------|
| Pattern engine port takes longer than expected | RESOLVED — ported to TypeScript, working |
| Dexcom OAuth approval delays | RESOLVED — sandbox access confirmed Apr 21. SSL cert issue is Dexcom-side. |
| Claude API costs at scale | MITIGATED — streaming responses in place, bounded context windows |
| Capacitor + Next.js static export friction | UNRESOLVED — not yet attempted. Prototype before building native features. |
| App Store rejection (HealthKit) | FUTURE — not started |
| Offline sync conflicts | FUTURE — not started |
