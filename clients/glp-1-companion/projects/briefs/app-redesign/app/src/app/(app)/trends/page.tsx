import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import {
  getWeightTrend,
  getGlucoseTrend,
  computeGlucoseStats,
  getPatternData,
} from "@/lib/trends-queries";
import { detectPatterns } from "@/lib/pattern-engine";
import { TIME_RANGE_DAYS } from "@/lib/types/trends";
import type { TimeRange } from "@/lib/types/trends";
import { TimeRangeSelector } from "@/components/trends/time-range-selector";
import { WeightTrendChart } from "@/components/trends/weight-trend-chart";
import { GlucoseTrendChart } from "@/components/trends/glucose-trend-chart";
import { PatternCards } from "@/components/trends/pattern-cards";
import { AIChat } from "@/components/trends/ai-chat";
import { DeepAnalysis } from "@/components/trends/deep-analysis";

export const revalidate = 60; // revalidate at most once per minute

type Props = {
  searchParams: Promise<{ range?: string }>;
};

export default async function TrendsPage({ searchParams }: Props) {
  const params = await searchParams;
  const range = (
    Object.keys(TIME_RANGE_DAYS).includes(params.range ?? "")
      ? params.range
      : "30d"
  ) as TimeRange;
  const days = TIME_RANGE_DAYS[range];

  const user = await getCurrentUser();

  const [weightData, glucoseData, patternData] = await Promise.all([
    getWeightTrend(user.id, days),
    getGlucoseTrend(user.id, days),
    getPatternData(user.id),
  ]);

  const glucoseStats = computeGlucoseStats(
    glucoseData,
    user.glucoseMin ?? 70,
    user.glucoseMax ?? 180
  );

  const patterns = detectPatterns({
    ...patternData,
    glp1Med: user.glp1Med,
    proteinTarget: user.proteinTarget,
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Trends</h1>

      <div className="mt-6 space-y-4">
        <Suspense>
          <TimeRangeSelector current={range} />
        </Suspense>

        <WeightTrendChart data={weightData} goalWeight={user.goalWeight} />

        <GlucoseTrendChart
          data={glucoseData}
          stats={glucoseStats}
          targetMin={user.glucoseMin ?? 70}
          targetMax={user.glucoseMax ?? 180}
        />

        {weightData.length === 0 && glucoseData.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border py-12 text-center">
            <p className="text-sm font-medium">No data to chart yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Log weight and glucose readings to see trends over time.
            </p>
          </div>
        )}

        <PatternCards patterns={patterns} />

        <AIChat />

        <DeepAnalysis />
      </div>
    </div>
  );
}
