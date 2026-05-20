import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getGlp1Status,
  getTodayScheduledMeds,
  getTodayNumbers,
  getRecentActivity,
} from "@/lib/today-queries";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const [glp1Status, scheduledMeds, numbers, recentActivity] =
      await Promise.all([
        getGlp1Status(user.id, user.glp1Med, user.glp1Dosage),
        getTodayScheduledMeds(user.id),
        getTodayNumbers(user.id, user.proteinTarget),
        getRecentActivity(user.id),
      ]);

    return NextResponse.json({
      glp1Status,
      scheduledMeds,
      todaysNumbers: numbers,
      recentActivity,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/today]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
