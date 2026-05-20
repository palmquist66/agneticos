"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pattern } from "@/lib/types/trends";

function ConfidenceBadge({ confidence }: { confidence: Pattern["confidence"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        confidence === "high" && "bg-success-bg text-success",
        confidence === "medium" && "bg-warning-bg text-warning",
        confidence === "low" && "bg-muted text-muted-foreground"
      )}
    >
      {confidence}
    </span>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-lg border p-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{pattern.title}</p>
            <ConfidenceBadge confidence={pattern.confidence} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {pattern.summary}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      {expanded && (
        <div className="mt-2 border-t pt-2">
          <p className="text-xs text-muted-foreground">{pattern.detail}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">
            Based on {pattern.dataPoints} data points
          </p>
        </div>
      )}
    </button>
  );
}

export function PatternCards({ patterns }: { patterns: Pattern[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patterns.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Keep logging &mdash; patterns appear after 7+ days of data.
          </p>
        ) : (
          <div className="space-y-2">
            {patterns.map((p) => (
              <PatternCard key={p.type} pattern={p} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
