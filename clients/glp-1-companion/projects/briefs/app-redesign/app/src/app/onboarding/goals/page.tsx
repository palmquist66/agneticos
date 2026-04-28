import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function OnboardingGoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What are you working toward?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set targets so we can show you meaningful progress.
        </p>
      </div>

      <div className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
        Goal inputs coming in Phase 6
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/onboarding/connect"
          className="text-sm text-muted-foreground hover:underline"
        >
          Skip for now
        </Link>
        <Link href="/onboarding/connect" className={buttonVariants()}>
          Next
        </Link>
      </div>
    </div>
  );
}
