import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const user = await getCurrentUser();

    await db.user.update({
      where: { id: user.id },
      data: { onboarded: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/onboarding/complete]", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
