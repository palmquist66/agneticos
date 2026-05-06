"use client";

import Link from "next/link";
import { Pill, Syringe, ChevronRight, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deactivateMedication } from "@/app/(app)/meds/actions";
import { toast } from "sonner";

interface MedicationSchedule {
  id: string;
  medName: string;
  dosage: string;
  frequency: string;
  days: string[];
  times: string[];
  isGlp1: boolean;
}

function formatFrequency(frequency: string, days: string[]) {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekly") return days.length > 0 ? `Weekly (${days[0]})` : "Weekly";
  if (frequency === "specific_days") return days.map((d) => d.slice(0, 3)).join(", ");
  return frequency;
}

export function ActiveMedications({ medications }: { medications: MedicationSchedule[] }) {
  async function handleDeactivate(id: string) {
    const result = await deactivateMedication(id);
    if (result.success) {
      toast.success("Medication deactivated");
    } else {
      toast.error(result.error || "Failed to deactivate");
    }
  }

  if (medications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Medications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {medications.map((med) => (
          <div
            key={med.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              med.isGlp1 ? "bg-accent/10" : "bg-primary/10"
            )}>
              {med.isGlp1 ? (
                <Syringe className="h-4 w-4 text-accent" />
              ) : (
                <Pill className="h-4 w-4 text-primary" />
              )}
            </div>

            <Link href={`/meds/${med.id}`} className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{med.medName}</span>
                {med.isGlp1 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">GLP-1</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {med.dosage} · {formatFrequency(med.frequency, med.days)}
              </p>
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleDeactivate(med.id)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Deactivate"
              >
                <Power className="h-3.5 w-3.5" />
              </button>
              <Link href={`/meds/${med.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
