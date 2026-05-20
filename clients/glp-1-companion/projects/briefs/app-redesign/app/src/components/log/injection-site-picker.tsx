"use client";

import { cn } from "@/lib/utils";

const SITES = [
  { value: "left_arm", label: "L Arm", row: 0, col: 0 },
  { value: "right_arm", label: "R Arm", row: 0, col: 1 },
  { value: "left_abdomen", label: "L Abdomen", row: 1, col: 0 },
  { value: "right_abdomen", label: "R Abdomen", row: 1, col: 1 },
  { value: "left_thigh", label: "L Thigh", row: 2, col: 0 },
  { value: "right_thigh", label: "R Thigh", row: 2, col: 1 },
] as const;

export type InjectionSiteValue = (typeof SITES)[number]["value"];

export function InjectionSitePicker({
  value,
  onChange,
  recommended,
  recentSites,
}: {
  value: InjectionSiteValue | null;
  onChange: (site: InjectionSiteValue) => void;
  recommended?: InjectionSiteValue | null;
  recentSites?: { site: string; loggedAt: Date }[];
}) {
  const lastUsedMap = new Map<string, Date>();
  recentSites?.forEach((s) => {
    if (!lastUsedMap.has(s.site)) lastUsedMap.set(s.site, s.loggedAt);
  });

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        Injection site
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SITES.map((site) => {
          const isSelected = value === site.value;
          const isRecommended = recommended === site.value;
          const lastUsed = lastUsedMap.get(site.value);

          return (
            <button
              key={site.value}
              type="button"
              onClick={() => onChange(site.value)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-lg border p-3 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {isRecommended && !isSelected && (
                <span className="absolute -top-2 right-2 rounded-full bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success">
                  Next
                </span>
              )}
              <span className="font-medium">{site.label}</span>
              {lastUsed && (
                <span className="text-[11px] text-muted-foreground">
                  {formatTimeAgo(lastUsed)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const days = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}
