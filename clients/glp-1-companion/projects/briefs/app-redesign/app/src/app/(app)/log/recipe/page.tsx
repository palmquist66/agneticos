"use client";

import { ArrowLeft, CookingPot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecipePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <h1 className="text-lg font-semibold">Log a Recipe</h1>
      <div className="mt-8 flex flex-col items-center rounded-xl border py-16 text-center">
        <CookingPot className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Recipe calculator with per-serving nutrition
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Coming in Phase 2</p>
      </div>
    </div>
  );
}
