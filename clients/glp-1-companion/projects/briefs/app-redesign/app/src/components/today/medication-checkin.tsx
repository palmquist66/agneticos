"use client";

import { useOptimistic, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleMedTaken, markAllMedsTaken } from "@/app/(app)/today/actions";
import type { ScheduledMed } from "@/lib/today-queries";
import { Check, Pill } from "lucide-react";

export function MedicationCheckin({
  meds: initialMeds,
}: {
  meds: ScheduledMed[];
}) {
  const [isPending, startTransition] = useTransition();
  const [meds, setOptimisticMeds] = useOptimistic(
    initialMeds,
    (state: ScheduledMed[], update: { id: string; taken: boolean } | "all") => {
      if (update === "all") {
        return state.map((m) => ({ ...m, taken: true }));
      }
      return state.map((m) =>
        m.id === update.id ? { ...m, taken: update.taken } : m
      );
    }
  );

  const allTaken = meds.every((m) => m.taken);
  const untaken = meds.filter((m) => !m.taken);

  const handleToggle = (med: ScheduledMed) => {
    startTransition(async () => {
      setOptimisticMeds({ id: med.id, taken: !med.taken });
      await toggleMedTaken(
        med.id,
        med.medName,
        med.dosage,
        med.taken,
        med.logId
      );
    });
  };

  const handleMarkAll = () => {
    startTransition(async () => {
      setOptimisticMeds("all");
      await markAllMedsTaken(
        untaken.map((m) => ({
          scheduleId: m.id,
          medName: m.medName,
          dosage: m.dosage,
        }))
      );
    });
  };

  // Collapsed state when all taken
  if (allTaken) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-bg">
            <Check className="h-4 w-4 text-success" />
          </div>
          <p className="text-sm font-medium text-success">
            All medications taken
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-4 w-4 text-accent" />
          Today&apos;s Medications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meds.map((med) => (
          <button
            key={med.id}
            type="button"
            onClick={() => handleToggle(med)}
            disabled={isPending}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
              med.taken
                ? "border-success/20 bg-success-bg"
                : "border-border bg-card hover:bg-muted/50 active:bg-muted"
            )}
          >
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                med.taken
                  ? "border-success bg-success text-white"
                  : "border-muted-foreground/30"
              )}
            >
              {med.taken && <Check className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  med.taken && "text-success"
                )}
              >
                {med.medName}
              </p>
              <p className="text-xs text-muted-foreground">{med.dosage}</p>
            </div>
          </button>
        ))}

        {untaken.length > 1 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleMarkAll}
            disabled={isPending}
          >
            Mark all as taken
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
