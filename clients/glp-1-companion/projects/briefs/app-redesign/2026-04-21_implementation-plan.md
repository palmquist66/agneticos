# Implementation Plan: GLP-1 Companion Redesign

Phased execution order. Each phase ships a usable increment — the app works at every stage.

---

## Architecture Decisions (Before Code)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 (App Router) | Fastest rebuild path, SSR landing page + client app |
| Styling | Tailwind CSS + shadcn/ui | Consistent components, mobile-first responsive |
| Database | PostgreSQL + Prisma | Keep existing schema logic, type-safe queries |
| Auth | Clerk | Social login, secure password reset, session management |
| AI | Anthropic Claude Sonnet via Vercel AI SDK | Real AI (replaces keyword matching), streaming responses |
| Charts | Recharts (or Nivo) | Good mobile web support, React-native feel |
| PDF | react-pdf (client) or Puppeteer (server) | Doctor export with charts |
| PWA | Serwist | Offline shell, installable, service worker caching |
| Native (Phase 2) | Capacitor 8 | HealthKit, Health Connect, native push |
| Hosting | Vercel | Zero-config Next.js deployment |
| Database hosting | Neon or Supabase Postgres | Serverless Postgres, free tier for MVP |

### Project Structure

```
projects/briefs/app-redesign/
├── brief.md
├── 2026-04-21_platform-evaluation.md
├── 2026-04-21_information-architecture.md
├── 2026-04-21_user-flows.md
├── 2026-04-21_screen-specs.md
├── 2026-04-21_implementation-plan.md    ← this file
└── app/                                  ← all source code lives here
    ├── package.json
    ├── next.config.ts
    ├── prisma/
    │   └── schema.prisma
    ├── src/
    │   ├── app/                          ← Next.js App Router
    │   │   ├── (marketing)/              ← SSR landing page group
    │   │   │   ├── page.tsx              ← Landing page
    │   │   │   └── layout.tsx
    │   │   ├── (auth)/                   ← Auth pages group
    │   │   │   ├── sign-in/
    │   │   │   └── sign-up/
    │   │   ├── (app)/                    ← Authenticated app group
    │   │   │   ├── layout.tsx            ← Bottom nav + FAB
    │   │   │   ├── today/page.tsx
    │   │   │   ├── trends/page.tsx
    │   │   │   ├── meds/page.tsx
    │   │   │   ├── meds/[id]/page.tsx
    │   │   │   ├── profile/page.tsx
    │   │   │   └── log/                  ← FAB logging routes
    │   │   │       ├── meal-photo/page.tsx
    │   │   │       ├── meal-text/page.tsx
    │   │   │       ├── recipe/page.tsx
    │   │   │       ├── weight/page.tsx
    │   │   │       ├── glucose/page.tsx
    │   │   │       ├── side-effect/page.tsx
    │   │   │       └── glp1-dose/page.tsx
    │   │   ├── onboarding/               ← First-time flow
    │   │   │   ├── medication/page.tsx
    │   │   │   ├── goals/page.tsx
    │   │   │   ├── connect/page.tsx
    │   │   │   └── ready/page.tsx
    │   │   ├── admin/page.tsx            ← Auth-gated admin
    │   │   └── api/                      ← API routes
    │   │       ├── ai/analyze-food/route.ts
    │   │       ├── ai/chat/route.ts
    │   │       ├── ai/deep-analysis/route.ts
    │   │       ├── sync/dexcom/route.ts
    │   │       ├── sync/google-fit/route.ts
    │   │       ├── export/pdf/route.ts
    │   │       └── trpc/[trpc]/route.ts
    │   ├── components/
    │   │   ├── ui/                        ← shadcn/ui components
    │   │   ├── nav/                       ← Bottom nav, FAB, header
    │   │   ├── cards/                     ← GLP-1 status, med check-in, etc.
    │   │   ├── charts/                    ← Weight, glucose, patterns
    │   │   ├── forms/                     ← Logging forms
    │   │   └── onboarding/               ← Onboarding step components
    │   ├── lib/
    │   │   ├── db.ts                      ← Prisma client
    │   │   ├── ai.ts                      ← Claude API helpers
    │   │   ├── patterns.ts               ← Pattern detection engine
    │   │   ├── sync/                      ← Data source sync logic
    │   │   └── pdf.ts                     ← PDF generation
    │   └── hooks/
    │       ├── use-today-data.ts
    │       ├── use-patterns.ts
    │       └── use-medications.ts
    ├── public/
    │   ├── manifest.json                  ← PWA manifest
    │   └── sw.js                          ← Service worker (Serwist)
    └── capacitor/                         ← Phase 2: native wrapper
        ├── capacitor.config.ts
        ├── ios/
        └── android/
```

---

## Phase 1: Foundation (Week 1-2)

**Goal:** App shell running with auth, database, and navigation. No features yet — just the skeleton.

### Week 1: Project Setup + Auth + Database

| Task | Details | Est |
|------|---------|-----|
| Initialize Next.js project | `npx create-next-app@latest` with App Router, TypeScript, Tailwind | 1hr |
| Install core deps | shadcn/ui, Prisma, Clerk, Recharts | 1hr |
| Prisma schema | Migrate existing SQLAlchemy models → Prisma schema. Tables: User, GlucoseLog, WeightLog, FoodLog, MedicationLog, MedicationSchedule, SideEffect, MedicationHistory, TitrationSchedule, InjectionSite | 3hr |
| Clerk auth setup | Sign-up, sign-in, middleware, protected routes | 2hr |
| Seed database | Migration script to import existing PostgreSQL data (if users exist) | 2hr |
| Environment config | `.env` for Clerk keys, database URL, Anthropic API key | 30min |

### Week 2: App Shell + Navigation

| Task | Details | Est |
|------|---------|-----|
| Bottom navigation bar | Fixed bottom nav with 4 tabs + FAB button. Active state, icons, routing. | 4hr |
| App layout | `(app)/layout.tsx` — auth check, bottom nav, header | 2hr |
| Route groups | Marketing `(marketing)/`, auth `(auth)/`, app `(app)/`, onboarding | 2hr |
| FAB action sheet | Bottom sheet component. 7 options. Tap outside to dismiss. Routes to `/log/*` pages. | 3hr |
| Empty state screens | Placeholder content for Today, Trends, Meds, Profile with correct routing | 2hr |
| Mobile viewport | Meta tags, safe area insets, prevent zoom on inputs, large touch targets | 1hr |

**Phase 1 checkpoint:** You can sign up, log in, navigate between 4 tabs, tap the FAB, and see placeholder screens. No data yet.

---

## Phase 2: Logging (Week 2-3)

**Goal:** Every FAB logging flow works. This is the core — if users can't log data, nothing else matters.

### Quick Logging Screens (FAB → Log → Save → Today)

| Task | Details | Est |
|------|---------|-----|
| Log Weight (S9d) | Number input pre-filled with last weight, +/- buttons, save to DB | 2hr |
| Log Glucose (S9e) | Number input, context chips (auto-suggest from time), save | 2hr |
| Log Side Effect (S9f) | Symptom chips, severity toggle, notes, save | 2hr |
| Log GLP-1 Dose (S9g) | Medication display, injection site body map, save to MedicationLog + InjectionSite | 4hr |
| Snap a Meal — camera (S9a) | Camera capture, send photo to `/api/ai/analyze-food`, confirmation form with AI-filled fields, save | 6hr |
| Describe a Meal — text (S9b) | Text input, send to `/api/ai/analyze-food` (text mode), same confirmation form, save | 3hr |
| Log a Recipe (S9c) | Photo or text ingredient input, servings, calculate nutrition via AI, portion-adjusted save | 4hr |
| AI food analysis API route | `/api/ai/analyze-food` — accepts image (base64) or text, calls Claude Sonnet, returns structured nutrition JSON | 3hr |
| Toast confirmations | Brief success toast after any save, return to Today | 1hr |

**Phase 2 checkpoint:** All 7 logging flows work end to end. User can log meals (photo + text + recipe), weight, glucose, side effects, and GLP-1 doses. Data is in the database.

---

## Phase 3: Today Screen (Week 3-4)

**Goal:** The home screen shows real data and the medication check-in works.

| Task | Details | Est |
|------|---------|-----|
| Today's Numbers row | Query latest weight, glucose, food protein today. Compact 3-column display. Dash if no data. | 3hr |
| Medication Check-In card | Query today's scheduled meds vs logged meds. Toggle circles. "All taken" batch button. Collapse when complete. | 5hr |
| GLP-1 Status card | Query last GLP-1 log, calculate day X of 7, progress bar, next dose date. Link to GLP-1 Detail. | 3hr |
| Recent Activity feed | Query last 5 entries across all log tables today, sorted by time. Display with type icon + summary. | 3hr |
| Entry edit/delete | Tap any Recent Activity entry → bottom sheet with edit form (all fields) + delete button with confirmation | 4hr |
| Pattern Spotlight | Pull 1 insight from pattern engine (port from Python). Display card with link to Trends. | 2hr |
| Empty states | Friendly empty states for each card when no data ("Tap + to log your first meal") | 1hr |

**Phase 3 checkpoint:** Today screen is fully functional. Users see their daily snapshot, mark meds as taken, and review recent activity. The app feels useful for daily use.

---

## Phase 4: Trends + AI (Week 4-5)

**Goal:** Charts, patterns, and real AI chat.

| Task | Details | Est |
|------|---------|-----|
| Time range selector | 7d/14d/30d/60d/90d pill toggle, controls all charts + patterns | 1hr |
| Weight trend chart | Recharts line chart. Goal weight dashed line. 7-day moving average overlay. Tap point for tooltip. | 4hr |
| Glucose trend chart | Line chart with target range band (shaded). Color-coded points (green/yellow/red). Context filter chips. | 5hr |
| Pattern engine (port) | Port Python pattern detection to TypeScript: weight↔dose, side-effects↔dose, protein↔weight correlations | 6hr |
| Pattern cards | Expandable cards showing each detected pattern with summary text | 3hr |
| Contextual insights | Attach generated insight text below each chart (from pattern engine) | 2hr |
| AI chat — API route | `/api/ai/chat` — builds user data context, calls Claude Sonnet, streams response via Vercel AI SDK | 4hr |
| AI chat — UI | Inline chat at bottom of Trends. Suggested questions. Conversation history (session only). Medical disclaimer. | 4hr |
| Deep Analysis | "Run Full Analysis" button → Claude generates comprehensive narrative. Cached. Re-analyze option. | 3hr |

**Phase 4 checkpoint:** Trends tab shows real charts with contextual insights, pattern cards detect correlations, and AI chat gives real answers backed by user data. The "Pattern Layer" promise is delivered.

---

## Phase 5: Meds + Profile (Week 5-6)

**Goal:** Medication management and profile/settings are complete.

### Meds Tab

| Task | Details | Est |
|------|---------|-----|
| Active Medications list | Card list from MedicationSchedule. Adherence % calculated from logs vs schedule. | 3hr |
| Medication Detail screen (S11) | Drill-down: schedule, adherence stats, log history, edit schedule, delete. | 4hr |
| Add Medication flow (S13) | Name, dosage, frequency picker (daily/specific days/weekly), time picker(s), save. | 3hr |
| Titration Timeline | Visual step chart from TitrationSchedule. Auto-build from log history. Manual edit. | 5hr |
| Injection Site Map | 6-site body map with color-coded recency. Read-only (writes via FAB). | 3hr |
| Medication History | Filterable log. Taken/missed status. Paginated. | 2hr |
| GLP-1 Detail screen (S12) | Cycle tracker + titration + injection map + dose history + correlated side effects. | 4hr |

### Profile Tab

| Task | Details | Est |
|------|---------|-----|
| Your Info section | Display + inline edit: name, GLP-1 med, dosage, other meds | 2hr |
| Health Targets section | Display + inline edit: glucose range, weight goal, protein target | 2hr |
| Connected Data Sources | Status display for each source. Connect/Disconnect buttons. Last sync time. Stub the actual sync logic (Phase 6). | 3hr |
| Doctor Export | Date range picker, data gap warnings, generate PDF (port Python PDF logic to server-side). Download + Share. | 6hr |
| Account section | Change password (Clerk), log out, delete account, privacy/terms links. | 2hr |

**Phase 5 checkpoint:** All 4 main tabs are fully functional. The app is feature-complete for manual data entry. Only data source sync and onboarding remain.

---

## Phase 6: Data Sync + Onboarding (Week 6-7)

**Goal:** Connect external data sources. Guide new users through setup.

### Data Source Sync

| Task | Details | Est |
|------|---------|-----|
| Dexcom OAuth integration | `/api/sync/dexcom` — OAuth 2.0 flow, token storage, glucose data pull. Map to GlucoseLog schema. | 6hr |
| Dexcom sync UI | Connect button → OAuth redirect → callback → initial sync with progress → status display | 3hr |
| Google Fit OAuth integration | `/api/sync/google-fit` — OAuth flow, pull weight + activity data. Store tokens securely (not hardcoded). | 6hr |
| Google Fit sync UI | Connect → OAuth → sync → status. Persist weight readings (not just display-once like current). | 3hr |
| Apple Health placeholder | Show card in Connected Sources: "Available in the mobile app" (Capacitor Phase 2). | 30min |
| Sync-on-open | When app opens, auto-sync connected sources in the background. Show "Syncing..." indicator. | 3hr |
| Manage connections | Choose which data types to sync per source. Disconnect with confirmation + token cleanup. | 2hr |

### Onboarding

| Task | Details | Est |
|------|---------|-----|
| Onboarding flow routing | Detect first login (no medication set). Redirect to `/onboarding/medication`. | 1hr |
| Step 1: Medication (S3) | GLP-1 picker, dosage, other meds. Skip option. | 2hr |
| Step 2: Goals (S4) | Weight goal, protein target, glucose range. Smart defaults. Skip option. | 2hr |
| Step 3: Connect Data (S5) | Data source cards with connect buttons. Manual option. Progress tracking. | 4hr |
| Step 4: Ready (S6) | Import summary, quick tips, go to Today. | 1hr |
| Onboarding state | Track completion. Don't show again. Allow re-run from Profile. | 1hr |

**Phase 6 checkpoint:** New users get a guided setup. Data sources connect and sync automatically. The "data in = value out" principle is realized.

---

## Phase 7: PWA + Landing Page + Polish (Week 7-8)

**Goal:** Installable PWA, marketing landing page, production-ready polish.

### PWA

| Task | Details | Est |
|------|---------|-----|
| Serwist setup | Service worker, manifest.json, offline shell caching | 3hr |
| Install prompt | Custom "Add to Home Screen" banner for mobile users | 2hr |
| Offline support | Cache API responses. Queue writes when offline. Sync when back online. | 5hr |
| App icons | Generate icon set for all sizes (PWA manifest + Apple touch icon) | 1hr |

### Landing Page

| Task | Details | Est |
|------|---------|-----|
| Port landing page | Rebuild current landing copy as SSR Next.js page. Responsive. Fast. | 4hr |
| SEO | Meta tags, Open Graph, structured data, robots.txt, sitemap | 2hr |
| Analytics | PostHog or Vercel Analytics | 1hr |

### Polish

| Task | Details | Est |
|------|---------|-----|
| Loading states | Skeleton screens for Today, Trends, Meds. Spinners for AI analysis. | 3hr |
| Error handling | API error boundaries. Retry logic. User-friendly error messages. | 3hr |
| Animations | Tab transitions, FAB sheet slide, card expand/collapse, toast enter/exit | 3hr |
| Accessibility | ARIA labels, keyboard navigation, color contrast (WCAG AA), screen reader testing | 3hr |
| Mobile testing | Test on iOS Safari, Chrome Android, various screen sizes | 3hr |
| Security cleanup | Remove hardcoded OAuth creds, auth-gate admin, audit all API routes | 2hr |
| Data migration | Script to migrate existing Streamlit PostgreSQL data to new schema (if needed) | 3hr |

**Phase 7 checkpoint:** Production-ready PWA. Users can install it on their home screen. Landing page converts visitors. Offline works. Everything is polished.

---

## Phase 8: Capacitor Native Wrapper (Week 9-10)

**Goal:** Native app with HealthKit, Health Connect, native push, App Store ready.

| Task | Details | Est |
|------|---------|-----|
| Capacitor setup | `@capacitor/core`, `@capacitor/cli`, init with static export | 3hr |
| Static export config | `output: 'export'` in next.config.ts, API routes → separate backend or edge functions | 4hr |
| Apple HealthKit | `capacitor-health` plugin. Read weight, glucose, steps, heart rate. Background delivery. | 8hr |
| Google Health Connect | `capacitor-health` plugin (Android). Read weight, glucose, steps. | 6hr |
| Native push notifications | `@capacitor/push-notifications`. Migrate from web push to native. Medication reminders as scheduled local notifications. | 6hr |
| iOS build + TestFlight | EAS Build or Xcode. Provisioning profiles, certificates, HealthKit entitlement. | 4hr |
| Android build + internal testing | EAS Build or Android Studio. Health Connect permissions, notification permissions. | 3hr |
| App Store submission | Screenshots (3 device sizes), metadata, privacy nutrition labels, HealthKit usage description, review notes. | 6hr |
| Google Play submission | Screenshots, metadata, privacy policy, content rating questionnaire. | 4hr |

**Phase 8 checkpoint:** Native apps on iOS and Android. Apple Health and Health Connect sync automatically. Medication reminders actually fire as push notifications. Listed in both app stores.

---

## Phase Summary

| Phase | Weeks | What Ships | User Value |
|-------|-------|-----------|------------|
| **1: Foundation** | 1-2 | Auth, navigation, app shell | Can sign up and navigate |
| **2: Logging** | 2-3 | All 7 FAB logging flows | Can log meals, weight, glucose, meds, side effects |
| **3: Today** | 3-4 | Home screen with live data | Daily snapshot, med check-in, recent activity |
| **4: Trends + AI** | 4-5 | Charts, patterns, real AI chat | See patterns, ask questions, get real answers |
| **5: Meds + Profile** | 5-6 | Medication management, settings, PDF export | Full medication tracking, doctor exports |
| **6: Data Sync + Onboarding** | 6-7 | Dexcom/Google Fit sync, guided setup | Auto-import data, smooth first experience |
| **7: PWA + Polish** | 7-8 | Installable PWA, landing page, production quality | Home screen install, offline, marketing site |
| **8: Capacitor Native** | 9-10 | HealthKit, Health Connect, native push, App Store | Native app with automatic health data sync |

### Critical Path

```
Phase 1 (foundation)
  → Phase 2 (logging) — the app becomes usable
    → Phase 3 (today) — the app becomes daily-habit-forming
      → Phase 4 (trends + AI) — the app delivers the "Pattern Layer" promise
```

Phases 5-8 add depth but aren't blockers for getting users on the app. You could deploy after Phase 4 and have a solid MVP.

### Earliest Deployable Version: End of Week 5 (After Phase 4)

At that point you have:
- Sign up + log in
- Log any health data in 3-4 taps
- Today screen with daily snapshot + med check-in
- Trends with real charts and AI chat
- Manual data entry (sync comes in Phase 6)
- No onboarding yet (users figure it out — acceptable for beta)

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Pattern engine port takes longer than expected | Port the 3 core patterns first (weight↔dose, side-effects↔dose, protein↔weight). Add more later. |
| Dexcom OAuth approval delays | Dexcom developer registration can take weeks. Apply in Phase 1 while building other features. |
| Claude API costs at scale | Cache AI responses aggressively. Use Haiku for food analysis, Sonnet for chat/deep analysis. Set per-user daily limits. |
| Capacitor + Next.js static export friction | Prototype the static export in Phase 1 to confirm it works before building 8 weeks of features. |
| App Store rejection (HealthKit) | Write thorough privacy policy and review notes. Test HealthKit integration on real devices before submission. |
| Offline sync conflicts | Simple last-write-wins for MVP. User's local write always wins over synced data. |

### Apply for Dexcom Developer Access NOW

Dexcom developer program registration: https://developer.dexcom.com/

Apply during Phase 1. Approval can take 1-4 weeks. You need it before Phase 6. If delayed, ship Phase 6 with Google Fit only and add Dexcom when approved.
