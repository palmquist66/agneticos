import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const [medications, titrationSteps, injectionSites] = await Promise.all([
      db.medicationSchedule.findMany({
        where: { userId: user.id, active: true },
        orderBy: { createdAt: "desc" },
      }),
      db.titrationSchedule.findMany({
        where: { userId: user.id },
        orderBy: { order: "asc" },
      }),
      db.injectionSite.findMany({
        where: { userId: user.id },
        orderBy: { loggedAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      medications,
      titrationSteps,
      injectionSites,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/meds]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { medName, dosage, frequency, days, times, isGlp1 } = body;

    if (!medName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Medication name is required" },
        { status: 400 }
      );
    }
    if (!dosage?.trim()) {
      return NextResponse.json(
        { success: false, error: "Dosage is required" },
        { status: 400 }
      );
    }
    if (!frequency) {
      return NextResponse.json(
        { success: false, error: "Frequency is required" },
        { status: 400 }
      );
    }

    // If GLP-1, deactivate any existing GLP-1 schedule
    if (isGlp1) {
      await db.medicationSchedule.updateMany({
        where: { userId: user.id, isGlp1: true, active: true },
        data: { active: false },
      });
    }

    const schedule = await db.medicationSchedule.create({
      data: {
        userId: user.id,
        medName: medName.trim(),
        dosage: dosage.trim(),
        frequency,
        days: days || [],
        times: times || [],
        isGlp1: isGlp1 || false,
        active: true,
      },
    });

    return NextResponse.json({ success: true, schedule });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/meds]", error);
    return NextResponse.json(
      { success: false, error: "Failed to add medication" },
      { status: 500 }
    );
  }
}
