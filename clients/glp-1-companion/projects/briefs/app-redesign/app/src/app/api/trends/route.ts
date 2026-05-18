import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getWeightTrend,
  getGlucoseTrend,
  getPatternData,
  computeGlucoseStats,
  TIME_RANGE_DAYS,
} from "@/lib/trends-queries";
import { detectPatterns } from "@/lib/pattern-engine";
import type { TimeRange } from "@/lib/types/trends";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const rangeParam = request.nextUrl.searchParams.get("range") ?? "30d";
    const range = (
      Object.keys(TIME_RANGE_DAYS).includes(rangeParam) ? rangeParam : "30d"
    ) as TimeRange;
    const days = TIME_RANGE_DAYS[range];

    const [weight, glucose, patternData] = await Promise.all([
      getWeightTrend(user.id, days),
      getGlucoseTrend(user.id, days),
      getPatternData(user.id),
    ]);

    const glucoseMin = user.glucoseMin ?? 70;
    const glucoseMax = user.glucoseMax ?? 180;
    const glucoseStats = computeGlucoseStats(glucose, glucoseMin, glucoseMax);

    const patterns = detectPatterns({
      ...patternData,
      glp1Med: user.glp1Med,
      proteinTarget: user.proteinTarget,
    });

    return NextResponse.json({
      weight,
      glucose,
      glucoseStats,
      patterns,
      goalWeight: user.goalWeight,
      glucoseMin,
      glucoseMax,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/trends]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
