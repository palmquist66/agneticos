import { BarChart3 } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Trends</h1>

      <div className="mt-6 space-y-4">
        {/* Time range selector placeholder */}
        <div className="flex gap-1">
          {["7d", "14d", "30d", "60d", "90d"].map((range) => (
            <button
              key={range}
              className="flex-1 rounded-full border px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent data-[active]:bg-primary data-[active]:text-primary-foreground"
              data-active={range === "30d" ? "" : undefined}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="flex flex-col items-center rounded-xl border py-12 text-center">
          <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium">No data to chart yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Log weight and glucose readings to see trends over time.
          </p>
        </div>

        {/* Patterns placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Patterns</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep logging — patterns appear after 7+ days of data.
          </p>
        </div>

        {/* AI Chat placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Ask AI</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions about your data once you have enough entries.
          </p>
        </div>
      </div>
    </div>
  );
}
