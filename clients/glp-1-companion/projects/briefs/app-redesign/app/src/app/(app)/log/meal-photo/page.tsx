"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
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

type Stage = "idle" | "analyzing" | "confirming";

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxSize = 1024;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function MealPhotoPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStage("analyzing");
    try {
      const base64 = await resizeImage(file);
      setPreview(base64);

      const res = await fetch("/api/ai/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mode: "meal" }),
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
      toast.error("Failed to analyze photo. Try again.");
      setStage("idle");
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
    fd.set("inputMethod", "photo");
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
    setStage("idle");
    setAiResult(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <LogPageLayout title="Snap a Meal">
      {stage === "idle" && (
        <div className="flex flex-col items-center">
          <label className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-16 hover:bg-muted/50">
            <Camera className="h-10 w-10 text-muted-foreground/50" />
            <span className="text-sm font-medium">
              Tap to take a photo
            </span>
            <span className="text-xs text-muted-foreground">
              or choose from gallery
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              className="hidden"
            />
          </label>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="flex flex-col items-center gap-4 py-12">
          {preview && (
            <img
              src={preview}
              alt="Food"
              className="h-40 w-40 rounded-lg object-cover"
            />
          )}
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Analyzing your meal...</p>
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
