import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { weight, notes } = body;

    if (!weight || isNaN(weight) || weight < 50 || weight > 500) {
      return NextResponse.json(
        { success: false, error: "Weight must be between 50 and 500 lbs" },
        { status: 400 }
      );
    }

    await db.weightLog.create({
      data: { userId: user.id, weight: parseFloat(weight), notes: notes || undefined },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/log/weight]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save weight" },
      { status: 500 }
    );
  }
}
