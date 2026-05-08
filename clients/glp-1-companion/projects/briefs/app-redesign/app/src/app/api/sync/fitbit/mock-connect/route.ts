import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

/**
 * GET /api/sync/fitbit/mock-connect
 * DEV ONLY — simulates a successful Fitbit OAuth callback.
 * Creates a connected DataSourceConnection with fake tokens
 * and inserts sample weight readings so the UI can be tested.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const user = await getCurrentUser();

    // Create/update connection with fake tokens (8-hour expiry like real Fitbit)
    await db.dataSourceConnection.upsert({
      where: { userId_source: { userId: user.id, source: "fitbit" } },
      create: {
        userId: user.id,
        source: "fitbit",
        status: "connected",
        accessToken: encrypt("mock-fitbit-access-token"),
        refreshToken: encrypt("mock-fitbit-refresh-token"),
        tokenExpiresAt: new Date(Date.now() + 28800 * 1000),
        scopes: ["weight"],
      },
      update: {
        status: "connected",
        accessToken: encrypt("mock-fitbit-access-token"),
        refreshToken: encrypt("mock-fitbit-refresh-token"),
        tokenExpiresAt: new Date(Date.now() + 28800 * 1000),
        scopes: ["weight"],
        lastSyncError: null,
      },
    });

    // Insert sample weight readings (simulating 30 days of daily weigh-ins)
    const now = Date.now();
    const readings = [];
    const startWeight = 215; // starting weight in lbs

    for (let i = 0; i < 30; i++) {
      const daysAgo = 29 - i;
      const loggedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      // Set time to 7:30 AM (typical weigh-in time)
      loggedAt.setHours(7, 30, 0, 0);

      // Simulate gradual weight loss with daily variance (~0.1-0.3 lbs/day trend)
      const trend = -0.2 * i; // ~6 lbs lost over 30 days
      const noise = (Math.random() - 0.5) * 2; // +/- 1 lb daily variance
      const weight = Math.round((startWeight + trend + noise) * 10) / 10;

      readings.push({
        userId: user.id,
        weight,
        source: "fitbit" as const,
        loggedAt,
      });
    }

    // Deduplicate — skip any that already exist
    let imported = 0;
    for (const reading of readings) {
      const existing = await db.weightLog.findFirst({
        where: {
          userId: user.id,
          loggedAt: reading.loggedAt,
          source: "fitbit",
        },
      });
      if (!existing) {
        await db.weightLog.create({ data: reading });
        imported++;
      }
    }

    // Update sync metadata
    await db.dataSourceConnection.update({
      where: { userId_source: { userId: user.id, source: "fitbit" } },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "success",
        lastSyncRecords: imported,
      },
    });

    await db.syncLog.create({
      data: {
        userId: user.id,
        source: "fitbit",
        action: "connect",
        status: "success",
        recordCount: imported,
      },
    });

    return NextResponse.redirect(
      new URL("/profile?fitbit=connected", "http://localhost:3000")
    );
  } catch (err) {
    console.error("Fitbit mock connect error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
