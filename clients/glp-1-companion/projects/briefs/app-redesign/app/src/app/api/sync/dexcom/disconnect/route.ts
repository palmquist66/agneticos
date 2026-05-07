import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { disconnectDexcom } from "@/lib/dexcom";

export const dynamic = "force-dynamic";

/** POST /api/sync/dexcom/disconnect — Disconnect Dexcom */
export async function POST() {
  try {
    const user = await getCurrentUser();
    await disconnectDexcom(user.id);
    return NextResponse.json({ status: "disconnected" });
  } catch (err) {
    console.error("Dexcom disconnect error:", err);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
