"use client";

import { useState } from "react";
import { ChipGroup } from "./chip-group";
import { NutritionDisplay } from "./nutrition-display";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export type MealData = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: MealType;
  notes: string;
};

function suggestMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export function MealConfirmation({
  initialData,
  onSave,
  onRetry,
  saving,
}: {
  initialData: {
    name: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
  onSave: (data: MealData) => void;
  onRetry: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initialData.name);
  const [calories, setCalories] = useState(initialData.calories);
  const [protein, setProtein] = useState(initialData.protein);
  const [carbs, setCarbs] = useState(initialData.carbs);
  const [fat, setFat] = useState(initialData.fat);
  const [mealType, setMealType] = useState<MealType>(suggestMealType());
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, calories, protein, carbs, fat, mealType, notes });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-muted-foreground">
          Food
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <NutritionDisplay
        calories={calories}
        protein={protein}
        carbs={carbs}
        fat={fat}
      />

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Cal", value: calories, set: setCalories },
          { label: "Protein", value: protein, set: setProtein },
          { label: "Carbs", value: carbs, set: setCarbs },
          { label: "Fat", value: fat, set: setFat },
        ].map((field) => (
          <div key={field.label}>
            <label className="mb-1 block text-center text-[11px] text-muted-foreground">
              {field.label}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={field.value ?? ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                field.set(isNaN(v) ? null : v);
              }}
              className="w-full rounded border bg-card px-2 py-1.5 text-center text-sm tabular-nums outline-none focus:ring-1 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        ))}
      </div>

      <ChipGroup
        options={MEAL_OPTIONS}
        value={mealType}
        onChange={(v) => setMealType(v as MealType)}
        label="Meal type"
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          disabled={saving}
          className="flex-1 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
