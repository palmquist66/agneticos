import { db } from "@/lib/db";
import type {
  TimeRange,
  WeightDataPoint,
  GlucoseDataPoint,
  GlucoseStats,
  ActivityDataPoint,
  TIME_RANGE_DAYS,
} from "@/lib/types/trends";

// Re-export for convenience
export { TIME_RANGE_DAYS } from "@/lib/types/trends";

// ─── Helpers ────────────────────────────────────────────

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ─── Weight Data ────────────────────────────────────────

export async function getWeightTrend(
  userId: string,
  days: number
): Promise<WeightDataPoint[]> {
  const since = daysAgo(days);

  const logs = await db.weightLog.findMany({
    where: { userId, loggedAt: { gte: since } },
    orderBy: { loggedAt: "asc" },
    select: { weight: true, loggedAt: true },
    take: 90,
  });

  if (logs.length === 0) return [];

  // Group by date, take latest per day
  const byDate = new Map<string, number>();
  for (const log of logs) {
    const key = toDateKey(log.loggedAt);
    byDate.set(key, log.weight); // last write wins (ordered asc)
  }

  const sorted = Array.from(byDate.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  // Calculate 7-day moving average
  const points: WeightDataPoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const [date, weight] = sorted[i];
    let movingAvg: number | null = null;

    if (i >= 6) {
      const window = sorted.slice(i - 6, i + 1);
      const sum = window.reduce((s, [, w]) => s + w, 0);
      movingAvg = parseFloat((sum / 7).toFixed(1));
    }

    points.push({ date, weight, movingAvg });
  }

  return points;
}

// ─── Glucose Data ───────────────────────────────────────

export async function getGlucoseTrend(
  userId: string,
  days: number
): Promise<GlucoseDataPoint[]> {
  const since = daysAgo(days);

  const logs = await db.glucoseLog.findMany({
    where: { userId, loggedAt: { gte: since } },
    orderBy: { loggedAt: "asc" },
    select: { value: true, context: true, loggedAt: true },
    take: 100,
  });

  return logs.map((l) => ({
    date: l.loggedAt.toISOString(),
    value: l.value,
    context: l.context,
  }));
}

export function computeGlucoseStats(
  points: GlucoseDataPoint[],
  min: number,
  max: number
): GlucoseStats | null {
  if (points.length === 0) return null;

  const values = points.map((p) => p.value);
  const inRange = values.filter((v) => v >= min && v <= max).length;

  return {
    avg: parseFloat((values.reduce((s, v) => s + v, 0) / values.length).toFixed(0)),
    min: Math.min(...values),
    max: Math.max(...values),
    inRange: parseFloat(((inRange / values.length) * 100).toFixed(0)),
    count: values.length,
  };
}

// ─── Raw Pattern Data ───────────────────────────────────
// Fetches broader data windows for the pattern engine

// ─── Activity Data (steps, active energy) ───────────────

export async function getActivityTrend(
  userId: string,
  days: number
): Promise<ActivityDataPoint[]> {
  const since = daysAgo(days);

  const logs = await db.activityLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
    select: { date: true, steps: true, activeEnergyKcal: true },
    take: 90,
  });

  if (logs.length === 0) return [];

  // A day may have rows from more than one source (rare — usually one
  // device). Take the max per metric per day to avoid double-counting.
  const byDate = new Map<string, { steps: number | null; energy: number | null }>();
  for (const log of logs) {
    const key = toDateKey(log.date);
    const cur = byDate.get(key) ?? { steps: null, energy: null };
    if (log.steps != null) cur.steps = Math.max(cur.steps ?? 0, log.steps);
    if (log.activeEnergyKcal != null)
      cur.energy = Math.max(cur.energy ?? 0, log.activeEnergyKcal);
    byDate.set(key, cur);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      steps: v.steps,
      activeEnergyKcal: v.energy == null ? null : parseFloat(v.energy.toFixed(1)),
    }));
}

export async function getPatternData(userId: string) {
  const since90 = daysAgo(90);

  const [weights, medications, sideEffects, foods] = await Promise.all([
    db.weightLog.findMany({
      where: { userId, loggedAt: { gte: since90 } },
      orderBy: { loggedAt: "asc" },
      select: { weight: true, loggedAt: true },
      take: 90,
    }),
    db.medicationLog.findMany({
      where: {
        userId,
        status: "taken",
        loggedAt: { gte: since90 },
      },
      orderBy: { loggedAt: "asc" },
      select: { medName: true, dosage: true, loggedAt: true },
      take: 50,
    }),
    db.sideEffect.findMany({
      where: { userId, loggedAt: { gte: since90 } },
      orderBy: { loggedAt: "asc" },
      select: { symptom: true, severity: true, loggedAt: true },
      take: 50,
    }),
    db.foodLog.findMany({
      where: { userId, loggedAt: { gte: since90 } },
      orderBy: { loggedAt: "asc" },
      select: { protein: true, loggedAt: true },
      take: 90,
    }),
  ]);

  return { weights, medications, sideEffects, foods };
}

// ─── AI Context Builder ─────────────────────────────────
// 14-day summary for injecting into AI chat system prompt

export async function getAIContextData(userId: string) {
  const since14 = daysAgo(14);

  const [weights, glucoses, foods, meds, sideEffects, user] =
    await Promise.all([
      db.weightLog.findMany({
        where: { userId, loggedAt: { gte: since14 } },
        orderBy: { loggedAt: "desc" },
        select: { weight: true, loggedAt: true },
        take: 14,
      }),
      db.glucoseLog.findMany({
        where: { userId, loggedAt: { gte: since14 } },
        orderBy: { loggedAt: "desc" },
        select: { value: true, context: true, loggedAt: true },
        take: 20,
      }),
      db.foodLog.findMany({
        where: { userId, loggedAt: { gte: since14 } },
        orderBy: { loggedAt: "desc" },
        select: {
          name: true,
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
          loggedAt: true,
        },
        take: 20,
      }),
      db.medicationLog.findMany({
        where: { userId, status: "taken", loggedAt: { gte: since14 } },
        orderBy: { loggedAt: "desc" },
        select: { medName: true, dosage: true, loggedAt: true },
        take: 10,
      }),
      db.sideEffect.findMany({
        where: { userId, loggedAt: { gte: since14 } },
        orderBy: { loggedAt: "desc" },
        select: { symptom: true, severity: true, loggedAt: true },
        take: 10,
      }),
      db.user.findUnique({
        where: { id: userId },
        select: {
          glp1Med: true,
          glp1Dosage: true,
          goalWeight: true,
          proteinTarget: true,
          glucoseMin: true,
          glucoseMax: true,
        },
      }),
    ]);

  return { weights, glucoses, foods, meds, sideEffects, user };
}
