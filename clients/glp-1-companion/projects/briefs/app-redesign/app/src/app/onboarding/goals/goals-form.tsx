"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Target, Drumstick, Activity } from "lucide-react";
import { saveOnboardingGoals } from "../actions";

interface GoalsFormProps {
  currentGoalWeight: number | null;
  currentProteinTarget: number | null;
  currentGlucoseMin: number | null;
  currentGlucoseMax: number | null;
}

export function GoalsForm({
  currentGoalWeight,
  currentProteinTarget,
  currentGlucoseMin,
  currentGlucoseMax,
}: GoalsFormProps) {
  const router = useRouter();
  const [goalWeight, setGoalWeight] = useState(currentGoalWeight?.toString() || "");
  const [proteinTarget, setProteinTarget] = useState(currentProteinTarget?.toString() || "100");
  const [glucoseMin, setGlucoseMin] = useState(currentGlucoseMin?.toString() || "70");
  const [glucoseMax, setGlucoseMax] = useState(currentGlucoseMax?.toString() || "180");

  const [state, action, pending] = useActionState(saveOnboardingGoals, { success: false });

  useEffect(() => {
    if (state.success) {
      router.push("/onboarding/connect");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What are you working toward?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set targets so we can show you meaningful progress.
        </p>
      </div>

      <form action={action} className="space-y-5">
        <input type="hidden" name="goalWeight" value={goalWeight} />
        <input type="hidden" name="proteinTarget" value={proteinTarget} />
        <input type="hidden" name="glucoseMin" value={glucoseMin} />
        <input type="hidden" name="glucoseMax" value={glucoseMax} />

        {/* Goal Weight */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Goal Weight</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter goal weight"
              min={50}
              max={500}
              step={0.1}
            />
            <span className="text-sm text-muted-foreground shrink-0">lbs</span>
          </div>
        </div>

        {/* Protein Target */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Drumstick className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Daily Protein Target</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={proteinTarget}
              onChange={(e) => setProteinTarget(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="100"
              min={20}
              max={500}
            />
            <span className="text-sm text-muted-foreground shrink-0">g/day</span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Most GLP-1 users aim for 80–120g to preserve muscle mass
          </p>
        </div>

        {/* Glucose Range */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Glucose Range</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Min (mg/dL)</label>
              <input
                type="number"
                value={glucoseMin}
                onChange={(e) => setGlucoseMin(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="70"
                min={40}
                max={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-muted-foreground">Max (mg/dL)</label>
              <input
                type="number"
                value={glucoseMax}
                onChange={(e) => setGlucoseMax(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="180"
                min={100}
                max={400}
              />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Standard range is 70–180 mg/dL. Ask your doctor about your specific target.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push("/onboarding/connect")}
            className="text-sm text-muted-foreground hover:underline"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
