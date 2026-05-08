import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { exchangeCode, storeFitbitConnection, syncFitbitWeight } from "@/lib/fitbit";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/** GET /api/sync/fitbit/callback — Fitbit OAuth callback */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle user denial
    if (error) {
      return NextResponse.redirect(
        new URL("/profile?fitbit=denied", request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/profile?fitbit=error&reason=missing_params", request.url)
      );
    }

    // Validate CSRF state
    const cookieStore = await cookies();
    const savedState = cookieStore.get("fitbit_oauth_state")?.value;
    const codeVerifier = cookieStore.get("fitbit_code_verifier")?.value;
    cookieStore.delete("fitbit_oauth_state");
    cookieStore.delete("fitbit_code_verifier");

    if (!savedState || savedState !== state) {
      return NextResponse.redirect(
        new URL("/profile?fitbit=error&reason=invalid_state", request.url)
      );
    }

    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL("/profile?fitbit=error&reason=missing_verifier", request.url)
      );
    }

    // Exchange code for tokens (with PKCE verifier)
    const tokens = await exchangeCode(code, codeVerifier);

    // Store encrypted tokens
    await storeFitbitConnection(user.id, tokens);

    // Trigger initial sync (last 30 days) — non-blocking
    syncFitbitWeight(user.id).catch((err) => {
      console.error("Initial Fitbit sync failed:", err);
    });

    return NextResponse.redirect(
      new URL("/profile?fitbit=connected", request.url)
    );
  } catch (err) {
    console.error("Fitbit callback error:", err);
    return NextResponse.redirect(
      new URL("/profile?fitbit=error&reason=exchange_failed", request.url)
    );
  }
}
