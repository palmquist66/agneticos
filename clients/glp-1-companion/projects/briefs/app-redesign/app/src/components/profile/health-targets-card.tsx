"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";
import { updateHealthTargets } from "@/app/(app)/profile/actions";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";

interface HealthTargetsCardProps {
  goalWeight: number | null;
  proteinTarget: number | null;
  glucoseMin: number | null;
  glucoseMax: number | null;
}

export function HealthTargetsCard({
  goalWeight,
  proteinTarget,
  glucoseMin,
  glucoseMax,
}: HealthTargetsCardProps) {
  const [editing, setEditing] = useState(false);
  const [localGoalWeight, setLocalGoalWeight] = useState(goalWeight?.toString() || "");
  const [localProtein, setLocalProtein] = useState(proteinTarget?.toString() || "");
  const [localGlucoseMin, setLocalGlucoseMin] = useState(glucoseMin?.toString() || "70");
  const [localGlucoseMax, setLocalGlucoseMax] = useState(glucoseMax?.toString() || "180");

  const [state, action, pending] = useActionState(updateHealthTargets, { success: false });

  useEffect(() => {
    if (state.success) {
      toast.success("Health targets updated");
      setEditing(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  if (!editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Targets</CardTitle>
          <CardAction>
            <button
              onClick={() => setEditing(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Goal Weight</dt>
              <dd>{goalWeight ? `${goalWeight} lbs` : "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Daily Protein Target</dt>
              <dd>{proteinTarget ? `${proteinTarget}g` : "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Glucose Range</dt>
              <dd>
                {glucoseMin && glucoseMax
                  ? `${glucoseMin}–${glucoseMax} mg/dL`
                  : "Not set"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Targets</CardTitle>
        <CardAction>
          <button
            onClick={() => {
              setEditing(false);
              setLocalGoalWeight(goalWeight?.toString() || "");
              setLocalProtein(proteinTarget?.toString() || "");
              setLocalGlucoseMin(glucoseMin?.toString() || "70");
              setLocalGlucoseMax(glucoseMax?.toString() || "180");
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-3">
          <input type="hidden" name="goalWeight" value={localGoalWeight} />
          <input type="hidden" name="proteinTarget" value={localProtein} />
          <input type="hidden" name="glucoseMin" value={localGlucoseMin} />
          <input type="hidden" name="glucoseMax" value={localGlucoseMax} />

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Goal Weight (lbs)
            </label>
            <input
              type="number"
              value={localGoalWeight}
              onChange={(e) => setLocalGoalWeight(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. 165"
              min={50}
              max={500}
              step={0.1}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Daily Protein Target (grams)
            </label>
            <input
              type="number"
              value={localProtein}
              onChange={(e) => setLocalProtein(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. 100"
              min={20}
              max={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Glucose Min (mg/dL)
              </label>
              <input
                type="number"
                value={localGlucoseMin}
                onChange={(e) => setLocalGlucoseMin(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="70"
                min={40}
                max={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Glucose Max (mg/dL)
              </label>
              <input
                type="number"
                value={localGlucoseMax}
                onChange={(e) => setLocalGlucoseMax(e.target.value)}
                className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="180"
                min={100}
                max={400}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {pending ? "Saving..." : "Save Targets"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
