import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { value, context, notes } = body;

    if (!value || isNaN(value) || value < 40 || value > 600) {
      return NextResponse.json(
        { success: false, error: "Glucose must be between 40 and 600 mg/dL" },
        { status: 400 }
      );
    }

    if (!context) {
      return NextResponse.json(
        { success: false, error: "Please select a context" },
        { status: 400 }
      );
    }

    await db.glucoseLog.create({
      data: {
        userId: user.id,
        value: parseFloat(value),
        context,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/log/glucose]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save glucose reading" },
      { status: 500 }
    );
  }
}
