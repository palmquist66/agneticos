import { getCurrentUser } from "@/lib/auth";
import { GoalsForm } from "./goals-form";

export const dynamic = "force-dynamic";

export default async function OnboardingGoalsPage() {
  const user = await getCurrentUser();

  return (
    <GoalsForm
      currentGoalWeight={user.goalWeight}
      currentProteinTarget={user.proteinTarget}
      currentGlucoseMin={user.glucoseMin}
      currentGlucoseMax={user.glucoseMax}
    />
  );
}
