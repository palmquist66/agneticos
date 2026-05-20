import { getCurrentUser } from "@/lib/auth";
import { MedicationForm } from "./medication-form";

export const dynamic = "force-dynamic";

export default async function OnboardingMedicationPage() {
  const user = await getCurrentUser();

  return (
    <MedicationForm
      currentMed={user.glp1Med}
      currentDosage={user.glp1Dosage}
    />
  );
}
