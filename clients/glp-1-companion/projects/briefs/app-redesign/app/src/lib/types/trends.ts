// ─── Time Range ──────────────────────────────────────────
export type TimeRange = "7d" | "14d" | "30d" | "60d" | "90d";

export const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  "7d": 7,
  "14d": 14,
  "30d": 30,
  "60d": 60,
  "90d": 90,
};

// ─── Chart Data Points ──────────────────────────────────
export type WeightDataPoint = {
  date: string; // YYYY-MM-DD
  weight: number;
  movingAvg: number | null; // 7-day moving average
};

export type GlucoseDataPoint = {
  date: string; // ISO datetime
  value: number;
  context: string | null;
};

export type GlucoseStats = {
  avg: number;
  min: number;
  max: number;
  inRange: number; // percentage within target band
  count: number;
};

export type ActivityDataPoint = {
  date: string; // YYYY-MM-DD
  steps: number | null;
  activeEnergyKcal: number | null;
};

// ─── Patterns ───────────────────────────────────────────
export type PatternType = "weight_dose" | "side_effects_dose" | "protein_weight";

export type Pattern = {
  type: PatternType;
  title: string;
  summary: string;
  detail: string;
  confidence: "low" | "medium" | "high";
  dataPoints: number; // how many data points informed this
};

// ─── AI Chat ────────────────────────────────────────────
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
