import { CheckCircle, Plus, BarChart3, TrendingUp } from "lucide-react";
import { completeOnboarding } from "../actions";

export default function OnboardingReadyPage() {
  return (
    <div className="space-y-6 text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-success" />

      <div>
        <h1 className="text-2xl font-bold">You&apos;re all set!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here are a few tips to get started:
        </p>
      </div>

      <div className="space-y-3 text-left text-sm">
        <div className="flex gap-3 rounded-lg border p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <Plus className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="font-medium">Tap + to log</p>
            <p className="text-xs text-muted-foreground">Meals, weight, glucose, or your GLP-1 dose</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Check Today daily</p>
            <p className="text-xs text-muted-foreground">See your numbers, medication reminders, and daily insights</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning-bg">
            <TrendingUp className="h-4 w-4 text-warning" />
          </div>
          <div>
            <p className="font-medium">Visit Trends weekly</p>
            <p className="text-xs text-muted-foreground">AI-powered patterns appear after a few days of data</p>
          </div>
        </div>
      </div>

      <form action={completeOnboarding}>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Dashboard
        </button>
      </form>
    </div>
  );
}
