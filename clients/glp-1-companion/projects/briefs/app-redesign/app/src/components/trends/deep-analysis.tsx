"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

export function DeepAnalysis() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  async function runAnalysis() {
    setLoading(true);
    setResult(null);
    setExpanded(true);

    try {
      const res = await fetch("/api/ai/deep-analysis", { method: "POST" });

      if (!res.ok) throw new Error("Failed to run analysis");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setResult(accumulated);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch {
      setResult("Unable to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Deep Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!result && !loading && (
          <div className="text-center">
            <p className="mb-3 text-xs text-muted-foreground">
              Get a comprehensive analysis of all your health data, trends, and
              actionable recommendations.
            </p>
            <Button onClick={runAnalysis} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Brain className="h-3.5 w-3.5" />
              Run Full Analysis
            </Button>
          </div>
        )}

        {loading && !result && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Analyzing your data...
          </div>
        )}

        {result && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-2 flex w-full items-center justify-between text-xs text-muted-foreground"
            >
              <span>{loading ? "Generating..." : "Analysis complete"}</span>
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            {expanded && (
              <div className="prose prose-xs max-w-none text-xs leading-relaxed text-foreground [&_h1]:text-sm [&_h1]:font-semibold [&_h1]:mt-3 [&_h1]:mb-1 [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-xs [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 whitespace-pre-wrap">
                {result}
              </div>
            )}
            {!loading && (
              <Button
                onClick={runAnalysis}
                size="sm"
                variant="ghost"
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3" />
                Re-analyze
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
