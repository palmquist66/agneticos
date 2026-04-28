import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OnboardingReadyPage() {
  return (
    <div className="space-y-6 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />

      <div>
        <h1 className="text-2xl font-bold">You&apos;re all set!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here are a few tips to get started:
        </p>
      </div>

      <div className="space-y-2 text-left text-sm">
        <p>
          <strong>Tap +</strong> to log a meal, weight, or glucose reading
        </p>
        <p>
          <strong>Check Today</strong> for your daily medication reminder
        </p>
        <p>
          <strong>Visit Trends</strong> to see your patterns over time
        </p>
      </div>

      <Link href="/today" className={buttonVariants({ size: "lg", className: "w-full" })}>
        Go to Dashboard
      </Link>
    </div>
  );
}
