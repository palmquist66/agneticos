"use client";

import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { addMedicationSchedule } from "@/app/(app)/meds/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

export function AddMedicationSheet() {
  const [open, setOpen] = useState(false);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState("08:00");
  const [isGlp1, setIsGlp1] = useState(false);

  const [state, action, pending] = useActionState(addMedicationSchedule, { success: false });

  useEffect(() => {
    if (state.success) {
      toast.success("Medication added");
      setOpen(false);
      resetForm();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function resetForm() {
    setMedName("");
    setDosage("");
    setFrequency("daily");
    setSelectedDays([]);
    setTime("08:00");
    setIsGlp1(false);
  }

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Medication
          </Button>
        }
      />
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Add Medication</SheetTitle>
          <SheetDescription>
            Add a medication to your daily schedule.
          </SheetDescription>
        </SheetHeader>

        <form action={action} className="space-y-4 px-4 pb-6">
          <input type="hidden" name="medName" value={medName} />
          <input type="hidden" name="dosage" value={dosage} />
          <input type="hidden" name="frequency" value={frequency} />
          <input type="hidden" name="days" value={selectedDays.join(",")} />
          <input type="hidden" name="times" value={time} />
          <input type="hidden" name="isGlp1" value={isGlp1.toString()} />

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Medication Name
            </label>
            <input
              type="text"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Metformin, Vitamin D"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Dosage
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. 500mg, 1000IU"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="specific_days">Specific Days</option>
            </select>
          </div>

          {(frequency === "weekly" || frequency === "specific_days") && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {frequency === "weekly" ? "Day of Week" : "Select Days"}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDay(value)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      selectedDays.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isGlp1}
              onChange={(e) => setIsGlp1(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm">This is a GLP-1 medication (injection)</span>
          </label>

          <button
            type="submit"
            disabled={pending || !medName || !dosage}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Adding..." : "Add Medication"}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
