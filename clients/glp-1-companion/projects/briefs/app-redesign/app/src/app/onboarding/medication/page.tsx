import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function OnboardingMedicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What GLP-1 are you taking?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us personalize your tracking experience.
        </p>
      </div>

      <div className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
        Medication picker coming in Phase 6
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/onboarding/goals"
          className="text-sm text-muted-foreground hover:underline"
        >
          Skip for now
        </Link>
        <Link href="/onboarding/goals" className={buttonVariants()}>
          Next
        </Link>
      </div>
    </div>
  );
}
