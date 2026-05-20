import { getCurrentUser } from "@/lib/auth";
import {
  getGlp1Status,
  getTodayScheduledMeds,
  getTodayNumbers,
  getRecentActivity,
} from "@/lib/today-queries";
import { Glp1StatusCard } from "@/components/today/glp1-status-card";
import { MedicationCheckin } from "@/components/today/medication-checkin";
import { TodaysNumbers } from "@/components/today/todays-numbers";
import { PatternSpotlight } from "@/components/today/pattern-spotlight";
import { RecentActivity } from "@/components/today/recent-activity";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await getCurrentUser();

  const [glp1Status, scheduledMeds, numbers, recentActivity] =
    await Promise.all([
      getGlp1Status(user.id, user.glp1Med, user.glp1Dosage),
      getTodayScheduledMeds(user.id),
      getTodayNumbers(user.id, user.proteinTarget),
      getRecentActivity(user.id),
    ]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Today</h1>

      <div className="mt-6 space-y-4">
        {glp1Status && <Glp1StatusCard status={glp1Status} />}

        {scheduledMeds.length > 0 && (
          <MedicationCheckin meds={scheduledMeds} />
        )}

        <TodaysNumbers numbers={numbers} />

        <PatternSpotlight pattern={null} />

        <RecentActivity entries={recentActivity} />
      </div>
    </div>
  );
}
