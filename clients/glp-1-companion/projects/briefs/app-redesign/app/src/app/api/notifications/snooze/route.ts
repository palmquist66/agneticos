import { NextResponse } from "next/server";
import { verifyActionToken, sendPushToUser, createActionToken } from "@/lib/push-server";

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

  // Schedule re-send after 15 minutes
  setTimeout(async () => {
    const newToken = createActionToken({
      userId: payload.userId,
      scheduleId: payload.scheduleId,
      medName: payload.medName,
      dosage: payload.dosage,
    });

    await sendPushToUser(payload.userId, {
      title: "Medication Reminder (Snoozed)",
      body: `Reminder: take ${payload.medName} ${payload.dosage}`,
      tag: `med-${payload.scheduleId}`,
      data: {
        actionToken: newToken,
        scheduleId: payload.scheduleId,
        medName: payload.medName,
        dosage: payload.dosage,
      },
    });
  }, 15 * 60 * 1000);

  return NextResponse.json({ ok: true, snoozedMinutes: 15 });
}
