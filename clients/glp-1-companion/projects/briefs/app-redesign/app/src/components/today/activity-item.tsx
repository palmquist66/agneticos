"use client";

import {
  Scale,
  Droplets,
  UtensilsCrossed,
  Pill,
  Frown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityEntry } from "@/lib/today-queries";

const ICON_MAP = {
  weight: Scale,
  glucose: Droplets,
  food: UtensilsCrossed,
  medication: Pill,
  side_effect: Frown,
} as const;

const LABEL_MAP = {
  weight: "Weight",
  glucose: "Glucose",
  food: "Food",
  medication: "Medication",
  side_effect: "Side Effect",
} as const;

const COLOR_MAP = {
  weight: "bg-secondary text-primary",
  glucose: "bg-info-bg text-info",
  food: "bg-warning-bg text-warning",
  medication: "bg-accent/10 text-accent",
  side_effect: "bg-error-bg text-error",
} as const;

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function ActivityItem({
  entry,
  onTap,
}: {
  entry: ActivityEntry;
  onTap: (entry: ActivityEntry) => void;
}) {
  const Icon = ICON_MAP[entry.type];
  const label = LABEL_MAP[entry.type];

  return (
    <button
      type="button"
      onClick={() => onTap(entry)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
        "hover:bg-muted/50 active:bg-muted"
      )}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", COLOR_MAP[entry.type])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{entry.summary}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="shrink-0 text-xs text-muted-foreground">
        {relativeTime(entry.loggedAt)}
      </p>
    </button>
  );
}
