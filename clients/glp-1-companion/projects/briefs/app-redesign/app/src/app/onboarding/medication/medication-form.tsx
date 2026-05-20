"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Syringe } from "lucide-react";
import { saveOnboardingMedication } from "../actions";

const GLP1_MEDICATIONS = [
  { name: "Ozempic", type: "semaglutide", frequency: "Weekly injection" },
  { name: "Wegovy", type: "semaglutide", frequency: "Weekly injection" },
  { name: "Mounjaro", type: "tirzepatide", frequency: "Weekly injection" },
  { name: "Zepbound", type: "tirzepatide", frequency: "Weekly injection" },
  { name: "Saxenda", type: "liraglutide", frequency: "Daily injection" },
  { name: "Victoza", type: "liraglutide", frequency: "Daily injection" },
  { name: "Trulicity", type: "dulaglutide", frequency: "Weekly injection" },
  { name: "Rybelsus", type: "semaglutide", frequency: "Daily oral" },
];

const DOSAGES: Record<string, string[]> = {
  Ozempic: ["0.25mg", "0.5mg", "1mg", "2mg"],
  Wegovy: ["0.25mg", "0.5mg", "1mg", "1.7mg", "2.4mg"],
  Mounjaro: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
  Zepbound: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
  Saxenda: ["0.6mg", "1.2mg", "1.8mg", "2.4mg", "3mg"],
  Victoza: ["0.6mg", "1.2mg", "1.8mg"],
  Trulicity: ["0.75mg", "1.5mg", "3mg", "4.5mg"],
  Rybelsus: ["3mg", "7mg", "14mg"],
};

interface MedicationFormProps {
  currentMed: string | null;
  currentDosage: string | null;
}

export function MedicationForm({ currentMed, currentDosage }: MedicationFormProps) {
  const router = useRouter();
  const [selectedMed, setSelectedMed] = useState(currentMed || "");
  const [selectedDosage, setSelectedDosage] = useState(currentDosage || "");

  const [state, action, pending] = useActionState(saveOnboardingMedication, { success: false });

  useEffect(() => {
    if (state.success) {
      router.push("/onboarding/goals");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const dosages = DOSAGES[selectedMed] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What GLP-1 are you taking?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us personalize your tracking experience.
        </p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="glp1Med" value={selectedMed} />
        <input type="hidden" name="glp1Dosage" value={selectedDosage} />

        {/* Medication grid */}
        <div className="grid grid-cols-2 gap-2">
          {GLP1_MEDICATIONS.map((med) => (
            <button
              key={med.name}
              type="button"
              onClick={() => {
                setSelectedMed(med.name);
                setSelectedDosage("");
              }}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors ${
                selectedMed === med.name
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Syringe className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium">{med.name}</span>
              </div>
              <span className="mt-0.5 text-[10px] text-muted-foreground">{med.frequency}</span>
            </button>
          ))}
        </div>

        {/* Dosage selector */}
        {selectedMed && dosages.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">Current dosage</label>
            <div className="flex flex-wrap gap-2">
              {dosages.map((dose) => (
                <button
                  key={dose}
                  type="button"
                  onClick={() => setSelectedDosage(dose)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedDosage === dose
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dose}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push("/onboarding/goals")}
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
