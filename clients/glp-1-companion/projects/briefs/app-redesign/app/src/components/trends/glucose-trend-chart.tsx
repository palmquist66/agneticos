"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GlucoseDataPoint, GlucoseStats } from "@/lib/types/trends";

type Props = {
  data: GlucoseDataPoint[];
  stats: GlucoseStats | null;
  targetMin: number;
  targetMax: number;
};

const CONTEXTS = [
  { value: null, label: "All" },
  { value: "fasting", label: "Fasting" },
  { value: "before_meal", label: "Before meal" },
  { value: "after_meal", label: "After meal" },
  { value: "bedtime", label: "Bedtime" },
] as const;

function dotColor(value: number, min: number, max: number): string {
  if (value < min) return "#D9892C"; // warning - low
  if (value > max) return "#C0392B"; // error - high
  return "#2E8B6F"; // success - in range
}

export function GlucoseTrendChart({ data, stats, targetMin, targetMax }: Props) {
  const [contextFilter, setContextFilter] = useState<string | null>(null);

  const filtered = useMemo(
    () => (contextFilter ? data.filter((d) => d.context === contextFilter) : data),
    [data, contextFilter]
  );

  const { minVal, maxVal, padding } = useMemo(() => {
    if (filtered.length === 0) return { minVal: 0, maxVal: 0, padding: 0 };
    const values = filtered.map((d) => d.value);
    const min = Math.min(...values, targetMin);
    const max = Math.max(...values, targetMax);
    return { minVal: min, maxVal: max, padding: Math.max((max - min) * 0.1, 10) };
  }, [filtered, targetMin, targetMax]);

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          Glucose
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Context filter chips */}
        <div className="mb-3 flex flex-wrap gap-1">
          {CONTEXTS.map((ctx) => (
            <button
              key={ctx.value ?? "all"}
              onClick={() => setContextFilter(ctx.value)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                contextFilter === ctx.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {ctx.label}
            </button>
          ))}
        </div>

        {/* Stats row */}
        {stats && (
          <div className="mb-3 flex gap-3 text-[10px] text-muted-foreground">
            <span>Avg: <strong className="text-foreground">{stats.avg}</strong></span>
            <span>Range: {stats.min}–{stats.max}</span>
            <span>In target: <strong className="text-foreground">{stats.inRange}%</strong></span>
          </div>
        )}

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filtered}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <ReferenceArea
                y1={targetMin}
                y2={targetMax}
                fill="hsl(var(--primary))"
                fillOpacity={0.06}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[Math.floor(minVal - padding), Math.ceil(maxVal + padding)]}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as GlucoseDataPoint;
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
                      <p className="font-medium">{p.value} mg/dL</p>
                      {p.context && (
                        <p className="text-muted-foreground">
                          {p.context.replace(/_/g, " ")}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {new Date(p.date).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--foreground))"
                strokeWidth={1.5}
                dot={(props: Record<string, unknown>) => {
                  const cx = props.cx as number | undefined;
                  const cy = props.cy as number | undefined;
                  const payload = props.payload as GlucoseDataPoint | undefined;
                  if (cx == null || cy == null || !payload) return <circle r={0} />;
                  return (
                    <circle
                      key={`${cx}-${cy}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill={dotColor(payload.value, targetMin, targetMax)}
                      stroke="none"
                    />
                  );
                }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
