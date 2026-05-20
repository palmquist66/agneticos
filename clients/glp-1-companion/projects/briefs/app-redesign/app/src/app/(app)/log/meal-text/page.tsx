"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { logFood } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import {
  MealConfirmation,
  type MealData,
} from "@/components/log/meal-confirmation";

type AIResult = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type Stage = "input" | "analyzing" | "confirming";

export default function MealTextPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("input");
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setStage("analyzing");
    try {
      const res = await fetch("/api/ai/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description, mode: "meal" }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      setAiResult({
        name: data.name,
        calories: data.calories ?? null,
        protein: data.protein ?? null,
        carbs: data.carbs ?? null,
        fat: data.fat ?? null,
      });
      setStage("confirming");
    } catch {
      toast.error("Failed to analyze meal. Try again.");
      setStage("input");
    }
  };

  const handleSave = async (data: MealData) => {
    setSaving(true);
    const fd = new FormData();
    fd.set("name", data.name);
    fd.set("calories", String(data.calories ?? ""));
    fd.set("protein", String(data.protein ?? ""));
    fd.set("carbs", String(data.carbs ?? ""));
    fd.set("fat", String(data.fat ?? ""));
    fd.set("mealType", data.mealType);
    fd.set("inputMethod", "text");
    fd.set("notes", data.notes);

    const result = await logFood({ success: false }, fd);
    setSaving(false);

    if (result.success) {
      toast.success("Meal logged");
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
    <LogPageLayout title="Describe a Meal">
      {stage === "input" && (
        <div className="space-y-4">
          <textarea
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. grilled chicken breast with rice and steamed broccoli"
            className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!description.trim()}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Analyze
          </button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Analyzing your meal...
          </p>
        </div>
      )}

      {stage === "confirming" && aiResult && (
        <MealConfirmation
          initialData={aiResult}
          onSave={handleSave}
          onRetry={handleRetry}
          saving={saving}
        />
      )}
    </LogPageLayout>
  );
}
