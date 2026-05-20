import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { symptoms, severity, notes } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one symptom" },
        { status: 400 }
      );
    }

    if (!severity) {
      return NextResponse.json(
        { success: false, error: "Please select severity" },
        { status: 400 }
      );
    }

    const now = new Date();

    await db.$transaction(
      symptoms.map((symptom: string) =>
        db.sideEffect.create({
          data: {
            userId: user.id,
            symptom,
            severity,
            notes: notes || undefined,
            loggedAt: now,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/log/side-effect]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save side effects" },
      { status: 500 }
    );
  }
}
