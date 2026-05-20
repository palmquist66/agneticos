import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { site, notes } = body;

    if (!user.glp1Med || !user.glp1Dosage) {
      return NextResponse.json(
        { success: false, error: "No GLP-1 medication configured" },
        { status: 400 }
      );
    }

    if (!site) {
      return NextResponse.json(
        { success: false, error: "Please select an injection site" },
        { status: 400 }
      );
    }

    const now = new Date();

    const schedule = await db.medicationSchedule.findFirst({
      where: { userId: user.id, isGlp1: true, active: true },
    });

    await db.$transaction([
      db.medicationLog.create({
        data: {
          userId: user.id,
          scheduleId: schedule?.id,
          medName: user.glp1Med,
          dosage: user.glp1Dosage,
          status: "taken",
          notes: notes || undefined,
          loggedAt: now,
        },
      }),
      db.injectionSite.create({
        data: {
          userId: user.id,
          site,
          loggedAt: now,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/log/glp1-dose]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save dose" },
      { status: 500 }
    );
  }
}
