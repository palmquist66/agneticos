import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/sync/status — Get all data source connection statuses */
export async function GET() {
  try {
    const user = await getCurrentUser();

    const connections = await db.dataSourceConnection.findMany({
      where: { userId: user.id },
    });

    const connMap = new Map(connections.map((c) => [c.source, c]));

    // Count total records per source
    const [dexcomCount, fitbitCount] = await Promise.all([
      connMap.has("dexcom")
        ? db.glucoseLog.count({
            where: { userId: user.id, source: "dexcom" },
          })
        : 0,
      connMap.has("fitbit")
        ? db.weightLog.count({
            where: { userId: user.id, source: "fitbit" },
          })
        : 0,
    ]);

    const sources = [
      {
        source: "dexcom",
        status: connMap.get("dexcom")?.status || "not_connected",
        lastSyncAt: connMap.get("dexcom")?.lastSyncAt?.toISOString() || null,
        lastSyncStatus: connMap.get("dexcom")?.lastSyncStatus || null,
        lastSyncRecords: connMap.get("dexcom")?.lastSyncRecords || null,
        lastSyncError: connMap.get("dexcom")?.lastSyncError || null,
        totalRecords: dexcomCount,
      },
      {
        source: "fitbit",
        status: connMap.get("fitbit")?.status || "not_connected",
        lastSyncAt: connMap.get("fitbit")?.lastSyncAt?.toISOString() || null,
        lastSyncStatus: connMap.get("fitbit")?.lastSyncStatus || null,
        lastSyncRecords: connMap.get("fitbit")?.lastSyncRecords || null,
        lastSyncError: connMap.get("fitbit")?.lastSyncError || null,
        totalRecords: fitbitCount,
      },
      {
        source: "apple_health",
        status: "not_connected",
        available: false,
        reason: "Requires iOS app",
      },
    ];

    return NextResponse.json({ sources });
  } catch (err) {
    console.error("Sync status error:", err);
    return NextResponse.json(
      { error: "Failed to fetch sync status" },
      { status: 500 }
    );
  }
}
