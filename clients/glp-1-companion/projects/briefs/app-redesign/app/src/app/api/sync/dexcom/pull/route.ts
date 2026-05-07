import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { syncDexcomGlucose } from "@/lib/dexcom";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** POST /api/sync/dexcom/pull — Manually trigger Dexcom sync */
export async function POST() {
  try {
    const user = await getCurrentUser();

    // Rate limit: no more than 1 sync per 5 minutes
    const connection = await db.dataSourceConnection.findUnique({
      where: { userId_source: { userId: user.id, source: "dexcom" } },
    });

    if (!connection || connection.status === "disconnected") {
      return NextResponse.json(
        { error: "Dexcom is not connected" },
        { status: 400 }
      );
    }

    if (connection.lastSyncAt) {
      const minsSinceSync = (Date.now() - connection.lastSyncAt.getTime()) / (1000 * 60);
      if (minsSinceSync < 5) {
        return NextResponse.json(
          { error: "Please wait a few minutes between syncs", retryAfterSecs: Math.ceil((5 - minsSinceSync) * 60) },
          { status: 429 }
        );
      }
    }

    const result = await syncDexcomGlucose(user.id);

    return NextResponse.json({
      status: "success",
      imported: result.imported,
      skipped: result.skipped,
      dateFrom: result.dateFrom.toISOString(),
      dateTo: result.dateTo.toISOString(),
      durationMs: result.durationMs,
    });
  } catch (err) {
    console.error("Dexcom sync error:", err);

    const message = err instanceof Error ? err.message : "Sync failed";
    const needsReconnect = message.includes("reconnection needed") || message.includes("expired");

    return NextResponse.json(
      { error: message, needsReconnect },
      { status: needsReconnect ? 401 : 500 }
    );
  }
}
