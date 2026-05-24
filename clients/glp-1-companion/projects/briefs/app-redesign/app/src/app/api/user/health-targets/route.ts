import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const goalWeight =
      body.goalWeight != null ? parseFloat(body.goalWeight) : null;
    const proteinTarget =
      body.proteinTarget != null ? parseInt(body.proteinTarget, 10) : null;
    const glucoseMin =
      body.glucoseMin != null ? parseInt(body.glucoseMin, 10) : null;
    const glucoseMax =
      body.glucoseMax != null ? parseInt(body.glucoseMax, 10) : null;

    // Validate goal weight
    if (goalWeight !== null && (isNaN(goalWeight) || goalWeight < 50 || goalWeight > 500)) {
      return NextResponse.json(
        { success: false, error: "Goal weight must be between 50 and 500 lbs" },
        { status: 400 }
      );
    }

    // Validate protein target
    if (proteinTarget !== null && (isNaN(proteinTarget) || proteinTarget < 20 || proteinTarget > 500)) {
      return NextResponse.json(
        { success: false, error: "Protein target must be between 20 and 500g" },
        { status: 400 }
      );
    }

    // Validate glucose min
    if (glucoseMin !== null && (isNaN(glucoseMin) || glucoseMin < 40 || glucoseMin > 200)) {
      return NextResponse.json(
        { success: false, error: "Glucose min must be between 40 and 200 mg/dL" },
        { status: 400 }
      );
    }

    // Validate glucose max
    if (glucoseMax !== null && (isNaN(glucoseMax) || glucoseMax < 100 || glucoseMax > 400)) {
      return NextResponse.json(
        { success: false, error: "Glucose max must be between 100 and 400 mg/dL" },
        { status: 400 }
      );
    }

    // Validate glucose range
    if (glucoseMin !== null && glucoseMax !== null && glucoseMin >= glucoseMax) {
      return NextResponse.json(
        { success: false, error: "Glucose min must be less than max" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: { goalWeight, proteinTarget, glucoseMin, glucoseMax },
      select: { goalWeight: true, proteinTarget: true, glucoseMin: true, glucoseMax: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[PUT /api/user/health-targets]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update health targets" },
      { status: 500 }
    );
  }
}
