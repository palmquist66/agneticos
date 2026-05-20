"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import type { WeightDataPoint } from "@/lib/types/trends";

type Props = {
  data: WeightDataPoint[];
  goalWeight: number | null;
};

export function WeightTrendChart({ data, goalWeight }: Props) {
  if (data.length === 0) return null;

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const padding = Math.max((maxWeight - minWeight) * 0.1, 2);
  const yMin = Math.floor(
    Math.min(minWeight, goalWeight ?? minWeight) - padding
  );
  const yMax = Math.ceil(maxWeight + padding);

  // Insight: overall change
  const firstWeight = data[0].weight;
  const lastWeight = data[data.length - 1].weight;
  const change = lastWeight - firstWeight;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
          Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Math.abs(change) >= 0.1 && (
          <p className="mb-3 text-xs text-muted-foreground">
            {change < 0 ? "Down" : "Up"}{" "}
            <span className={change < 0 ? "text-success" : "text-error"}>
              {Math.abs(change).toFixed(1)} lbs
            </span>{" "}
            over this period
          </p>
        )}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => {
                  const d = new Date(v + "T00:00:00");
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${v}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as WeightDataPoint;
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
                      <p className="font-medium">{p.weight} lbs</p>
                      {p.movingAvg && (
                        <p className="text-muted-foreground">
                          7d avg: {p.movingAvg} lbs
                        </p>
                      )}
                      <p className="text-muted-foreground">{p.date}</p>
                    </div>
                  );
                }}
              />
              {goalWeight && (
                <ReferenceLine
                  y={goalWeight}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="6 4"
                  strokeOpacity={0.5}
                  label={{
                    value: `Goal: ${goalWeight}`,
                    position: "right",
                    fontSize: 10,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--foreground))" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
