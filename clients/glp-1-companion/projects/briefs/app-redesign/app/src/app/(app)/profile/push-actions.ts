"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function savePushSubscription(data: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}) {
  const user = await getCurrentUser();

  await db.pushSubscription.upsert({
    where: { endpoint: data.endpoint },
    create: {
      userId: user.id,
      endpoint: data.endpoint,
      p256dh: data.p256dh,
      auth: data.auth,
      userAgent: data.userAgent ?? null,
    },
    update: {
      p256dh: data.p256dh,
      auth: data.auth,
      userAgent: data.userAgent ?? null,
    },
  });

  return { success: true };
}

export async function removePushSubscription(endpoint: string) {
  const user = await getCurrentUser();

  await db.pushSubscription.deleteMany({
    where: { userId: user.id, endpoint },
  });

  return { success: true };
}
