import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { goalWeight, proteinTarget, glucoseMin, glucoseMax } = body;

    await db.user.update({
      where: { id: user.id },
      data: {
        goalWeight: goalWeight ? parseFloat(goalWeight) : null,
        proteinTarget: proteinTarget ? parseInt(proteinTarget) : null,
        glucoseMin: glucoseMin ? parseInt(glucoseMin) : null,
        glucoseMax: glucoseMax ? parseInt(glucoseMax) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/onboarding/goals]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save goals" },
      { status: 500 }
    );
  }
}
