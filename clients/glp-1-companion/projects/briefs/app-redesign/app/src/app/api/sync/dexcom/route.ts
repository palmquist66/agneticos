import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import { getDexcomAuthUrl } from "@/lib/dexcom";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/** GET /api/sync/dexcom — Initiate Dexcom OAuth flow */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate CSRF state token
  const state = randomBytes(32).toString("hex");

  // Store state in a cookie for validation on callback
  const cookieStore = await cookies();
  cookieStore.set("dexcom_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const authUrl = getDexcomAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
