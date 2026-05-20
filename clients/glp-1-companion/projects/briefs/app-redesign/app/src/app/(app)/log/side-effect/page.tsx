"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logSideEffect } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import { ChipGroup } from "@/components/log/chip-group";

type Symptom =
  | "nausea"
  | "diarrhea"
  | "constipation"
  | "stomach_pain"
  | "headache"
  | "fatigue"
  | "dizziness"
  | "reduced_appetite"
  | "injection_site_reaction"
  | "other";

type Severity = "mild" | "moderate" | "severe";

const SYMPTOM_OPTIONS: { value: Symptom; label: string }[] = [
  { value: "nausea", label: "Nausea" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "constipation", label: "Constipation" },
  { value: "stomach_pain", label: "Stomach Pain" },
  { value: "headache", label: "Headache" },
  { value: "fatigue", label: "Fatigue" },
  { value: "dizziness", label: "Dizziness" },
  { value: "reduced_appetite", label: "Reduced Appetite" },
  { value: "injection_site_reaction", label: "Injection Site Reaction" },
  { value: "other", label: "Other" },
];

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

export default function SideEffectPage() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severity, setSeverity] = useState<Severity | "">("");
  const [notes, setNotes] = useState("");

  const [state, action, pending] = useActionState(logSideEffect, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Side effects logged");
      router.push("/today");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <LogPageLayout title="Log Side Effect">
      <form action={action} className="space-y-6">
        <input type="hidden" name="symptoms" value={symptoms.join(",")} />
        <input type="hidden" name="severity" value={severity} />
        <input type="hidden" name="notes" value={notes} />

        <ChipGroup
          options={SYMPTOM_OPTIONS}
          value={symptoms}
          onChange={(v) => setSymptoms(v as Symptom[])}
          multiple
          label="Symptoms"
        />

        <ChipGroup
          options={SEVERITY_OPTIONS}
          value={severity}
          onChange={(v) => setSeverity(v as Severity)}
          label="Severity"
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
          disabled={pending || symptoms.length === 0 || !severity}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </LogPageLayout>
  );
}
