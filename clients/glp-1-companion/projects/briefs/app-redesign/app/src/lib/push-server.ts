import webpush from "web-push";
import { createHmac } from "crypto";
import { db } from "@/lib/db";

// ─── VAPID Config ────────────────────────────────────────

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@glp1companion.app";
const ACTION_SECRET = process.env.CRON_SECRET!;

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// ─── Action Tokens (HMAC) ────────────────────────────────

export function createActionToken(payload: {
  userId: string;
  scheduleId: string;
  medName: string;
  dosage: string;
}): string {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const sig = createHmac("sha256", ACTION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyActionToken(token: string): {
  userId: string;
  scheduleId: string;
  medName: string;
  dosage: string;
} | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, sig] = parts;
  const expectedSig = createHmac("sha256", ACTION_SECRET)
    .update(encoded)
    .digest("base64url");

  if (sig !== expectedSig) return null;

  try {
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (!data.userId || !data.scheduleId || !data.medName || !data.dosage) return null;
    return data;
  } catch {
    return null;
  }
}

// ─── Send Push ───────────────────────────────────────────

type PushPayload = {
  title: string;
  body: string;
  tag: string;
  data: Record<string, unknown>;
};

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId },
  });

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      );
      sent++;
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 410 || statusCode === 404) {
        // Subscription expired or invalid — clean up
        await db.pushSubscription.delete({ where: { id: sub.id } });
      }
      failed++;
    }
  }

  return { sent, failed };
}
