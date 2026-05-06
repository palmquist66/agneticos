import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────

export type Glp1Status = {
  medName: string;
  dosage: string;
  dayOfCycle: number; // 1-7
  nextDoseDate: Date;
  isOverdue: boolean;
  lastDoseDate: Date;
};

export type ScheduledMed = {
  id: string;
  medName: string;
  dosage: string;
  taken: boolean;
  logId: string | null; // for toggling off
};

export type TodayNumbers = {
  weight: { value: number; delta: number | null; unit: string } | null;
  glucose: { value: number; context: string | null; unit: string } | null;
  protein: { value: number; target: number; unit: string } | null;
};

export type ActivityEntry = {
  id: string;
  type: "weight" | "glucose" | "food" | "medication" | "side_effect";
  summary: string;
  loggedAt: Date;
  data: Record<string, unknown>;
};

// ─── Helpers ────────────────────────────────────────────

function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ─── Queries ────────────────────────────────────────────

export async function getGlp1Status(
  userId: string,
  glp1Med: string | null,
  glp1Dosage: string | null
): Promise<Glp1Status | null> {
  if (!glp1Med || !glp1Dosage) return null;

  const lastDose = await db.medicationLog.findFirst({
    where: { userId, medName: glp1Med },
    orderBy: { loggedAt: "desc" },
    select: { loggedAt: true },
  });

  if (!lastDose) return null;

  const msSinceDose = Date.now() - lastDose.loggedAt.getTime();
  const daysSinceDose = msSinceDose / (1000 * 60 * 60 * 24);
  const dayOfCycle = Math.min(Math.ceil(daysSinceDose), 7);
  const nextDoseDate = new Date(
    lastDose.loggedAt.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const isOverdue = daysSinceDose > 7;

  return {
    medName: glp1Med,
    dosage: glp1Dosage,
    dayOfCycle: dayOfCycle < 1 ? 1 : dayOfCycle,
    nextDoseDate,
    isOverdue,
    lastDoseDate: lastDose.loggedAt,
  };
}

export async function getTodayScheduledMeds(
  userId: string
): Promise<ScheduledMed[]> {
  const schedules = await db.medicationSchedule.findMany({
    where: { userId, active: true, isGlp1: false },
  });

  if (schedules.length === 0) return [];

  const today = new Date();
  const dayName = today
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // Filter to schedules that apply today
  const todaySchedules = schedules.filter((s) => {
    if (s.frequency === "daily") return true;
    if (s.frequency === "specific_days" || s.frequency === "weekly") {
      return s.days.includes(dayName);
    }
    return false;
  });

  if (todaySchedules.length === 0) return [];

  // Check which have been taken today
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  const todayLogs = await db.medicationLog.findMany({
    where: {
      userId,
      scheduleId: { in: todaySchedules.map((s) => s.id) },
      loggedAt: { gte: todayStart, lte: todayEnd },
      status: "taken",
    },
    select: { id: true, scheduleId: true },
  });

  const logBySchedule = new Map(
    todayLogs.map((l) => [l.scheduleId, l.id])
  );

  return todaySchedules.map((s) => ({
    id: s.id,
    medName: s.medName,
    dosage: s.dosage,
    taken: logBySchedule.has(s.id),
    logId: logBySchedule.get(s.id) ?? null,
  }));
}

export async function getTodayNumbers(
  userId: string,
  proteinTarget: number | null
): Promise<TodayNumbers> {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  const [latestWeight, previousWeight, latestGlucose, foodLogs] =
    await Promise.all([
      db.weightLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: "desc" },
        select: { weight: true },
      }),
      db.weightLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: "desc" },
        skip: 1,
        select: { weight: true },
      }),
      db.glucoseLog.findFirst({
        where: {
          userId,
          loggedAt: { gte: todayStart, lte: todayEnd },
        },
        orderBy: { loggedAt: "desc" },
        select: { value: true, context: true },
      }),
      db.foodLog.findMany({
        where: {
          userId,
          loggedAt: { gte: todayStart, lte: todayEnd },
        },
        select: { protein: true },
      }),
    ]);

  const totalProtein = foodLogs.reduce(
    (sum, f) => sum + (f.protein ?? 0),
    0
  );

  return {
    weight: latestWeight
      ? {
          value: latestWeight.weight,
          delta:
            previousWeight
              ? parseFloat(
                  (latestWeight.weight - previousWeight.weight).toFixed(1)
                )
              : null,
          unit: "lbs",
        }
      : null,
    glucose: latestGlucose
      ? {
          value: latestGlucose.value,
          context: latestGlucose.context,
          unit: "mg/dL",
        }
      : null,
    protein:
      totalProtein > 0 || (proteinTarget && proteinTarget > 0)
        ? {
            value: Math.round(totalProtein),
            target: proteinTarget ?? 100,
            unit: "g",
          }
        : null,
  };
}

export async function getRecentActivity(
  userId: string
): Promise<ActivityEntry[]> {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();
  const dateFilter = { gte: todayStart, lte: todayEnd };

  const [weights, glucoses, foods, meds, sideEffects] = await Promise.all([
    db.weightLog.findMany({
      where: { userId, loggedAt: dateFilter },
      orderBy: { loggedAt: "desc" },
      select: {
        id: true,
        weight: true,
        notes: true,
        loggedAt: true,
      },
      take: 10,
    }),
    db.glucoseLog.findMany({
      where: { userId, loggedAt: dateFilter },
      orderBy: { loggedAt: "desc" },
      select: {
        id: true,
        value: true,
        context: true,
        notes: true,
        loggedAt: true,
      },
      take: 10,
    }),
    db.foodLog.findMany({
      where: { userId, loggedAt: dateFilter },
      orderBy: { loggedAt: "desc" },
      select: {
        id: true,
        name: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        notes: true,
        loggedAt: true,
      },
      take: 10,
    }),
    db.medicationLog.findMany({
      where: { userId, loggedAt: dateFilter, status: "taken" },
      orderBy: { loggedAt: "desc" },
      select: {
        id: true,
        medName: true,
        dosage: true,
        notes: true,
        loggedAt: true,
      },
      take: 10,
    }),
    db.sideEffect.findMany({
      where: { userId, loggedAt: dateFilter },
      orderBy: { loggedAt: "desc" },
      select: {
        id: true,
        symptom: true,
        severity: true,
        notes: true,
        loggedAt: true,
      },
      take: 10,
    }),
  ]);

  const entries: ActivityEntry[] = [
    ...weights.map(
      (w): ActivityEntry => ({
        id: w.id,
        type: "weight",
        summary: `${w.weight} lbs`,
        loggedAt: w.loggedAt,
        data: { weight: w.weight, notes: w.notes },
      })
    ),
    ...glucoses.map(
      (g): ActivityEntry => ({
        id: g.id,
        type: "glucose",
        summary: `${g.value} mg/dL${g.context ? ` (${g.context.replace(/_/g, " ")})` : ""}`,
        loggedAt: g.loggedAt,
        data: { value: g.value, context: g.context, notes: g.notes },
      })
    ),
    ...foods.map(
      (f): ActivityEntry => ({
        id: f.id,
        type: "food",
        summary: f.name,
        loggedAt: f.loggedAt,
        data: {
          name: f.name,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fat: f.fat,
          notes: f.notes,
        },
      })
    ),
    ...meds.map(
      (m): ActivityEntry => ({
        id: m.id,
        type: "medication",
        summary: `${m.medName} ${m.dosage}`,
        loggedAt: m.loggedAt,
        data: { medName: m.medName, dosage: m.dosage, notes: m.notes },
      })
    ),
    ...sideEffects.map(
      (s): ActivityEntry => ({
        id: s.id,
        type: "side_effect",
        summary: `${s.symptom.replace(/_/g, " ")} (${s.severity})`,
        loggedAt: s.loggedAt,
        data: { symptom: s.symptom, severity: s.severity, notes: s.notes },
      })
    ),
  ];

  return entries.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime()).slice(0, 5);
}
