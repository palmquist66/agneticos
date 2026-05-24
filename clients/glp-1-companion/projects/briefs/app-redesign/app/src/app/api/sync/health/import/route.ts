import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  importHealthData,
  type HealthSource,
  type HealthImportInput,
} from "@/lib/health-import";

export const dynamic = "force-dynamic";

const VALID_SOURCES: HealthSource[] = ["apple_health", "health_connect"];

/**
 * POST /api/sync/health/import
 * Batch-import native health data (weight/glucose samples + daily activity
 * totals) from Apple Health or Android Health Connect. Idempotent: re-posting
 * the same window dedups on the composite unique constraints.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const source = body?.source as HealthSource;
    if (!VALID_SOURCES.includes(source)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing source" },
        { status: 400 }
      );
    }

    const input: HealthImportInput = {
      samples: Array.isArray(body?.samples) ? body.samples : [],
      dailyActivity: Array.isArray(body?.dailyActivity) ? body.dailyActivity : [],
    };

    const result = await importHealthData(user.id, source, input);

    return NextResponse.json({
      success: true,
      imported: result.imported,
      skipped: result.skipped,
      dateFrom: result.dateFrom?.toISOString() ?? null,
      dateTo: result.dateTo?.toISOString() ?? null,
      durationMs: result.durationMs,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/sync/health/import]", error);
    return NextResponse.json(
      { success: false, error: "Failed to import health data" },
      { status: 500 }
    );
  }
}
