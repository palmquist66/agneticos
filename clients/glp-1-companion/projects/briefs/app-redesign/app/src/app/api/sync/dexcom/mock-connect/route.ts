import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

/**
 * GET /api/sync/dexcom/mock-connect
 * DEV ONLY — simulates a successful Dexcom OAuth callback.
 * Creates a connected DataSourceConnection with fake tokens
 * and inserts sample glucose readings so the UI can be tested.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const user = await getCurrentUser();

    // Create/update connection with fake tokens
    await db.dataSourceConnection.upsert({
      where: { userId_source: { userId: user.id, source: "dexcom" } },
      create: {
        userId: user.id,
        source: "dexcom",
        status: "connected",
        accessToken: encrypt("mock-access-token"),
        refreshToken: encrypt("mock-refresh-token"),
        tokenExpiresAt: new Date(Date.now() + 7200 * 1000),
        scopes: ["offline_access"],
      },
      update: {
        status: "connected",
        accessToken: encrypt("mock-access-token"),
        refreshToken: encrypt("mock-refresh-token"),
        tokenExpiresAt: new Date(Date.now() + 7200 * 1000),
        scopes: ["offline_access"],
        lastSyncError: null,
      },
    });

    // Insert sample glucose readings (simulating a 24-hour Dexcom sync)
    const now = Date.now();
    const readings = [];
    for (let i = 0; i < 288; i++) {
      // 288 readings = every 5 min for 24 hours
      const minutesAgo = i * 5;
      const loggedAt = new Date(now - minutesAgo * 60 * 1000);

      // Simulate realistic glucose curve (70-180 range with meal spikes)
      const hour = loggedAt.getHours();
      let base = 100;
      if (hour >= 7 && hour <= 9) base = 140; // breakfast spike
      if (hour >= 12 && hour <= 14) base = 155; // lunch spike
      if (hour >= 18 && hour <= 20) base = 145; // dinner spike
      if (hour >= 0 && hour <= 5) base = 90; // overnight low

      const noise = Math.round((Math.random() - 0.5) * 30);
      const value = Math.max(65, Math.min(200, base + noise));

      const trends = ["flat", "rising_slightly", "falling_slightly", "rising", "falling"];
      const trend = trends[Math.floor(Math.random() * trends.length)];

      readings.push({
        userId: user.id,
        value,
        context: trend,
        source: "dexcom" as const,
        loggedAt,
        metadata: {
          trendRate: (Math.random() - 0.5) * 4,
          recordId: `mock-${i}`,
          unit: "mg/dL",
          mock: true,
        },
      });
    }

    // Deduplicate — skip any that already exist
    let imported = 0;
    for (const reading of readings) {
      const existing = await db.glucoseLog.findFirst({
        where: {
          userId: user.id,
          loggedAt: reading.loggedAt,
          source: "dexcom",
        },
      });
      if (!existing) {
        await db.glucoseLog.create({ data: reading });
        imported++;
      }
    }

    // Update sync metadata
    await db.dataSourceConnection.update({
      where: { userId_source: { userId: user.id, source: "dexcom" } },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "success",
        lastSyncRecords: imported,
      },
    });

    await db.syncLog.create({
      data: {
        userId: user.id,
        source: "dexcom",
        action: "connect",
        status: "success",
        recordCount: imported,
      },
    });

    return NextResponse.redirect(
      new URL("/profile?dexcom=connected", "http://localhost:3000")
    );
  } catch (err) {
    console.error("Mock connect error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
