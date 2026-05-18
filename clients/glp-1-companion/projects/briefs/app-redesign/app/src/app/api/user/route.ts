import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      glp1Med: user.glp1Med,
      glp1Dosage: user.glp1Dosage,
      goalWeight: user.goalWeight,
      proteinTarget: user.proteinTarget,
      glucoseMin: user.glucoseMin,
      glucoseMax: user.glucoseMax,
      onboarded: user.onboarded,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/user]", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
