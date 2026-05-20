// ─── Common ────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

// ─── User ──────────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  glp1Med: string | null;
  glp1Dosage: string | null;
  otherMeds: string[];
  goalWeight: number | null;
  proteinTarget: number | null;
  glucoseMin: number | null;
  glucoseMax: number | null;
  onboarded: boolean;
  createdAt: string;
}

// ─── Today Screen ──────────────────────────────────────────

export interface TodayResponse {
  glp1Status: Glp1Status;
  todaysNumbers: TodaysNumbers;
  scheduledMeds: ScheduledMed[];
  recentActivity: ActivityEntry[];
}

export interface Glp1Status {
  medication: string | null;
  dosage: string | null;
  lastDose: string | null;
  nextDoseDay: string | null;
  daysSinceLastDose: number | null;
  currentSite: string | null;
}

export interface TodaysNumbers {
  weight: { value: number | null; unit: string };
  glucose: { value: number | null; unit: string; context: string | null };
  calories: { value: number; unit: string };
  protein: { value: number; target: number | null; unit: string };
}

export interface ScheduledMed {
  scheduleId: string;
  medName: string;
  dosage: string;
  frequency: string;
  times: string[];
  taken: boolean;
  logId: string | null;
}

export interface ActivityEntry {
  id: string;
  type: "weight" | "glucose" | "food" | "medication" | "side_effect";
  title: string;
  subtitle: string | null;
  value: string | null;
  loggedAt: string;
}

// ─── Logging ───────────────────────────────────────────────

export interface LogWeightRequest {
  weight: number;
  notes?: string;
}

export interface LogGlucoseRequest {
  value: number;
  context: string;
  notes?: string;
}

export interface LogGlp1DoseRequest {
  site: string;
  notes?: string;
}

export interface LogSideEffectRequest {
  symptoms: string[];
  severity: string;
  notes?: string;
}

export interface LogFoodRequest {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType?: string;
  inputMethod: "photo" | "text" | "recipe";
  imageUrl?: string;
  servings?: number;
  notes?: string;
}

export interface LogResponse {
  success: boolean;
  error?: string;
}

// ─── Trends ────────────────────────────────────────────────

export type TimeRange = "7d" | "14d" | "30d" | "90d";

export interface TrendsResponse {
  weightData: WeightDataPoint[];
  glucoseData: GlucoseDataPoint[];
  glucoseStats: GlucoseStats;
  patterns: Pattern[];
}

export interface WeightDataPoint {
  date: string;
  weight: number;
  source: string;
}

export interface GlucoseDataPoint {
  date: string;
  value: number;
  context: string | null;
  source: string;
}

export interface GlucoseStats {
  average: number | null;
  min: number | null;
  max: number | null;
  inRange: number | null;
  timeInRange: number | null;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  category: string;
}

// ─── Medications ───────────────────────────────────────────

export interface MedicationSchedule {
  id: string;
  medName: string;
  dosage: string;
  frequency: string;
  days: string[];
  times: string[];
  isGlp1: boolean;
  active: boolean;
  createdAt: string;
}

export interface MedsListResponse {
  schedules: MedicationSchedule[];
  todaysLogs: MedicationLogEntry[];
}

export interface MedicationLogEntry {
  id: string;
  scheduleId: string | null;
  medName: string;
  dosage: string;
  status: string;
  notes: string | null;
  loggedAt: string;
}

export interface TitrationStep {
  id: string;
  medName: string;
  dosage: string;
  order: number;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface InjectionSiteEntry {
  id: string;
  site: string;
  loggedAt: string;
}

export interface MedsPageResponse {
  medications: MedicationSchedule[];
  titrationSteps: TitrationStep[];
  injectionSites: InjectionSiteEntry[];
}

export interface MedDetailResponse {
  schedule: MedicationSchedule;
  logs: MedicationLogEntry[];
  adherence: {
    rate: number;
    taken: number;
    missed: number;
    skipped: number;
    total: number;
  };
}

export interface AddMedicationRequest {
  medName: string;
  dosage: string;
  frequency: string;
  days?: string[];
  times?: string[];
  isGlp1?: boolean;
}

export interface UpdateMedicationRequest {
  dosage?: string;
  frequency?: string;
  days?: string[];
  times?: string[];
}

// ─── Onboarding ────────────────────────────────────────────

export interface OnboardingMedicationRequest {
  glp1Med: string;
  glp1Dosage: string;
  otherMeds?: string[];
}

export interface OnboardingGoalsRequest {
  goalWeight?: number;
  proteinTarget?: number;
  glucoseMin?: number;
  glucoseMax?: number;
}

// ─── HealthKit ─────────────────────────────────────────────

export interface HealthKitPushRequest {
  records: HealthKitRecord[];
}

export interface HealthKitRecord {
  type: "weight" | "glucose" | "steps" | "heart_rate" | "sleep";
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  sourceName: string;
  sourceId: string;
}

export interface HealthKitStatusResponse {
  lastSyncAt: string | null;
  recordCounts: Record<string, number>;
}

// ─── Device Tokens ─────────────────────────────────────────

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: "ios" | "android";
}

export interface RegisterDeviceTokenResponse {
  success: boolean;
  error?: string;
}
