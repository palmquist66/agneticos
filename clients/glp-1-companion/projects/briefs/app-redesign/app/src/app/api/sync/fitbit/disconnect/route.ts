import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { disconnectFitbit } from "@/lib/fitbit";

export const dynamic = "force-dynamic";

/** POST /api/sync/fitbit/disconnect — Disconnect Fitbit */
export async function POST() {
  try {
    const user = await getCurrentUser();
    await disconnectFitbit(user.id);
    return NextResponse.json({ status: "disconnected" });
  } catch (err) {
    console.error("Fitbit disconnect error:", err);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
