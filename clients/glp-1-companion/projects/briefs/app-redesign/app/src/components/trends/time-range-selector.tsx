"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TimeRange } from "@/lib/types/trends";
import { cn } from "@/lib/utils";

const RANGES: TimeRange[] = ["7d", "14d", "30d", "60d", "90d"];

export function TimeRangeSelector({ current }: { current: TimeRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function select(range: TimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/trends?${params.toString()}`);
  }

  return (
    <div className="flex gap-1">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => select(range)}
          className={cn(
            "flex-1 rounded-full border px-2 py-1.5 text-xs font-medium transition-colors",
            range === current
              ? "bg-primary text-primary-foreground border-transparent"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
