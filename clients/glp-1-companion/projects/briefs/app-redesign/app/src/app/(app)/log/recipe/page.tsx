"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { logFood } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import { NutritionDisplay } from "@/components/log/nutrition-display";
import { ChipGroup } from "@/components/log/chip-group";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

type AIResult = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  totalServings: number;
};

type Stage = "input" | "analyzing" | "confirming";

function suggestMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export default function RecipePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("input");
  const [ingredients, setIngredients] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [servingsEaten, setServingsEaten] = useState(1);
  const [recipeName, setRecipeName] = useState("");
  const [mealType, setMealType] = useState<MealType>(suggestMealType());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) return;

    setStage("analyzing");
    try {
      const res = await fetch("/api/ai/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingredients, mode: "recipe" }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      setAiResult({
        name: data.name,
        calories: data.calories ?? 0,
        protein: data.protein ?? 0,
        carbs: data.carbs ?? 0,
        fat: data.fat ?? 0,
        totalServings: data.totalServings ?? 4,
      });
      setRecipeName(data.name);
      setServingsEaten(1);
      setStage("confirming");
    } catch {
      toast.error("Failed to analyze recipe. Try again.");
      setStage("input");
    }
  };

  const perServing = aiResult
    ? {
        calories: aiResult.calories / aiResult.totalServings,
        protein: aiResult.protein / aiResult.totalServings,
        carbs: aiResult.carbs / aiResult.totalServings,
        fat: aiResult.fat / aiResult.totalServings,
      }
    : null;

  const myPortion = perServing
    ? {
        calories: perServing.calories * servingsEaten,
        protein: perServing.protein * servingsEaten,
        carbs: perServing.carbs * servingsEaten,
        fat: perServing.fat * servingsEaten,
      }
    : null;

  const handleSave = async () => {
    if (!myPortion || !recipeName.trim()) return;

    setSaving(true);
    const fd = new FormData();
    fd.set("name", recipeName);
    fd.set("calories", String(Math.round(myPortion.calories)));
    fd.set("protein", String(Math.round(myPortion.protein)));
    fd.set("carbs", String(Math.round(myPortion.carbs)));
    fd.set("fat", String(Math.round(myPortion.fat)));
    fd.set("mealType", mealType);
    fd.set("inputMethod", "recipe");
    fd.set("servings", String(servingsEaten));
    fd.set("notes", notes);

    const result = await logFood({ success: false }, fd);
    setSaving(false);

    if (result.success) {
      toast.success("Recipe logged");
      router.push("/today");
    } else {
      toast.error(result.error || "Failed to save");
    }
  };

  const handleRetry = () => {
    setStage("input");
    setAiResult(null);
  };

  return (
    <LogPageLayout title="Log a Recipe">
      {stage === "input" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Ingredients or recipe description
            </label>
            <textarea
              autoFocus
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={6}
              placeholder={"e.g.\n2 chicken breasts\n1 cup rice\n2 tbsp olive oil\n1 cup broccoli"}
              className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!ingredients.trim()}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Analyze Recipe
          </button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Analyzing your recipe...
          </p>
        </div>
      )}

      {stage === "confirming" && aiResult && myPortion && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Recipe name
            </label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Total recipe ({aiResult.totalServings} servings)
            </p>
            <NutritionDisplay
              calories={aiResult.calories}
              protein={aiResult.protein}
              carbs={aiResult.carbs}
              fat={aiResult.fat}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Servings eaten
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={servingsEaten}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v > 0) setServingsEaten(v);
              }}
              step={0.5}
              min={0.25}
              className="w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Your portion
            </p>
            <NutritionDisplay
              calories={myPortion.calories}
              protein={myPortion.protein}
              carbs={myPortion.carbs}
              fat={myPortion.fat}
            />
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
              onClick={handleRetry}
              disabled={saving}
              className="flex-1 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !recipeName.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </LogPageLayout>
  );
}
