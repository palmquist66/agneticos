"use client";

import { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/log/number-input";
import { ChipGroup } from "@/components/log/chip-group";
import { updateEntry, deleteEntry } from "@/app/(app)/today/actions";
import type { ActivityEntry } from "@/lib/today-queries";
import { toast } from "sonner";

const GLUCOSE_CONTEXTS = [
  { value: "fasting", label: "Fasting" },
  { value: "before_meal", label: "Before meal" },
  { value: "after_meal", label: "After meal" },
  { value: "bedtime", label: "Bedtime" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
] as const;

const TITLE_MAP = {
  weight: "Edit Weight",
  glucose: "Edit Glucose",
  food: "Edit Food",
  medication: "Edit Medication",
  side_effect: "Edit Side Effect",
} as const;

export function EntryEditSheet({
  entry,
  onClose,
}: {
  entry: ActivityEntry | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-0">
        {entry && <EditForm entry={entry} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function EditForm({
  entry,
  onClose,
}: {
  entry: ActivityEntry;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (data: Record<string, unknown>) => {
    startTransition(async () => {
      const result = await updateEntry(entry.type, entry.id, data);
      if (result.success) {
        toast.success("Updated");
        onClose();
      } else {
        toast.error(result.error ?? "Failed to update");
      }
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      const result = await deleteEntry(entry.type, entry.id);
      if (result.success) {
        toast.success("Deleted");
        onClose();
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    });
  };

  return (
    <>
      <SheetHeader className="pt-4 pb-2">
        <SheetTitle>{TITLE_MAP[entry.type]}</SheetTitle>
      </SheetHeader>

      <div className="space-y-4">
        <EntryFields entry={entry} onSave={handleSave} isPending={isPending} />

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isPending}
        >
          {confirmDelete ? "Tap again to confirm delete" : "Delete entry"}
        </Button>
      </div>
    </>
  );
}

function EntryFields({
  entry,
  onSave,
  isPending,
}: {
  entry: ActivityEntry;
  onSave: (data: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  switch (entry.type) {
    case "weight":
      return (
        <WeightFields
          data={entry.data}
          onSave={onSave}
          isPending={isPending}
        />
      );
    case "glucose":
      return (
        <GlucoseFields
          data={entry.data}
          onSave={onSave}
          isPending={isPending}
        />
      );
    case "food":
      return (
        <FoodFields
          data={entry.data}
          onSave={onSave}
          isPending={isPending}
        />
      );
    case "medication":
      return (
        <NotesOnlyFields
          data={entry.data}
          onSave={onSave}
          isPending={isPending}
        />
      );
    case "side_effect":
      return (
        <SideEffectFields
          data={entry.data}
          onSave={onSave}
          isPending={isPending}
        />
      );
  }
}

// ─── Weight ─────────────────────────────────────────────

function WeightFields({
  data,
  onSave,
  isPending,
}: {
  data: Record<string, unknown>;
  onSave: (d: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [weight, setWeight] = useState<number | null>(
    (data.weight as number) ?? null
  );
  const [notes, setNotes] = useState((data.notes as string) ?? "");

  return (
    <>
      <NumberInput
        value={weight}
        onChange={setWeight}
        step={0.1}
        min={50}
        max={500}
        unit="lbs"
      />
      <NotesTextarea value={notes} onChange={setNotes} />
      <SaveButton
        onClick={() => onSave({ weight: String(weight), notes })}
        disabled={isPending || weight === null}
        isPending={isPending}
      />
    </>
  );
}

// ─── Glucose ────────────────────────────────────────────

function GlucoseFields({
  data,
  onSave,
  isPending,
}: {
  data: Record<string, unknown>;
  onSave: (d: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [value, setValue] = useState<number | null>(
    (data.value as number) ?? null
  );
  const [context, setContext] = useState((data.context as string) ?? "");
  const [notes, setNotes] = useState((data.notes as string) ?? "");

  return (
    <>
      <NumberInput
        value={value}
        onChange={setValue}
        step={1}
        min={40}
        max={600}
        unit="mg/dL"
      />
      <ChipGroup
        label="Context"
        options={[...GLUCOSE_CONTEXTS]}
        value={context}
        onChange={(v) => setContext(v as string)}
      />
      <NotesTextarea value={notes} onChange={setNotes} />
      <SaveButton
        onClick={() => onSave({ value: String(value), context, notes })}
        disabled={isPending || value === null}
        isPending={isPending}
      />
    </>
  );
}

// ─── Food ───────────────────────────────────────────────

function FoodFields({
  data,
  onSave,
  isPending,
}: {
  data: Record<string, unknown>;
  onSave: (d: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState((data.name as string) ?? "");
  const [calories, setCalories] = useState(
    data.calories != null ? String(data.calories) : ""
  );
  const [protein, setProtein] = useState(
    data.protein != null ? String(data.protein) : ""
  );
  const [carbs, setCarbs] = useState(
    data.carbs != null ? String(data.carbs) : ""
  );
  const [fat, setFat] = useState(
    data.fat != null ? String(data.fat) : ""
  );
  const [notes, setNotes] = useState((data.notes as string) ?? "");

  return (
    <>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted-foreground">
          Food name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MacroInput label="Calories" value={calories} onChange={setCalories} unit="kcal" />
        <MacroInput label="Protein" value={protein} onChange={setProtein} unit="g" />
        <MacroInput label="Carbs" value={carbs} onChange={setCarbs} unit="g" />
        <MacroInput label="Fat" value={fat} onChange={setFat} unit="g" />
      </div>
      <NotesTextarea value={notes} onChange={setNotes} />
      <SaveButton
        onClick={() =>
          onSave({ name, calories, protein, carbs, fat, notes })
        }
        disabled={isPending || !name.trim()}
        isPending={isPending}
      />
    </>
  );
}

function MacroInput({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label} ({unit})
      </label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

// ─── Side Effect ────────────────────────────────────────

function SideEffectFields({
  data,
  onSave,
  isPending,
}: {
  data: Record<string, unknown>;
  onSave: (d: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [severity, setSeverity] = useState((data.severity as string) ?? "");
  const [notes, setNotes] = useState((data.notes as string) ?? "");

  return (
    <>
      <ChipGroup
        label="Severity"
        options={[...SEVERITY_OPTIONS]}
        value={severity}
        onChange={(v) => setSeverity(v as string)}
      />
      <NotesTextarea value={notes} onChange={setNotes} />
      <SaveButton
        onClick={() => onSave({ severity, notes })}
        disabled={isPending}
        isPending={isPending}
      />
    </>
  );
}

// ─── Notes Only (Medication) ────────────────────────────

function NotesOnlyFields({
  data,
  onSave,
  isPending,
}: {
  data: Record<string, unknown>;
  onSave: (d: Record<string, unknown>) => void;
  isPending: boolean;
}) {
  const [notes, setNotes] = useState((data.notes as string) ?? "");

  return (
    <>
      <NotesTextarea value={notes} onChange={setNotes} />
      <SaveButton
        onClick={() => onSave({ notes })}
        disabled={isPending}
        isPending={isPending}
      />
    </>
  );
}

// ─── Shared sub-components ──────────────────────────────

function NotesTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">
        Notes (optional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SaveButton({
  onClick,
  disabled,
  isPending,
}: {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
}) {
  return (
    <Button
      className="w-full"
      onClick={onClick}
      disabled={disabled}
    >
      {isPending ? "Saving..." : "Save changes"}
    </Button>
  );
}
