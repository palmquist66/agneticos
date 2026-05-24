import { db } from "@/lib/db";

/**
 * Native health import (Apple Health / Android Health Connect).
 *
 * Mirrors the Dexcom sync pattern (lib/dexcom.ts): writes logs with a
 * `source` tag, dedups via the composite unique constraints, updates the
 * DataSourceConnection row, and records a SyncLog entry.
 *
 * Contract: the mobile client canonicalizes units before POSTing —
 * weight in lbs, glucose in mg/dL — and aggregates steps/active-energy to
 * per-day totals. We validate ranges here and silently skip out-of-range
 * or malformed samples rather than failing the whole batch.
 */

export type HealthSource = "apple_health" | "health_connect";

export interface HealthSample {
  type: "weight" | "glucose";
  value: number;
  recordedAt: string;
  sampleId?: string;
  context?: string | null;
}

export interface DailyActivityTotals {
  date: string;
  steps?: number;
  activeEnergyKcal?: number;
}

export interface HealthImportInput {
  samples?: HealthSample[];
  dailyActivity?: DailyActivityTotals[];
}

export interface HealthImportResult {
  imported: { weight: number; glucose: number; activity: number };
  skipped: { weight: number; glucose: number };
  dateFrom: Date | null;
  dateTo: Date | null;
  durationMs: number;
}

// Validation ranges match the manual log routes (api/log/weight, api/log/glucose).
const WEIGHT_MIN = 50;
const WEIGHT_MAX = 500; // lbs
const GLUCOSE_MIN = 40;
const GLUCOSE_MAX = 600; // mg/dL

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function importHealthData(
  userId: string,
  source: HealthSource,
  input: HealthImportInput
): Promise<HealthImportResult> {
  const startTime = Date.now();
  const samples = input.samples ?? [];
  const dailyActivity = input.dailyActivity ?? [];

  let dateFrom: Date | null = null;
  let dateTo: Date | null = null;
  const trackDate = (d: Date) => {
    if (!dateFrom || d < dateFrom) dateFrom = d;
    if (!dateTo || d > dateTo) dateTo = d;
  };

  // ── Weight + glucose point samples ──────────────────────────
  const weightRows: {
    userId: string;
    weight: number;
    source: string;
    loggedAt: Date;
    metadata?: { sampleId: string };
  }[] = [];
  const glucoseRows: {
    userId: string;
    value: number;
    context: string | null;
    source: string;
    loggedAt: Date;
    metadata?: { sampleId: string };
  }[] = [];

  let weightInvalid = 0;
  let glucoseInvalid = 0;

  for (const s of samples) {
    const loggedAt = new Date(s.recordedAt);
    const valid =
      !isNaN(loggedAt.getTime()) && typeof s.value === "number" && isFinite(s.value);

    if (s.type === "weight") {
      if (!valid || s.value < WEIGHT_MIN || s.value > WEIGHT_MAX) {
        weightInvalid++;
        continue;
      }
      trackDate(loggedAt);
      weightRows.push({
        userId,
        weight: s.value,
        source,
        loggedAt,
        metadata: s.sampleId ? { sampleId: s.sampleId } : undefined,
      });
    } else if (s.type === "glucose") {
      if (!valid || s.value < GLUCOSE_MIN || s.value > GLUCOSE_MAX) {
        glucoseInvalid++;
        continue;
      }
      trackDate(loggedAt);
      glucoseRows.push({
        userId,
        value: s.value,
        context: s.context ?? null,
        source,
        loggedAt,
        metadata: s.sampleId ? { sampleId: s.sampleId } : undefined,
      });
    }
  }

  // createMany + skipDuplicates dedups on @@unique([userId, loggedAt, source]),
  // covering both already-synced rows and in-batch duplicates.
  const weightCreated = weightRows.length
    ? (await db.weightLog.createMany({ data: weightRows, skipDuplicates: true })).count
    : 0;
  const glucoseCreated = glucoseRows.length
    ? (await db.glucoseLog.createMany({ data: glucoseRows, skipDuplicates: true })).count
    : 0;

  // "skipped" = out-of-range/malformed + already-present duplicates.
  const weightSkipped = weightInvalid + (weightRows.length - weightCreated);
  const glucoseSkipped = glucoseInvalid + (glucoseRows.length - glucoseCreated);

  // ── Daily activity totals (steps, active energy) ────────────
  let activityImported = 0;
  for (const a of dailyActivity) {
    const day = startOfUtcDay(new Date(a.date));
    if (isNaN(day.getTime())) continue;

    const steps = typeof a.steps === "number" && isFinite(a.steps) ? Math.round(a.steps) : null;
    const energy =
      typeof a.activeEnergyKcal === "number" && isFinite(a.activeEnergyKcal)
        ? a.activeEnergyKcal
        : null;
    if (steps === null && energy === null) continue;

    await db.activityLog.upsert({
      where: { userId_date_source: { userId, date: day, source } },
      create: { userId, date: day, source, steps, activeEnergyKcal: energy },
      update: {
        steps: steps ?? undefined,
        activeEnergyKcal: energy ?? undefined,
      },
    });
    activityImported++;
    trackDate(day);
  }

  const durationMs = Date.now() - startTime;
  const totalRecords = weightCreated + glucoseCreated + activityImported;
  const now = new Date();

  // ── Connection status + audit log ──────────────────────────
  await db.dataSourceConnection.upsert({
    where: { userId_source: { userId, source } },
    create: {
      userId,
      source,
      status: "connected",
      lastSyncAt: now,
      lastSyncStatus: "success",
      lastSyncRecords: totalRecords,
    },
    update: {
      status: "connected",
      lastSyncAt: now,
      lastSyncStatus: "success",
      lastSyncRecords: totalRecords,
      lastSyncError: null,
    },
  });

  await db.syncLog.create({
    data: {
      userId,
      source,
      action: "pull",
      status: "success",
      recordCount: totalRecords,
      dateFrom,
      dateTo,
      durationMs,
    },
  });

  return {
    imported: { weight: weightCreated, glucose: glucoseCreated, activity: activityImported },
    skipped: { weight: weightSkipped, glucose: glucoseSkipped },
    dateFrom,
    dateTo,
    durationMs,
  };
}
