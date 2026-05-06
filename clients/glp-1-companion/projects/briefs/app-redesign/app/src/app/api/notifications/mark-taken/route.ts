import { NextResponse } from "next/server";
import { verifyActionToken } from "@/lib/push-server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const payload = verifyActionToken(body.token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  // Check if all doses already taken today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const schedule = await db.medicationSchedule.findUnique({
    where: { id: payload.scheduleId },
    select: { times: true },
  });

  const todayCount = await db.medicationLog.count({
    where: {
      userId: payload.userId,
      scheduleId: payload.scheduleId,
      loggedAt: { gte: todayStart, lte: todayEnd },
      status: "taken",
    },
  });

  const maxDoses = schedule?.times.length ?? 1;
  if (todayCount >= maxDoses) {
    return NextResponse.json({ ok: true, message: "All doses already logged" });
  }

  await db.medicationLog.create({
    data: {
      userId: payload.userId,
      scheduleId: payload.scheduleId,
      medName: payload.medName,
      dosage: payload.dosage,
      status: "taken",
      loggedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
