/**
 * Native health data abstraction (Apple HealthKit / Android Health Connect).
 *
 * The rest of the app talks only to this module — it never imports the native
 * libraries directly. That keeps platform/library specifics in one file: if a
 * library's API shifts, this is the only thing to fix.
 *
 * Libraries (loaded lazily, per-platform, so the wrong native module is never
 * touched on the other OS):
 *   - iOS:     @kingstinct/react-native-healthkit (v14, Nitro / New Arch)
 *   - Android: react-native-health-connect (v3.5)
 *
 * Canonical units returned to the backend: weight in **lbs**, glucose in
 * **mg/dL** (matches the Prisma schema). Steps + active energy are aggregated
 * to per-day totals.
 *
 * Sync model:
 *   - weight + glucose → incremental (iOS anchored queries; Android time-since
 *     filter). Discrete point readings, deduped server-side.
 *   - steps + active energy → re-read a trailing window every sync and emit
 *     daily totals (idempotent upsert server-side). Avoids the "partial day"
 *     problem where an incremental delta would overwrite a day's running total.
 *
 * NOTE: native sample shapes are read defensively (multiple field fallbacks)
 * because exact shapes vary by library version — verify against the installed
 * version's README when wiring up the dev build.
 */
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import type { HealthSample, DailyActivityTotals, HealthSource } from "@shared/types";

// Lazy requires — only evaluated inside the matching Platform.OS branch.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hk(): any {
  return require("@kingstinct/react-native-healthkit");
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hc(): any {
  return require("react-native-health-connect");
}

const KG_TO_LB = 2.2046226218;
const ACTIVITY_LOOKBACK_DAYS = 7;
const FIRST_SYNC_LOOKBACK_DAYS = 30;

// HealthKit quantity type identifiers.
const HK_WEIGHT = "HKQuantityTypeIdentifierBodyMass";
const HK_GLUCOSE = "HKQuantityTypeIdentifierBloodGlucose";
const HK_STEPS = "HKQuantityTypeIdentifierStepCount";
const HK_ENERGY = "HKQuantityTypeIdentifierActiveEnergyBurned";

// SecureStore keys.
const KEY_ANCHOR_WEIGHT = "health.anchor.weight";
const KEY_ANCHOR_GLUCOSE = "health.anchor.glucose";
const KEY_SINCE_WEIGHT = "health.since.weight";
const KEY_SINCE_GLUCOSE = "health.since.glucose";

// ─── Public surface ─────────────────────────────────────────

export type HealthDataType = "weight" | "glucose" | "steps" | "activeEnergy";

export interface PulledHealthData {
  samples: HealthSample[];
  dailyActivity: DailyActivityTotals[];
}

/** Which backend source string this platform maps to (null on web/unsupported). */
export function getHealthSource(): HealthSource | null {
  if (Platform.OS === "ios") return "apple_health";
  if (Platform.OS === "android") return "health_connect";
  return null;
}

/** Whether native health is usable on this device right now. */
export async function isHealthAvailable(): Promise<boolean> {
  if (!Device.isDevice) return false; // HealthKit is unreliable on simulator
  try {
    if (Platform.OS === "ios") {
      const m = hk();
      const fn = m.isHealthDataAvailable ?? m.default?.isHealthDataAvailable;
      return fn ? await fn() : true;
    }
    if (Platform.OS === "android") {
      // initialize() resolves false when Health Connect isn't installed.
      return await hc().initialize();
    }
  } catch (e) {
    console.warn("[health] availability check failed", e);
  }
  return false;
}

/** Prompt for read permissions. Returns true if the user can be queried. */
export async function requestHealthPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "ios") {
      const m = hk();
      const toRead = [HK_WEIGHT, HK_GLUCOSE, HK_STEPS, HK_ENERGY];
      // kingstinct: requestAuthorization(toShare, toRead)
      await m.requestAuthorization([], toRead);
      // HealthKit never reveals read-grant status, so we optimistically return
      // true and let the first query determine whether data is reachable.
      return true;
    }
    if (Platform.OS === "android") {
      const m = hc();
      await m.initialize();
      const granted = await m.requestPermission([
        { accessType: "read", recordType: "Weight" },
        { accessType: "read", recordType: "BloodGlucose" },
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "ActiveCaloriesBurned" },
      ]);
      return Array.isArray(granted) && granted.length > 0;
    }
  } catch (e) {
    console.warn("[health] permission request failed", e);
  }
  return false;
}

/** Best-effort list of granted read types (Android is authoritative; iOS opaque). */
export async function getGrantedHealthTypes(): Promise<string[]> {
  try {
    if (Platform.OS === "android") {
      const granted = await hc().getGrantedPermissions();
      return (granted ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p.recordType ?? `${p.accessType}:${p.recordType}`
      );
    }
  } catch (e) {
    console.warn("[health] getGrantedPermissions failed", e);
  }
  return [];
}

/** Pull new health data since the last sync. Advances stored anchors. */
export async function pullHealthData(): Promise<PulledHealthData> {
  if (Platform.OS === "ios") return pullIOS();
  if (Platform.OS === "android") return pullAndroid();
  return { samples: [], dailyActivity: [] };
}

/** Clear stored sync cursors (call on disconnect so a reconnect re-imports). */
export async function resetHealthSyncState(): Promise<void> {
  await Promise.all(
    [KEY_ANCHOR_WEIGHT, KEY_ANCHOR_GLUCOSE, KEY_SINCE_WEIGHT, KEY_SINCE_GLUCOSE].map((k) =>
      SecureStore.deleteItemAsync(k).catch(() => {})
    )
  );
}

// ─── Helpers ────────────────────────────────────────────────

function startOfUtcDayDate(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function startOfUtcDayISO(d: Date): string {
  return startOfUtcDayDate(d).toISOString();
}

function firstSyncSince(): Date {
  return new Date(Date.now() - FIRST_SYNC_LOOKBACK_DAYS * 86400_000);
}

function activityWindowStart(): Date {
  return new Date(Date.now() - ACTIVITY_LOOKBACK_DAYS * 86400_000);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sampleValue(s: any): number | null {
  const v = s?.quantity ?? s?.value ?? s?.count;
  return typeof v === "number" && isFinite(v) ? v : null;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sampleDate(s: any): Date {
  return new Date(s?.startDate ?? s?.time ?? s?.startTime ?? s?.endDate ?? Date.now());
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sampleId(s: any): string | undefined {
  const id = s?.uuid ?? s?.id ?? s?.metadata?.id;
  return typeof id === "string" ? id : undefined;
}

/** Bucket step/energy samples into per-UTC-day totals. */
function aggregateDaily(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepSamples: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  energySamples: any[],
  stepValue: (s: unknown) => number | null,
  energyValue: (s: unknown) => number | null
): DailyActivityTotals[] {
  const byDay = new Map<string, { steps: number; energy: number; hasStep: boolean; hasEnergy: boolean }>();
  const get = (d: string) =>
    byDay.get(d) ?? { steps: 0, energy: 0, hasStep: false, hasEnergy: false };

  for (const s of stepSamples) {
    const v = stepValue(s);
    if (v == null) continue;
    const day = startOfUtcDayISO(sampleDate(s));
    const cur = get(day);
    cur.steps += v;
    cur.hasStep = true;
    byDay.set(day, cur);
  }
  for (const s of energySamples) {
    const v = energyValue(s);
    if (v == null) continue;
    const day = startOfUtcDayISO(sampleDate(s));
    const cur = get(day);
    cur.energy += v;
    cur.hasEnergy = true;
    byDay.set(day, cur);
  }

  return Array.from(byDay.entries()).map(([date, v]) => ({
    date,
    steps: v.hasStep ? Math.round(v.steps) : undefined,
    activeEnergyKcal: v.hasEnergy ? parseFloat(v.energy.toFixed(1)) : undefined,
  }));
}

// ─── iOS (HealthKit) ────────────────────────────────────────

async function pullIOS(): Promise<PulledHealthData> {
  const m = hk();
  const samples: HealthSample[] = [];

  // Weight + glucose via anchored queries (incremental, delete-aware).
  const weight = await queryAnchoredIOS(m, HK_WEIGHT, "lb", KEY_ANCHOR_WEIGHT);
  for (const s of weight) {
    const v = sampleValue(s);
    if (v == null) continue;
    samples.push({
      type: "weight",
      value: v, // already in lb (requested unit)
      recordedAt: sampleDate(s).toISOString(),
      sampleId: sampleId(s),
    });
  }

  const glucose = await queryAnchoredIOS(m, HK_GLUCOSE, "mg/dL", KEY_ANCHOR_GLUCOSE);
  for (const s of glucose) {
    const v = sampleValue(s);
    if (v == null) continue;
    samples.push({
      type: "glucose",
      value: v,
      recordedAt: sampleDate(s).toISOString(),
      sampleId: sampleId(s),
    });
  }

  // Steps + active energy: per-day SUM via a statistics collection query.
  // `cumulativeSum` deduplicates overlapping samples across sources (iPhone +
  // Watch report the same steps) — raw-sample summing would double-count.
  const since = activityWindowStart();
  const anchor = startOfUtcDayDate(since);
  const [stepBuckets, energyBuckets] = await Promise.all([
    queryDailyStatsIOS(m, HK_STEPS, "count", anchor, since),
    queryDailyStatsIOS(m, HK_ENERGY, "kcal", anchor, since),
  ]);
  const dailyActivity = bucketsToDaily(stepBuckets, energyBuckets);

  return { samples, dailyActivity };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryAnchoredIOS(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  m: any,
  identifier: string,
  unit: string,
  anchorKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    const anchor = (await SecureStore.getItemAsync(anchorKey)) || undefined;
    const res = await m.queryQuantitySamplesWithAnchor(identifier, {
      unit,
      anchor,
      limit: 0, // 0 = no limit
    });
    const samples = res?.samples ?? res?.newSamples ?? [];
    const newAnchor = res?.newAnchor ?? res?.anchor;
    if (typeof newAnchor === "string") {
      await SecureStore.setItemAsync(anchorKey, newAnchor);
    }
    return samples;
  } catch (e) {
    console.warn(`[health] iOS anchored query failed for ${identifier}`, e);
    return [];
  }
}

/**
 * Per-day SUM via HKStatisticsCollectionQuery (kingstinct
 * `queryStatisticsCollectionForQuantity`). `cumulativeSum` over {day:1} buckets
 * deduplicates overlapping samples from multiple sources — the correct way to
 * total steps / active energy. Returns the raw bucket responses, each carrying
 * `sumQuantity: { quantity, unit }` and `startDate`.
 */
async function queryDailyStatsIOS(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  m: any,
  identifier: string,
  unit: string,
  anchorDate: Date,
  since: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    const res = await m.queryStatisticsCollectionForQuantity(
      identifier,
      ["cumulativeSum"],
      anchorDate,
      { day: 1 },
      { unit, filter: { date: { startDate: since, endDate: new Date() } } }
    );
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.warn(`[health] iOS statistics collection failed for ${identifier}`, e);
    return [];
  }
}

/** Merge step + energy daily buckets into DailyActivityTotals keyed by UTC day. */
function bucketsToDaily(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepBuckets: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  energyBuckets: any[]
): DailyActivityTotals[] {
  const byDay = new Map<string, { steps?: number; energy?: number }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const read = (b: any): { value: number | null; date: Date } => {
    const q = b?.sumQuantity?.quantity;
    return {
      value: typeof q === "number" && isFinite(q) ? q : null,
      date: new Date(b?.startDate ?? b?.endDate ?? Date.now()),
    };
  };

  for (const b of stepBuckets) {
    const { value, date } = read(b);
    if (value == null || value <= 0) continue;
    const day = startOfUtcDayISO(date);
    const cur = byDay.get(day) ?? {};
    cur.steps = Math.round(value);
    byDay.set(day, cur);
  }
  for (const b of energyBuckets) {
    const { value, date } = read(b);
    if (value == null || value <= 0) continue;
    const day = startOfUtcDayISO(date);
    const cur = byDay.get(day) ?? {};
    cur.energy = parseFloat(value.toFixed(1));
    byDay.set(day, cur);
  }

  return Array.from(byDay.entries()).map(([date, v]) => ({
    date,
    steps: v.steps,
    activeEnergyKcal: v.energy,
  }));
}

// ─── Android (Health Connect) ───────────────────────────────

async function pullAndroid(): Promise<PulledHealthData> {
  const m = hc();
  await m.initialize();
  const samples: HealthSample[] = [];

  // Weight — incremental since stored timestamp.
  const weightSince =
    (await SecureStore.getItemAsync(KEY_SINCE_WEIGHT)) ?? firstSyncSince().toISOString();
  const weightRes = await readRecordsAndroid(m, "Weight", weightSince);
  for (const r of weightRes) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = r as any;
    const kg = rec?.weight?.inKilograms;
    const lb = rec?.weight?.inPounds ?? (typeof kg === "number" ? kg * KG_TO_LB : null);
    if (typeof lb !== "number" || !isFinite(lb)) continue;
    samples.push({
      type: "weight",
      value: parseFloat(lb.toFixed(1)),
      recordedAt: sampleDate(rec).toISOString(),
      sampleId: sampleId(rec),
    });
  }

  // Glucose — incremental since stored timestamp.
  const glucoseSince =
    (await SecureStore.getItemAsync(KEY_SINCE_GLUCOSE)) ?? firstSyncSince().toISOString();
  const glucoseRes = await readRecordsAndroid(m, "BloodGlucose", glucoseSince);
  for (const r of glucoseRes) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = r as any;
    const mgdl = rec?.level?.inMilligramsPerDeciliter;
    const mmol = rec?.level?.inMillimolesPerLiter;
    const value =
      typeof mgdl === "number" ? mgdl : typeof mmol === "number" ? mmol * 18.0182 : null;
    if (value == null || !isFinite(value)) continue;
    samples.push({
      type: "glucose",
      value: Math.round(value),
      recordedAt: sampleDate(rec).toISOString(),
      sampleId: sampleId(rec),
    });
  }

  const now = new Date().toISOString();
  await SecureStore.setItemAsync(KEY_SINCE_WEIGHT, now);
  await SecureStore.setItemAsync(KEY_SINCE_GLUCOSE, now);

  // Steps + active energy: trailing window → daily totals.
  const windowStart = activityWindowStart().toISOString();
  const stepRecs = await readRecordsAndroid(m, "Steps", windowStart);
  const energyRecs = await readRecordsAndroid(m, "ActiveCaloriesBurned", windowStart);
  const dailyActivity = aggregateDaily(
    stepRecs,
    energyRecs,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => (typeof s?.count === "number" ? s.count : null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => (typeof s?.energy?.inKilocalories === "number" ? s.energy.inKilocalories : null)
  );

  return { samples, dailyActivity };
}

async function readRecordsAndroid(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  m: any,
  recordType: string,
  startTimeISO: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    const res = await m.readRecords(recordType, {
      timeRangeFilter: { operator: "after", startTime: startTimeISO },
    });
    return res?.records ?? [];
  } catch (e) {
    console.warn(`[health] Android readRecords failed for ${recordType}`, e);
    return [];
  }
}
