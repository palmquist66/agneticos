"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { logWeight } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import { NumberInput } from "@/components/log/number-input";
import { useState } from "react";

export function WeightForm({ lastWeight }: { lastWeight: number | null }) {
  const router = useRouter();
  const [weight, setWeight] = useState<number | null>(lastWeight ?? 150);
  const [notes, setNotes] = useState("");

  const [state, action, pending] = useActionState(logWeight, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Weight logged");
      router.push("/today");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <LogPageLayout title="Log Weight">
      <form action={action} className="space-y-6">
        <input type="hidden" name="weight" value={weight ?? ""} />
        <input type="hidden" name="notes" value={notes} />

        <NumberInput
          value={weight}
          onChange={setWeight}
          step={0.1}
          min={50}
          max={500}
          unit="lbs"
          placeholder="150"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. morning weigh-in, after workout..."
          />
        </div>

        <button
          type="submit"
          disabled={pending || weight === null}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </LogPageLayout>
  );
}
