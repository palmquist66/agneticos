"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logGlucose } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import { NumberInput } from "@/components/log/number-input";
import { ChipGroup } from "@/components/log/chip-group";

type GlucoseContext = "fasting" | "before_meal" | "after_meal" | "bedtime";

const CONTEXT_OPTIONS: { value: GlucoseContext; label: string }[] = [
  { value: "fasting", label: "Fasting" },
  { value: "before_meal", label: "Before Meal" },
  { value: "after_meal", label: "After Meal" },
  { value: "bedtime", label: "Bedtime" },
];

function suggestContext(): GlucoseContext {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return "fasting";
  if (hour >= 11 && hour < 13) return "before_meal";
  if (hour >= 13 && hour < 15) return "after_meal";
  if (hour >= 20 && hour < 23) return "bedtime";
  return "fasting";
}

export default function GlucosePage() {
  const router = useRouter();
  const [value, setValue] = useState<number | null>(null);
  const [context, setContext] = useState<GlucoseContext>(suggestContext());
  const [notes, setNotes] = useState("");

  const [state, action, pending] = useActionState(logGlucose, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Glucose logged");
      router.push("/today");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <LogPageLayout title="Log Glucose">
      <form action={action} className="space-y-6">
        <input type="hidden" name="value" value={value ?? ""} />
        <input type="hidden" name="context" value={context} />
        <input type="hidden" name="notes" value={notes} />

        <NumberInput
          value={value}
          onChange={setValue}
          step={1}
          min={40}
          max={600}
          unit="mg/dL"
          placeholder="100"
        />

        <ChipGroup
          options={CONTEXT_OPTIONS}
          value={context}
          onChange={(v) => setContext(v as GlucoseContext)}
          label="Context"
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
          />
        </div>

        <button
          type="submit"
          disabled={pending || value === null}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </LogPageLayout>
  );
}
