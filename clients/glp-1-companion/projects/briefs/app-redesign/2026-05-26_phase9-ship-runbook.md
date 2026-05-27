# Phase 9 — Ship Runbook (Backend Deploy + Native Health Sync)

**Supersedes** `2026-05-23_phase9-health-sync-runbook.md`. That version assumed the
backend was already live. It isn't. This runbook fixes the order.

Everything here needs your machine, a physical iPhone, and your accounts
(GitHub, Vercel, Apple Developer, optionally Google Play). Do the stages in order.

---

## The blocker the old runbook missed

The Expo app talks to `https://glp1companion.vercel.app`, but the **entire REST API
the mobile app depends on is uncommitted and undeployed.** The backend repo
(`palmquist66/glp1-companion`) is exactly even with `origin/main` (0 ahead, 0 behind),
yet these are sitting uncommitted locally:

**New route groups never pushed (they 404 in production right now):**
`/api/today`, `/api/trends`, `/api/log`, `/api/meds`, `/api/user`, `/api/onboarding`,
`/api/notifications/device-token`, `/api/sync/health/*` (Phase 9).

**Modified but undeployed:** `prisma/schema.prisma` (Phase 9 tables), `sync/status`,
`trends-queries.ts`, `auth.ts`, `push-server.ts`, and others. The `add_device_token`
migration is also untracked.

Consequence: the mobile app has only ever run against a **local** dev backend. Build
it today against production and almost nothing works (not just health sync: logging,
Today, Trends, Meds too). So the first move is shipping the backend, not native deps.

---

## Stage 1 — Ship the backend

Run in `projects/briefs/app-redesign/app/`.

1. **Commit the uncommitted work** (8 modified files + 8 new route groups). There is a
   stray `test-waitlist.ts` scratch file in the diff — do not ship it.
   ```bash
   git add -A
   git reset -- test-waitlist.ts   # stray scratch file, keep it out of the commit
   git commit -m "feat: mobile REST API layer + Phase 9 health sync backend"
   ```
2. **Generate the Phase 9 migration:**
   ```bash
   npx prisma migrate dev --name phase9_health_sync
   ```
   Caveat: the new `@@unique([userId, loggedAt, source])` on `WeightLog` fails if
   duplicate rows exist. If it errors, find collisions and dedupe first:
   ```sql
   SELECT "userId", "loggedAt", source, COUNT(*)
   FROM "WeightLog" GROUP BY 1,2,3 HAVING COUNT(*) > 1;
   ```
   Then re-run the migrate command.
3. **Push** (triggers the Vercel deploy):
   ```bash
   git push origin main
   ```

## Stage 2 — Migrate the production database

The deployed code 500s if it hits tables that don't exist yet. The Phase 9 schema
changes are additive (new `ActivityLog` table, new nullable `metadata` column, new
enum value), so they are backward-compatible. Run against your production DB
(Supabase/Neon), ideally before or right after the deploy:

```bash
npx prisma migrate deploy   # with DATABASE_URL pointed at production
```

**Check `DEMO_MODE` is OFF in production (critical).** `proxy.ts` skips all auth when
`DEMO_MODE=true`, and `getCurrentUser()` then returns the first user in the DB to any
unauthenticated request. If that flag is set in Vercel prod, the entire API serves one
user's health data to anyone. Confirm `DEMO_MODE` is unset or `false` in the Vercel
project's environment variables before going live.

**Verify before touching the phone.** This should return `401` (deployed, needs auth),
not `404` (not deployed) and not `200` (which would mean auth is bypassed):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://glp1companion.vercel.app/api/trends
```

## Stage 3 — Build and test the mobile app

Run in `projects/briefs/app-redesign/mobile/`.

4. **Create `mobile/.env`** (does not exist yet):
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...   # same Clerk project as web
   EXPO_PUBLIC_API_URL=https://glp1companion.vercel.app
   ```
5. **Install the native libraries** (`app.json` already references these plugins, so a
   prebuild fails until they are installed):
   ```bash
   npx expo install @kingstinct/react-native-healthkit react-native-nitro-modules \
     react-native-health-connect expo-build-properties
   ```
6. **Prebuild** and confirm the entitlements/manifest landed:
   ```bash
   npx expo prebuild --clean
   ```
   - iOS: `ios/<App>/<App>.entitlements` has `com.apple.developer.healthkit` (+
     background-delivery); `Info.plist` has `NSHealthShareUsageDescription` +
     `NSHealthUpdateUsageDescription`.
   - Android: `AndroidManifest.xml` has the `READ_*` health permissions, the
     rationale intent filter, and the `ViewPermissionUsageActivity` alias.
   - If `react-native-health-connect`'s own plugin already injects the rationale
     activity (duplicate-manifest build error), delete
     `plugins/withHealthConnectRationale.js` and its entry in `app.json`.
7. **Build for a physical iPhone.** Two gotchas:
   - The `development` profile in `eas.json` is `ios.simulator: true`. HealthKit is
     unreliable on the simulator, so set it to `false` (or add a device profile) for a
     device-installable build.
   - A device build needs a **paid Apple Developer account** ($99/yr). EAS manages the
     provisioning; the Apple account is the gate.
   ```bash
   eas build --profile development --platform ios
   npx expo start --dev-client   # after installing the build on the device
   ```
8. **Test on device:**
   1. In the Health app, add a few weight, blood-glucose, steps, and active-energy samples.
   2. App → onboarding Connect step (or Profile → Apple Health) → Connect → grant all reads.
   3. Confirm "Connected", then Sync now → it should report N new records.
   4. Trends → weight/glucose charts populate; Activity card shows avg steps + active kcal.
   5. Background the app, add a new Health sample, reopen → foreground auto-sync pulls it
      (throttled to once / 10 min).
   - On device, just confirm a quantity sample's value field is `quantity` and each
     statistics bucket carries `sumQuantity.quantity` (defensive parsing is in place but
     unverified on hardware).

## Stage 4 — Parallel long-lead items (start anytime, don't block on them)

- **`eas init`** in `mobile/` writes `eas.projectId` into `app.json`. Also unblocks
  production push tokens (open thread from the May 19 push work).
- **Google Play health-data declaration** (Android only). ~7-day approval plus several
  days of whitelist propagation. Declare Weight, Blood glucose, Steps, Active calories;
  justify with GLP-1 progress tracking + doctor export. iOS does not need this.

---

## Known caveats (carried forward)

- **Steps / active energy (iOS):** totaled via a HealthKit statistics collection query
  (`cumulativeSum` over daily buckets), which dedupes overlapping samples across sources
  (iPhone + Watch). Android (Health Connect) still sums raw records; switch to
  `aggregateGroupByPeriod` when Android is prioritized.
- **iOS read-permission opacity:** HealthKit never reveals whether read access was
  granted, so Connect optimistically succeeds and an empty first sync is the signal that
  nothing was shared.
- **Sync cursor advances before import is confirmed (data-loss-on-failure).** In
  `mobile/lib/health.ts`, iOS anchors are saved inside `queryAnchoredIOS` and the Android
  `since` timestamps are saved in `pullAndroid`, both BEFORE the `/api/sync/health/import`
  POST runs in `health-sync.ts`. If that POST fails (the catch just logs), those samples
  are never re-pulled. The backend import is idempotent (`createMany skipDuplicates` +
  `upsert`), so the fix is to advance cursors only after a successful POST. Worth fixing
  before wider rollout; needs its own change + on-device test, so not bundled into prep.
- **First-sync history asymmetry.** Android first sync looks back 30 days
  (`FIRST_SYNC_LOOKBACK_DAYS`); iOS anchored queries with no anchor pull ALL weight/glucose
  history. Not a bug, but first-connect depth differs by platform. Decide if iOS should be
  bounded too.
- **`/api/notifications/device-token`** sits under the public route matcher
  (`/api/notifications(.*)`) but self-gates via `getCurrentUser()` (returns 401), so it is
  safe. Noted only because the placement looks unprotected at a glance.
- **Fixed (2026-05-26):** the 3 `Colors[colorScheme]` union type errors in
  `components/profile/health-targets-card.tsx` are resolved (prop now typed `AppColors`).
  Mobile + backend both typecheck clean.

---

## Checklist

- [ ] Backend committed
- [ ] `phase9_health_sync` migration generated + committed
- [ ] Pushed to GitHub → Vercel deploy succeeded
- [ ] Production DB migrated (`migrate deploy`)
- [ ] `DEMO_MODE` confirmed OFF in Vercel production env
- [ ] `/api/trends` returns 401 in production (verified)
- [ ] `mobile/.env` created
- [ ] Native deps installed (`expo install`)
- [ ] `expo prebuild --clean` ran, entitlements verified
- [ ] `eas.json` development profile set to device (`ios.simulator: false`)
- [ ] Apple Developer account active
- [ ] iOS dev build installed on physical iPhone
- [ ] On-device Connect + Sync flow verified end to end
- [ ] `eas init` run (`eas.projectId` set)
- [ ] Google Play health declaration started (Android only)
