# Phase 9 — Native Health Sync: Build & Ship Runbook

Everything that needs **your machine / device / accounts** to finish Phase 9.
The code is written and type-checks; these steps install the native deps,
migrate the DB, and produce a testable build. Do them in order.

---

## 1. Database migration (do this first)

The schema gained `ActivityLog`, a `metadata` column + composite unique on
`WeightLog`, and `health_connect` as a valid source. Apply it:

```bash
cd projects/briefs/app-redesign/app
npx prisma migrate dev --name phase9_health_sync
```

This generates + applies the migration and regenerates the Prisma client.

⚠️ **One risk:** the new `@@unique([userId, loggedAt, source])` on `WeightLog`
will fail to apply if existing rows already collide (same user + same
`loggedAt` + same `source`). Unlikely (manual entries rarely share a
millisecond), but if the migration errors on a duplicate-key constraint, find
collisions first:

```sql
SELECT "userId", "loggedAt", source, COUNT(*)
FROM "WeightLog" GROUP BY 1,2,3 HAVING COUNT(*) > 1;
```

Delete/merge any dupes, then re-run the migration.

For production (Vercel + Supabase/Neon), deploy with `npx prisma migrate deploy`.

---

## 2. Install the native libraries (mobile)

These can't be installed from the agent environment — run locally. `expo
install` picks SDK-54-compatible versions:

```bash
cd projects/briefs/app-redesign/mobile
npx expo install @kingstinct/react-native-healthkit react-native-nitro-modules \
  react-native-health-connect expo-build-properties
```

(`expo-device` and `expo-secure-store` are already installed.)

---

## 3. Prebuild and verify the generated native config

```bash
npx expo prebuild --clean
```

Then **verify the config landed** (the HealthKit plugin and the custom
`plugins/withHealthConnectRationale.js` own these now — `app.json`'s manual
HealthKit entitlements were intentionally removed to avoid duplicate-key drift):

- **iOS** — `ios/<App>/<App>.entitlements` contains
  `com.apple.developer.healthkit` and `com.apple.developer.healthkit.background-delivery`;
  `Info.plist` has `NSHealthShareUsageDescription` + `NSHealthUpdateUsageDescription`.
- **Android** — `android/app/src/main/AndroidManifest.xml` contains the
  `android.permission.health.READ_*` uses-permissions, the
  `androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE` intent filter, and the
  `ViewPermissionUsageActivity` activity-alias.

> If `react-native-health-connect`'s own plugin already injects the rationale
> activity (check for a duplicate-manifest-entry build error), delete
> `plugins/withHealthConnectRationale.js` and its entry in `app.json`.

---

## 4. Dev build + device test (iOS first)

HealthKit is unreliable on the Simulator — **test on a physical iPhone.**

```bash
eas build --profile development --platform ios
# install the build on your device, then:
npx expo start --dev-client
```

Test flow:
1. In the **Health app**, add a few weight, blood-glucose, steps, and active-energy samples.
2. App → **onboarding Connect step** (or **Profile → Apple Health**) → tap Connect → grant all read permissions in the HealthKit sheet.
3. Confirm "Connected", then **Sync now** → it should report N new records.
4. **Trends** → weight/glucose charts populate, **Activity** card shows avg steps + active kcal.
5. Background the app, add a new Health sample, reopen → foreground auto-sync pulls it (throttled to once / 10 min).

**Verify against the installed library versions:** `lib/health.ts` reads native
sample fields defensively. The query signatures were verified against the
kingstinct `master` source — `queryQuantitySamplesWithAnchor` for weight/glucose
and `queryStatisticsCollectionForQuantity(id, ['cumulativeSum'], anchorDate,
{day:1}, {unit, filter:{date:{startDate,endDate}}})` for steps/energy. On device,
just confirm a quantity sample's value field is `quantity` and that each
statistics bucket carries `sumQuantity.quantity`.

---

## 5. Configure `eas.projectId` (carryover from push work)

Production Expo push tokens need it (open thread from the May 19 push build):

```bash
cd projects/briefs/app-redesign/mobile
eas init   # writes extra.eas.projectId into app.json
```

---

## 6. Android: start the Google Play health-data declaration NOW

Android prod release is **gated by a Google Play Health Connect data-type
declaration** — approval runs ~7 days plus several days of server-side
whitelist propagation. Start it before you need it:

- In Play Console, complete the **Health Connect / health-data declaration**
  form for each type you read: Weight, Blood glucose, Steps, Active calories.
- Justify the use (GLP-1 progress tracking + doctor export).

Then build/test Android the same way (`eas build --profile development --platform android`)
on a device with Health Connect (built in on Android 14+, Play Store app on older).

---

## What's already done (no action needed)

- **Backend**: `POST /api/sync/health/import`, `/connect`, `/disconnect`,
  `/api/sync/status` (now reports `apple_health` + `health_connect`), and
  `/api/trends` extended with `activity`. All type-check clean.
- **Mobile**: `lib/health.ts` (platform abstraction), `lib/health-sync.ts`
  (connect / sync / disconnect + `useHealthAutoSync`), `DataSourcesCard` on
  Profile, functional onboarding Connect step, and the Trends `ActivityChart`.
- **Config**: `app.json` plugins + Android permissions + the Health Connect
  rationale plugin.

## Known caveats

- **Steps / active energy (iOS)**: totaled via a HealthKit statistics
  collection query (`cumulativeSum` over daily buckets), which deduplicates
  overlapping samples across sources (iPhone + Watch) — no double-counting.
  Android (Health Connect) still sums raw records; switch to
  `aggregateGroupByPeriod` when Android is prioritized.
- **iOS read-permission opacity**: HealthKit never reveals whether read access
  was granted, so Connect optimistically succeeds and an empty first sync is the
  signal that nothing was shared.
- **Pre-existing**: `components/profile/health-targets-card.tsx` has 3
  `Colors[colorScheme]` union type errors from the prior session — not from this
  work, and harmless to Metro (Babel) builds.
