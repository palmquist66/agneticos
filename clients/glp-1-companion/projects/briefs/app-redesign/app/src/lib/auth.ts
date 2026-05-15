import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();

  // DEMO MODE: no auth session — return the first user in the DB
  if (!clerkId && process.env.DEMO_MODE === "true") {
    const demoUser = await db.user.findFirst();
    if (demoUser) return demoUser;
    throw new Error("No users in database for demo mode");
  }

  if (!clerkId) throw new Error("Unauthorized");

  const existing = await db.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  // First visit — create DB record from Clerk profile
  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses[0]?.emailAddress ??
    `${clerkId}@placeholder.local`;

  try {
    return await db.user.create({
      data: {
        clerkId,
        email,
        name: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
      },
    });
  } catch (e: unknown) {
    console.error("[getCurrentUser] Failed to create user:", {
      clerkId,
      email,
      error: e instanceof Error ? e.message : e,
    });

    // Handle uniqueness conflict (re-signup with same email or clerkId race condition)
    if (
      e instanceof Error &&
      (e.message.includes("Unique constraint") ||
        e.message.includes("unique constraint") ||
        e.message.includes("duplicate key"))
    ) {
      // Another request may have created the user — try fetching again
      const retry = await db.user.findUnique({ where: { clerkId } });
      if (retry) return retry;

      // Email exists under a different clerkId — reassign
      const byEmail = await db.user.findUnique({ where: { email } });
      if (byEmail) {
        return db.user.update({
          where: { id: byEmail.id },
          data: { clerkId },
        });
      }
    }
    throw e;
  }
}
