import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPushToUser, createActionToken } from "@/lib/push-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const dayName = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Start/end of today for checking existing logs
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Current time as HH:MM
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes();

    // Find all active schedules that have push subscriptions
    const schedules = await db.medicationSchedule.findMany({
      where: {
        active: true,
        user: {
          pushSubscriptions: { some: {} },
        },
      },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    let sent = 0;
    let skipped = 0;

    for (const schedule of schedules) {
      // Check if schedule applies today
      const appliesToday =
        schedule.frequency === "daily" ||
        ((schedule.frequency === "specific_days" || schedule.frequency === "weekly") &&
          schedule.days.includes(dayName));

      if (!appliesToday) {
        skipped++;
        continue;
      }

      // Check if any scheduled time matches current time (within 5-min window)
      // Handles both "17:53" and "1753" formats
      const timeMatch = schedule.times.some((time) => {
        let h: number, m: number;
        if (time.includes(":")) {
          [h, m] = time.split(":").map(Number);
        } else {
          h = parseInt(time.slice(0, -2), 10);
          m = parseInt(time.slice(-2), 10);
        }
        return (
          h.toString().padStart(2, "0") === currentHour &&
          Math.abs(m - currentMinute) <= 2
        );
      });

      if (!timeMatch) {
        skipped++;
        continue;
      }

      // Check how many doses taken today vs how many scheduled
      const todayLogs = await db.medicationLog.count({
        where: {
          userId: schedule.userId,
          scheduleId: schedule.id,
          loggedAt: { gte: todayStart, lte: todayEnd },
          status: "taken",
        },
      });

      if (todayLogs >= schedule.times.length) {
        skipped++;
        continue;
      }

      // Create action token for SW to use
      const actionToken = createActionToken({
        userId: schedule.userId,
        scheduleId: schedule.id,
        medName: schedule.medName,
        dosage: schedule.dosage,
      });

      const result = await sendPushToUser(schedule.userId, {
        title: "Medication Reminder",
        body: `Time to take ${schedule.medName} ${schedule.dosage}`,
        tag: `med-${schedule.id}`,
        data: {
          actionToken,
          scheduleId: schedule.id,
          medName: schedule.medName,
          dosage: schedule.dosage,
        },
      });

      sent += result.sent;
    }

    return NextResponse.json({ sent, skipped, checked: schedules.length });
  } catch (error) {
    console.error("Notification send error:", error);
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 }
    );
  }
}
