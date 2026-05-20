# Platform Evaluation: GLP-1 Companion Redesign

## Decision: Next.js + Capacitor Hybrid

**Status:** Decided April 21, 2026. Build started April 28, 2026.

Next.js 16 with App Router was selected as the platform for the GLP-1 Companion redesign. The app migrates from the original Streamlit prototype to a full Next.js PWA, with Capacitor native wrapping planned as a future phase for HealthKit, Health Connect, and App Store distribution.

### What's Been Validated Since This Decision

| Concern from evaluation | Result |
|------------------------|--------|
| Next.js 16 App Router stability | Confirmed. proxy.ts (formerly middleware.ts) works for Clerk auth. Route groups work as designed. |
| shadcn/ui component quality | Confirmed. Ships with @base-ui/react. Minor API changes (no `asChild`) handled with `buttonVariants()` + Link. |
| Prisma v7 on PostgreSQL | Confirmed. 11-table schema running. Constructor changed (uses `prisma.config.ts`), but works. |
| Dexcom OAuth on web | Confirmed. Full OAuth 2.0 flow working. Sandbox SSL issue (cert redirect) is a Dexcom problem, not a platform limitation. |
| Web Push for med reminders | Confirmed. VAPID-based push notifications working with mark-taken and snooze actions from the notification itself. |
| Claude AI integration | Confirmed. Vercel AI SDK streaming works for food analysis, chat, and deep analysis. |
| Recharts for mobile charts | Confirmed. Weight and glucose trend charts rendering with interactive tooltips, goal lines, and target range bands. |
| PWA installability | Confirmed. Service worker + manifest.json in place. |

### Actual Tech Stack (as built)

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 16 (App Router) | Running |
| Styling | Tailwind CSS 4 + shadcn/ui | Running |
| Database | PostgreSQL + Prisma 7 | Running |
| Auth | Clerk | Running |
| Charts | Recharts | Running |
| AI | Anthropic Claude (Vercel AI SDK) | Running |
| PDF | Server-side inline styles (doctor report) | Running |
| PWA | Custom service worker + manifest | Running |
| Push | Web Push (VAPID) | Running |
| Encryption | AES-256-GCM (OAuth token storage) | Running |
| Native wrapper | Capacitor 8 | Not started |
| Health data | capacitor-health | Not started |
| Hosting | Local dev (Vercel deployment pending) | Not deployed |

---

## Evaluation Summary (April 21, 2026)

Three options were evaluated. The full analysis follows.

## The Three Options

### Option 1: Stay on Streamlit (Restructure Only)

**What you'd get:** Reorganized tabs, cleaner layout, better visual hierarchy — all within Streamlit's constraints.

| Strength | Limitation |
|----------|-----------|
| Zero migration cost | No offline support — app dies without internet |
| Python ecosystem (Claude SDK, Plotly, pandas) | No push notifications — can't remind users to take meds |
| Fastest iteration speed | No background sync — data only loads when user has app open |
| Camera input works for food logging | WebSocket drops lose form state mid-entry |
| Pattern engine already built | No app store distribution |
| | Sidebar hamburger menu buries navigation on mobile |
| | Every tap triggers server round-trip (1-3s latency with caching) |
| | No onboarding wizard support (no modals, no step flows) |

**Verdict:** The problems you're seeing (messy pages, unclear hierarchy) are partly information architecture — but mostly Streamlit hitting its ceiling. You can reorganize tabs and that helps, but you can't fix "open the app and my data is already there" or "remind me to take my Ozempic" on Streamlit. The framework was built for data dashboards, not consumer health apps.

---

### Option 2: React Native + Expo (Full Native App)

**What you'd get:** A real mobile app on iOS and Android with native health integrations, push notifications, offline support, and App Store presence.

| Strength | Limitation |
|----------|-----------|
| Apple HealthKit + Google Health Connect integration | 12-16 week rebuild (4-5x longer than Streamlit took) |
| Background sync — data ready when you open the app | Must rebuild every screen from scratch |
| Native push notifications for med reminders | Two native health APIs to maintain (iOS + Android) |
| Offline-first with local SQLite | No web version — users can't access from a browser |
| 60fps charts via Victory Native XL (Skia) | Dev builds required (no Expo Go for health modules) |
| App Store distribution via EAS Build | Android notification reliability issues (manufacturer-specific) |
| Best long-term mobile UX | No landing page / SEO without a separate web project |

**Key libraries:** `@kingstinct/react-native-healthkit` (with background delivery), `react-native-health-connect`, `expo-notifications`, `expo-sqlite` + Drizzle ORM, Victory Native XL for charts.

**Verdict:** Most capable platform for a health app. Every feature you need is covered. But the rebuild timeline is significant and you lose the web presence entirely. Makes sense if you're committed to mobile-only.

---

### Option 3: Next.js + Capacitor Hybrid (Recommended)

**What you'd get:** A Next.js web app that works as a PWA immediately, then wraps with Capacitor for native features (HealthKit, push notifications, app store).

| Strength | Limitation |
|----------|-----------|
| Fastest rebuild: 4-6 weeks to working PWA | Capacitor WebView not as smooth as true native |
| Same codebase for web + iOS + Android | Static export required for Capacitor (no SSR in native app) |
| SSR landing page + app under one domain | Health plugins less mature than React Native equivalents |
| Dexcom API works natively on web | Two-phase delivery (web first, native features after) |
| HealthKit via `capacitor-health` plugin | |
| Native push notifications via Capacitor | |
| App Store distribution | |
| Offline support via service workers + IndexedDB | |
| TypeScript end-to-end | |

**How it works in practice:**

```
Phase 1 (weeks 1-6): Ship as Next.js PWA
├── Full app works in any mobile browser
├── Manual entry for weight, glucose, meds, symptoms
├── Camera food logging → Claude AI analysis
├── Dexcom API integration (works on web)
├── Charts, PDF export, AI chat
├── Server-side push for med reminders
└── SSR landing page for SEO

Phase 2 (weeks 7-10): Add Capacitor native wrapper
├── Apple HealthKit sync (weight, glucose, steps)
├── Google Health Connect sync
├── Native push notifications (replaces web push)
├── Background data sync
└── Submit to App Store + Google Play
```

**Verdict:** Best balance of speed and capability. You ship a working product in 4-6 weeks that covers 80% of the value. Then add native health integrations without rewriting anything.

---

## Head-to-Head Comparison

| Feature | Streamlit | React Native | Next.js + Capacitor |
|---------|-----------|-------------|-------------------|
| **Time to working app** | Already built | 12-16 weeks | 4-6 weeks (PWA) + 4 weeks (native) |
| **Apple Health sync** | No | Yes (background) | Yes (via Capacitor) |
| **Google Health Connect** | No | Yes | Yes (via Capacitor) |
| **Dexcom integration** | CSV upload only | OAuth API | OAuth API |
| **Push notifications** | No | Yes (native) | Web push → native push |
| **Offline support** | No | Yes (SQLite) | Yes (service workers + IndexedDB) |
| **Background sync** | No | Yes | Yes (via Capacitor) |
| **App Store** | No | Yes | Yes (via Capacitor) |
| **Landing page / SEO** | Basic | Separate project needed | Built-in (SSR) |
| **Camera food logging** | Works | Works | Works |
| **AI chat** | Works | Works | Works |
| **PDF export** | Works | Works | Works |
| **Charts** | Plotly (good) | Victory Native XL (best) | Nivo/Recharts (good) |
| **Mobile UX quality** | Poor | Best | Good (WebView) |
| **Development velocity** | Fastest per feature | Slowest | Fast |
| **Codebase reuse** | None → migration | Mobile only | Web + mobile |

---

## Recommendation: Next.js + Capacitor

**Why this wins for where you are right now:**

1. **Speed to value.** You have a working Streamlit app that proves the concept. You don't need 16 weeks to rebuild in React Native — you need a better UI in 4-6 weeks that you can ship and get real users on.

2. **Progressive enhancement.** The web app works immediately for anyone with a phone browser. No app store approval required to start getting users. Add native features as phase 2 when you've validated the redesign works.

3. **One codebase forever.** Unlike Streamlit → React Native (total rewrite), Next.js + Capacitor means your web app IS your mobile app. No maintaining two codebases.

4. **The data sync story works.** Dexcom API works on web day one. Apple Health and Google Health Connect come with Capacitor in phase 2. Manual entry stays as a fallback — and for many GLP-1 users, manual logging IS the primary flow (weighing in, logging food, marking meds taken).

5. **Your landing page and app live together.** SSR marketing pages at `/`, the app at `/app`. One deployment, one domain, one brand experience.

**Proposed tech stack:**

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma |
| Auth | Clerk |
| Charts | Nivo (or Recharts + Tremor) |
| AI | Anthropic Claude (Vercel AI SDK) |
| PDF | react-pdf or server-side Puppeteer |
| PWA | Serwist (next-pwa successor) |
| Native wrapper | Capacitor 8 |
| Health data | capacitor-health (HealthKit + Health Connect) |
| Notifications | Web Push (phase 1) → @capacitor/push-notifications (phase 2) |
| Hosting | Vercel (web) + EAS/Capacitor (native builds) |
