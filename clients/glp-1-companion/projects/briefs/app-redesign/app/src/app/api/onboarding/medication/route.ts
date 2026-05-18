import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { glp1Med, glp1Dosage } = body;

    await db.user.update({
      where: { id: user.id },
      data: {
        glp1Med: glp1Med?.trim() || null,
        glp1Dosage: glp1Dosage?.trim() || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/onboarding/medication]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save medication" },
      { status: 500 }
    );
  }
}
