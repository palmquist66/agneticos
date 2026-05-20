"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Power, RotateCcw } from "lucide-react";
import { deactivateMedication, reactivateMedication } from "@/app/(app)/meds/actions";

interface MedDetailActionsProps {
  scheduleId: string;
  active: boolean;
}

export function MedDetailActions({ scheduleId, active }: MedDetailActionsProps) {
  const router = useRouter();

  async function handleDeactivate() {
    const result = await deactivateMedication(scheduleId);
    if (result.success) {
      toast.success("Medication deactivated");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to deactivate");
    }
  }

  async function handleReactivate() {
    const result = await reactivateMedication(scheduleId);
    if (result.success) {
      toast.success("Medication reactivated");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reactivate");
    }
  }

  return (
    <div className="pt-2">
      {active ? (
        <button
          onClick={handleDeactivate}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-error/20 px-4 py-2.5 text-sm font-medium text-error hover:bg-error-bg"
        >
          <Power className="h-4 w-4" />
          Deactivate Medication
        </button>
      ) : (
        <button
          onClick={handleReactivate}
          className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Reactivate Medication
        </button>
      )}
    </div>
  );
}
