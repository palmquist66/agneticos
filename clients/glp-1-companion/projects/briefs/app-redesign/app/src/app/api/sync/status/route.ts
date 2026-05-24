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

    // Count total records per source.
    // Device-health sources (apple_health / health_connect) span weight,
    // glucose, and activity logs.
    const countDeviceHealth = async (source: string) => {
      if (!connMap.has(source)) return 0;
      const [w, g, a] = await Promise.all([
        db.weightLog.count({ where: { userId: user.id, source } }),
        db.glucoseLog.count({ where: { userId: user.id, source } }),
        db.activityLog.count({ where: { userId: user.id, source } }),
      ]);
      return w + g + a;
    };

    const [dexcomCount, fitbitCount, appleHealthCount, healthConnectCount] =
      await Promise.all([
        connMap.has("dexcom")
          ? db.glucoseLog.count({ where: { userId: user.id, source: "dexcom" } })
          : 0,
        connMap.has("fitbit")
          ? db.weightLog.count({ where: { userId: user.id, source: "fitbit" } })
          : 0,
        countDeviceHealth("apple_health"),
        countDeviceHealth("health_connect"),
      ]);

    const describe = (source: string, totalRecords: number, available: boolean) => ({
      source,
      status: connMap.get(source)?.status || "not_connected",
      available,
      lastSyncAt: connMap.get(source)?.lastSyncAt?.toISOString() || null,
      lastSyncStatus: connMap.get(source)?.lastSyncStatus || null,
      lastSyncRecords: connMap.get(source)?.lastSyncRecords ?? null,
      lastSyncError: connMap.get(source)?.lastSyncError || null,
      totalRecords,
    });

    const sources = [
      describe("dexcom", dexcomCount, true),
      describe("fitbit", fitbitCount, true),
      // Native device sources are now live via the mobile app. The client
      // decides which to surface based on platform (Apple Health on iOS,
      // Health Connect on Android).
      describe("apple_health", appleHealthCount, true),
      describe("health_connect", healthConnectCount, true),
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
