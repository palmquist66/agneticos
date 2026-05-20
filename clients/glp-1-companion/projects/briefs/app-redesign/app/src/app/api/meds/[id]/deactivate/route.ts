import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await props.params;

    await db.medicationSchedule.update({
      where: { id, userId: user.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/meds/[id]/deactivate]", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate medication" },
      { status: 500 }
    );
  }
}
