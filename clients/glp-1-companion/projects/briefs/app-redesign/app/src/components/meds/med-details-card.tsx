"use client";

import { useState, useEffect, useActionState } from "react";
import { Pencil, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { updateMedicationSchedule } from "@/app/(app)/meds/actions";
import { toast } from "sonner";

interface MedDetailsCardProps {
  scheduleId: string;
  dosage: string;
  frequency: string;
  days: string[];
  times: string[];
}

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "specific_days", label: "Specific Days" },
  { value: "as_needed", label: "As Needed" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatFrequency(frequency: string, days: string[]) {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekly") return days.length > 0 ? `Weekly (${days[0]})` : "Weekly";
  if (frequency === "specific_days") return days.map((d) => d.slice(0, 3)).join(", ");
  if (frequency === "as_needed") return "As Needed";
  return frequency;
}

export function MedDetailsCard({ scheduleId, dosage, frequency, days, times }: MedDetailsCardProps) {
  const [editing, setEditing] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(days);
  const [selectedFreq, setSelectedFreq] = useState(frequency);

  const updateAction = updateMedicationSchedule.bind(null, scheduleId);
  const [state, formAction, pending] = useActionState(updateAction, { success: false });

  useEffect(() => {
    if (state.success && editing) {
      setEditing(false);
      toast.success("Medication updated");
    }
  }, [state.success, editing]);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  if (!editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Details</CardTitle>
          <button
            onClick={() => setEditing(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Dosage</dt>
              <dd>{dosage}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Frequency</dt>
              <dd>{formatFrequency(frequency, days)}</dd>
            </div>
            {times.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Time</dt>
                <dd>{times.join(", ")}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Details</CardTitle>
        <button
          onClick={() => setEditing(false)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="dosage" className="text-sm font-medium">
              Dosage
            </label>
            <input
              id="dosage"
              name="dosage"
              defaultValue={dosage}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="e.g. 0.5mg"
              required
            />
          </div>

          <div>
            <label htmlFor="frequency" className="text-sm font-medium">
              Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={selectedFreq}
              onChange={(e) => setSelectedFreq(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {(selectedFreq === "weekly" || selectedFreq === "specific_days") && (
            <div>
              <label className="text-sm font-medium">Days</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <input type="hidden" name="days" value={selectedDays.join(",")} />
            </div>
          )}

          <div>
            <label htmlFor="times" className="text-sm font-medium">
              Time(s)
            </label>
            <input
              id="times"
              name="times"
              defaultValue={times.join(", ")}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="e.g. 8:00 AM, 8:00 PM"
            />
          </div>

          {state.error && (
            <p className="text-sm text-error">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
