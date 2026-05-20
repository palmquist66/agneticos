import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/sync/test-backdate
 * DEV ONLY — backdates lastSyncAt on all connected sources by 20 minutes
 * so auto-sync treats them as stale on next page load.
 */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const user = await getCurrentUser();

    const connections = await db.dataSourceConnection.findMany({
      where: { userId: user.id, status: "connected" },
    });

    if (connections.length === 0) {
      return NextResponse.json({
        message: "No connected sources. Run mock-connect first.",
        updated: [],
      });
    }

    const twentyMinAgo = new Date(Date.now() - 20 * 60 * 1000);
    const updated: string[] = [];

    for (const conn of connections) {
      await db.dataSourceConnection.update({
        where: { id: conn.id },
        data: { lastSyncAt: twentyMinAgo },
      });
      updated.push(conn.source);
    }

    return NextResponse.json({
      message: `Backdated ${updated.length} source(s) to ${twentyMinAgo.toISOString()}`,
      updated,
      lastSyncAt: twentyMinAgo.toISOString(),
    });
  } catch (err) {
    console.error("Test backdate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
