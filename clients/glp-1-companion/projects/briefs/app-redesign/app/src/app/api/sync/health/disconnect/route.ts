import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_SOURCES = ["apple_health", "health_connect"];

/**
 * POST /api/sync/health/disconnect
 * Marks a device health source as disconnected. Already-imported logs are kept
 * (matches the Dexcom disconnect behavior — only the connection status flips).
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

    await db.dataSourceConnection.updateMany({
      where: { userId: user.id, source },
      data: { status: "disconnected" },
    });

    await db.syncLog.create({
      data: { userId: user.id, source, action: "disconnect", status: "success" },
    });

    return NextResponse.json({ status: "disconnected" });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/sync/health/disconnect]", err);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
