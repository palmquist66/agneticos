import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await props.params;

    const schedule = await db.medicationSchedule.findFirst({
      where: { id, userId: user.id },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const logs = await db.medicationLog.findMany({
      where: { userId: user.id, scheduleId: id },
      orderBy: { loggedAt: "desc" },
      take: 30,
    });

    const taken = logs.filter((l) => l.status === "taken").length;
    const missed = logs.filter((l) => l.status === "missed").length;
    const skipped = logs.filter((l) => l.status === "skipped").length;
    const total = logs.length;
    const rate = total > 0 ? Math.round((taken / total) * 100) : 0;

    return NextResponse.json({
      schedule,
      logs,
      adherence: { rate, taken, missed, skipped, total },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/meds/[id]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await props.params;
    const body = await request.json();
    const { dosage, frequency, days, times } = body;

    if (!dosage?.trim()) {
      return NextResponse.json(
        { success: false, error: "Dosage is required" },
        { status: 400 }
      );
    }

    await db.medicationSchedule.update({
      where: { id, userId: user.id },
      data: {
        dosage: dosage.trim(),
        ...(frequency && { frequency }),
        ...(days && { days }),
        ...(times && { times }),
      },
    });

    // If GLP-1, sync dosage back to user profile
    const schedule = await db.medicationSchedule.findFirst({
      where: { id, userId: user.id },
    });
    if (schedule?.isGlp1) {
      await db.user.update({
        where: { id: user.id },
        data: { glp1Dosage: dosage.trim() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[PATCH /api/meds/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update medication" },
      { status: 500 }
    );
  }
}
