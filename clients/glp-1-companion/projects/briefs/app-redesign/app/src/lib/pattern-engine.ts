import type { Pattern } from "@/lib/types/trends";

// ─── Input Types ────────────────────────────────────────

type WeightEntry = { weight: number; loggedAt: Date };
type MedEntry = { medName: string; dosage: string; loggedAt: Date };
type SideEffectEntry = { symptom: string; severity: string; loggedAt: Date };
type FoodEntry = { protein: number | null; loggedAt: Date };

type PatternInput = {
  weights: WeightEntry[];
  medications: MedEntry[];
  sideEffects: SideEffectEntry[];
  foods: FoodEntry[];
  glp1Med: string | null;
  proteinTarget: number | null;
};

// ─── Helpers ────────────────────────────────────────────

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

// ─── Pattern 1: Weight ↔ Dose ──────────────────────────
// Find dose changes, compare 7-day avg weight before vs after

function detectWeightDose(input: PatternInput): Pattern | null {
  const { weights, medications, glp1Med } = input;
  if (!glp1Med || weights.length < 7) return null;

  // Filter to GLP-1 medication logs only
  const glp1Logs = medications.filter(
    (m) => m.medName.toLowerCase() === glp1Med.toLowerCase()
  );
  if (glp1Logs.length < 2) return null;

  // Find dose changes (different dosage string)
  const doseChanges: { date: Date; from: string; to: string }[] = [];
  for (let i = 1; i < glp1Logs.length; i++) {
    if (glp1Logs[i].dosage !== glp1Logs[i - 1].dosage) {
      doseChanges.push({
        date: glp1Logs[i].loggedAt,
        from: glp1Logs[i - 1].dosage,
        to: glp1Logs[i].dosage,
      });
    }
  }

  if (doseChanges.length === 0) {
    // No dose changes — check overall trend on current dose
    const firstDose = glp1Logs[0].loggedAt;
    const weightsBefore = weights.filter(
      (w) => w.loggedAt < firstDose
    );
    const weightsAfter = weights.filter(
      (w) => w.loggedAt >= firstDose
    );

    if (weightsBefore.length >= 3 && weightsAfter.length >= 7) {
      const avgBefore =
        weightsBefore.reduce((s, w) => s + w.weight, 0) / weightsBefore.length;
      const last7 = weightsAfter.slice(-7);
      const avgAfter =
        last7.reduce((s, w) => s + w.weight, 0) / last7.length;
      const delta = avgBefore - avgAfter;

      if (delta > 1) {
        return {
          type: "weight_dose",
          title: "Weight responding to medication",
          summary: `You've lost ${delta.toFixed(1)} lbs since starting ${glp1Med}.`,
          detail: `Average weight before ${glp1Med}: ${avgBefore.toFixed(1)} lbs. Current 7-day average: ${avgAfter.toFixed(1)} lbs. That's a ${delta.toFixed(1)} lb decrease.`,
          confidence: weightsAfter.length >= 14 ? "high" : "medium",
          dataPoints: weightsBefore.length + weightsAfter.length,
        };
      }
    }
    return null;
  }

  // Use the most recent dose change
  const latest = doseChanges[doseChanges.length - 1];
  const weightsBefore = weights.filter(
    (w) =>
      w.loggedAt < latest.date &&
      daysBetween(w.loggedAt, latest.date) <= 14
  );
  const weightsAfter = weights.filter(
    (w) =>
      w.loggedAt >= latest.date &&
      daysBetween(w.loggedAt, latest.date) <= 14
  );

  if (weightsBefore.length < 3 || weightsAfter.length < 3) return null;

  const avgBefore =
    weightsBefore.reduce((s, w) => s + w.weight, 0) / weightsBefore.length;
  const avgAfter =
    weightsAfter.reduce((s, w) => s + w.weight, 0) / weightsAfter.length;

  const weeklyBefore =
    weightsBefore.length >= 2
      ? ((weightsBefore[0].weight - weightsBefore[weightsBefore.length - 1].weight) /
          daysBetween(weightsBefore[0].loggedAt, weightsBefore[weightsBefore.length - 1].loggedAt)) *
        7
      : 0;
  const weeklyAfter =
    weightsAfter.length >= 2
      ? ((weightsAfter[0].weight - weightsAfter[weightsAfter.length - 1].weight) /
          daysBetween(weightsAfter[0].loggedAt, weightsAfter[weightsAfter.length - 1].loggedAt)) *
        7
      : 0;

  const acceleration = weeklyAfter - weeklyBefore;

  if (Math.abs(avgAfter - avgBefore) > 0.5 || Math.abs(acceleration) > 0.5) {
    const direction = avgAfter < avgBefore ? "accelerated" : "slowed";
    return {
      type: "weight_dose",
      title: `Weight loss ${direction} after dose change`,
      summary: `After switching from ${latest.from} to ${latest.to}, your weight loss ${direction}.`,
      detail: `7-day avg before: ${avgBefore.toFixed(1)} lbs. After: ${avgAfter.toFixed(1)} lbs. Weekly rate changed from ${Math.abs(weeklyBefore).toFixed(1)} to ${Math.abs(weeklyAfter).toFixed(1)} lbs/week.`,
      confidence: weightsAfter.length >= 7 ? "high" : "medium",
      dataPoints: weightsBefore.length + weightsAfter.length,
    };
  }

  return null;
}

// ─── Pattern 2: Side Effects ↔ Dose Timing ─────────────
// Histogram side effects by day-of-cycle (0-6 after injection)

function detectSideEffectsDose(input: PatternInput): Pattern | null {
  const { medications, sideEffects, glp1Med } = input;
  if (!glp1Med || sideEffects.length < 3) return null;

  const glp1Logs = medications
    .filter((m) => m.medName.toLowerCase() === glp1Med.toLowerCase())
    .sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());

  if (glp1Logs.length < 3) return null;

  // For each side effect, find which day of the injection cycle it occurred
  const dayHistogram: number[] = [0, 0, 0, 0, 0, 0, 0]; // days 0-6

  for (const se of sideEffects) {
    // Find the most recent injection before this side effect
    const priorInjection = glp1Logs
      .filter((m) => m.loggedAt <= se.loggedAt)
      .pop();

    if (!priorInjection) continue;

    const daysAfter = Math.floor(
      daysBetween(se.loggedAt, priorInjection.loggedAt)
    );
    if (daysAfter >= 0 && daysAfter < 7) {
      dayHistogram[daysAfter]++;
    }
  }

  const total = dayHistogram.reduce((s, v) => s + v, 0);
  if (total < 3) return null;

  // Find peak day
  const peakCount = Math.max(...dayHistogram);
  const peakDay = dayHistogram.indexOf(peakCount);
  const avgOthers =
    (total - peakCount) / Math.max(dayHistogram.filter((v) => v > 0).length - 1, 1);

  // Peak day needs to be 2x+ the average of other days
  if (peakCount < 2 || peakCount < avgOthers * 2) return null;

  const dayLabel = peakDay === 0 ? "injection day" : `day ${peakDay} after injection`;
  const topSymptoms = getTopSymptoms(sideEffects, glp1Logs, peakDay);

  return {
    type: "side_effects_dose",
    title: "Side effect pattern detected",
    summary: `Most side effects occur on ${dayLabel}.`,
    detail: `${peakCount} of ${total} reported side effects happen on ${dayLabel}. ${topSymptoms ? `Most common: ${topSymptoms}.` : ""} This pattern is based on ${glp1Logs.length} injection cycles.`,
    confidence: glp1Logs.length >= 6 ? "high" : "medium",
    dataPoints: total,
  };
}

function getTopSymptoms(
  sideEffects: SideEffectEntry[],
  glp1Logs: MedEntry[],
  peakDay: number
): string {
  const counts = new Map<string, number>();

  for (const se of sideEffects) {
    const prior = glp1Logs.filter((m) => m.loggedAt <= se.loggedAt).pop();
    if (!prior) continue;
    const d = Math.floor(daysBetween(se.loggedAt, prior.loggedAt));
    if (d === peakDay) {
      const symptom = se.symptom.replace(/_/g, " ");
      counts.set(symptom, (counts.get(symptom) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([s]) => s)
    .join(" and ");
}

// ─── Pattern 3: Protein ↔ Weight ────────────────────────
// Compare weight change on high-protein vs low-protein weeks

function detectProteinWeight(input: PatternInput): Pattern | null {
  const { weights, foods, proteinTarget } = input;
  const target = proteinTarget ?? 100;

  if (foods.length < 14 || weights.length < 14) return null;

  // Group food by date and sum protein
  const proteinByDate = new Map<string, number>();
  for (const f of foods) {
    const key = toDateKey(f.loggedAt);
    proteinByDate.set(key, (proteinByDate.get(key) ?? 0) + (f.protein ?? 0));
  }

  // Group weight by date (latest per day)
  const weightByDate = new Map<string, number>();
  for (const w of weights) {
    const key = toDateKey(w.loggedAt);
    weightByDate.set(key, w.weight);
  }

  // Get dates that have both protein and weight data
  const dates = Array.from(proteinByDate.keys())
    .filter((d) => weightByDate.has(d))
    .sort();

  if (dates.length < 14) return null;

  // Split into high-protein and low-protein days
  const highDays: { date: string; weight: number }[] = [];
  const lowDays: { date: string; weight: number }[] = [];

  for (const date of dates) {
    const protein = proteinByDate.get(date)!;
    const weight = weightByDate.get(date)!;

    if (protein >= target) {
      highDays.push({ date, weight });
    } else {
      lowDays.push({ date, weight });
    }
  }

  if (highDays.length < 5 || lowDays.length < 5) return null;

  // Compare weekly weight change for each group
  const highChange = computeWeeklyChange(highDays);
  const lowChange = computeWeeklyChange(lowDays);

  if (highChange === null || lowChange === null) return null;

  const diff = lowChange - highChange; // positive means high protein = better loss

  if (Math.abs(diff) < 0.3) return null; // not meaningful

  if (diff > 0) {
    return {
      type: "protein_weight",
      title: "Protein intake supports weight loss",
      summary: `High-protein days correlate with ${diff.toFixed(1)} lbs/week more weight loss.`,
      detail: `On days you hit your ${target}g protein target, your weekly weight trend is ${Math.abs(highChange).toFixed(1)} lbs/week loss vs ${Math.abs(lowChange).toFixed(1)} lbs/week on low-protein days. Based on ${highDays.length} high and ${lowDays.length} low protein days.`,
      confidence: dates.length >= 30 ? "high" : "medium",
      dataPoints: dates.length,
    };
  }

  return null;
}

function computeWeeklyChange(
  days: { date: string; weight: number }[]
): number | null {
  if (days.length < 3) return null;
  const first = days.slice(0, 3);
  const last = days.slice(-3);
  const avgFirst = first.reduce((s, d) => s + d.weight, 0) / first.length;
  const avgLast = last.reduce((s, d) => s + d.weight, 0) / last.length;
  const spanDays =
    (new Date(last[last.length - 1].date).getTime() -
      new Date(first[0].date).getTime()) /
    (1000 * 60 * 60 * 24);
  if (spanDays < 7) return null;
  return ((avgLast - avgFirst) / spanDays) * 7;
}

// ─── Main Detector ──────────────────────────────────────

export function detectPatterns(input: PatternInput): Pattern[] {
  const patterns: Pattern[] = [];

  const weightDose = detectWeightDose(input);
  if (weightDose) patterns.push(weightDose);

  const sideEffectsDose = detectSideEffectsDose(input);
  if (sideEffectsDose) patterns.push(sideEffectsDose);

  const proteinWeight = detectProteinWeight(input);
  if (proteinWeight) patterns.push(proteinWeight);

  // Sort by confidence (high first)
  const order = { high: 0, medium: 1, low: 2 };
  patterns.sort((a, b) => order[a.confidence] - order[b.confidence]);

  return patterns;
}
