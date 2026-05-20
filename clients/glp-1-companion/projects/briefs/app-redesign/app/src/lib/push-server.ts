import webpush from "web-push";
import { createHmac } from "crypto";
import { db } from "@/lib/db";

// ─── VAPID Config ────────────────────────────────────────

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  const email = process.env.VAPID_EMAIL || "mailto:admin@glp1companion.app";
  webpush.setVapidDetails(email, pub, priv);
  vapidConfigured = true;
  return true;
}

// ─── Action Tokens (HMAC) ────────────────────────────────

export function createActionToken(payload: {
  userId: string;
  scheduleId: string;
  medName: string;
  dosage: string;
}): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET not set");
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const sig = createHmac("sha256", secret).update(encoded).digest("base64url");
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
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const expectedSig = createHmac("sha256", secret)
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
  if (!ensureVapid()) return { sent: 0, failed: 0 };
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
