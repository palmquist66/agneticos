import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_SOURCES = ["apple_health", "health_connect"];

/**
 * POST /api/sync/health/connect
 * Marks a device health source as connected. Unlike Dexcom/Fitbit there are no
 * OAuth tokens — the data lives on-device and is granted via the OS permission
 * sheet. This just records that the user opted in (and which read scopes).
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));

    const source = body?.source as string;
    if (!VALID_SOURCES.includes(source)) {
      return NextResponse.json(
        { error: "Invalid or missing source" },
        { status: 400 }
      );
    }

    const scopes: string[] = Array.isArray(body?.grantedTypes)
      ? body.grantedTypes.filter((t: unknown) => typeof t === "string")
      : [];

    await db.dataSourceConnection.upsert({
      where: { userId_source: { userId: user.id, source } },
      create: { userId: user.id, source, status: "connected", scopes },
      update: { status: "connected", scopes, lastSyncError: null },
    });

    await db.syncLog.create({
      data: { userId: user.id, source, action: "connect", status: "success" },
    });

    return NextResponse.json({ status: "connected" });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/sync/health/connect]", err);
    return NextResponse.json({ error: "Failed to connect" }, { status: 500 });
  }
}
