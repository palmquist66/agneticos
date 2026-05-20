import { cn } from "@/lib/utils";
import type { TodayNumbers } from "@/lib/today-queries";
import { ArrowDown, ArrowUp } from "lucide-react";

export function TodaysNumbers({ numbers }: { numbers: TodayNumbers }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Weight */}
      <div className="rounded-xl bg-card p-3 text-center ring-1 ring-primary/10">
        <p className="text-xs text-muted-foreground">Weight</p>
        {numbers.weight ? (
          <>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {numbers.weight.value}
            </p>
            <div className="flex items-center justify-center gap-0.5">
              {numbers.weight.delta !== null && numbers.weight.delta !== 0 && (
                <>
                  {numbers.weight.delta < 0 ? (
                    <ArrowDown className="h-3 w-3 text-success" />
                  ) : (
                    <ArrowUp className="h-3 w-3 text-error" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      numbers.weight.delta < 0
                        ? "text-success"
                        : "text-error"
                    )}
                  >
                    {Math.abs(numbers.weight.delta)}
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground">
                {numbers.weight.unit}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-lg font-semibold">&mdash;</p>
            <p className="text-xs text-muted-foreground">lbs</p>
          </>
        )}
      </div>

      {/* Glucose */}
      <div className="rounded-xl bg-card p-3 text-center ring-1 ring-primary/10">
        <p className="text-xs text-muted-foreground">Glucose</p>
        {numbers.glucose ? (
          <>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {numbers.glucose.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {numbers.glucose.context
                ? numbers.glucose.context.replace(/_/g, " ")
                : numbers.glucose.unit}
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-lg font-semibold">&mdash;</p>
            <p className="text-xs text-muted-foreground">mg/dL</p>
          </>
        )}
      </div>

      {/* Protein */}
      <div className="rounded-xl bg-card p-3 text-center ring-1 ring-brand-warm/30">
        <p className="text-xs text-muted-foreground">Protein</p>
        {numbers.protein ? (
          <>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {numbers.protein.value}
            </p>
            <p className="text-xs text-muted-foreground">
              / {numbers.protein.target}g
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-lg font-semibold">&mdash;</p>
            <p className="text-xs text-muted-foreground">g</p>
          </>
        )}
      </div>
    </div>
  );
}
