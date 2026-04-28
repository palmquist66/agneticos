import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function OnboardingConnectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connect your data</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The more data you connect, the better your patterns.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border p-4">
          <p className="font-medium">Dexcom CGM</p>
          <p className="text-sm text-muted-foreground">
            Continuous glucose readings
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="font-medium">Google Fit</p>
          <p className="text-sm text-muted-foreground">Weight and activity</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="font-medium">Apple Health</p>
          <p className="text-sm text-muted-foreground">
            Available in the mobile app
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/onboarding/ready"
          className="text-sm text-muted-foreground hover:underline"
        >
          I&apos;ll enter data manually
        </Link>
        <Link href="/onboarding/ready" className={buttonVariants()}>
          Continue
        </Link>
      </div>
    </div>
  );
}
