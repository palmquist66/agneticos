import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import { getFitbitAuthUrl, generateCodeVerifier } from "@/lib/fitbit";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/** GET /api/sync/fitbit — Initiate Fitbit OAuth flow with PKCE */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate CSRF state token
  const state = randomBytes(32).toString("hex");

  // Generate PKCE code verifier
  const codeVerifier = generateCodeVerifier();

  // Store state and code verifier in cookies for validation on callback
  const cookieStore = await cookies();
  cookieStore.set("fitbit_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  cookieStore.set("fitbit_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const authUrl = getFitbitAuthUrl(state, codeVerifier);
  return NextResponse.redirect(authUrl);
}
