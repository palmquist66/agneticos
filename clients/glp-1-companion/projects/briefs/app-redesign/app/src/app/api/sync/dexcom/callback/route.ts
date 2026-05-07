import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { exchangeCode, storeDexcomConnection, syncDexcomGlucose } from "@/lib/dexcom";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/** GET /api/sync/dexcom/callback — Dexcom OAuth callback */
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
        new URL("/profile?dexcom=denied", request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/profile?dexcom=error&reason=missing_params", request.url)
      );
    }

    // Validate CSRF state
    const cookieStore = await cookies();
    const savedState = cookieStore.get("dexcom_oauth_state")?.value;
    cookieStore.delete("dexcom_oauth_state");

    if (!savedState || savedState !== state) {
      return NextResponse.redirect(
        new URL("/profile?dexcom=error&reason=invalid_state", request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCode(code);

    // Store encrypted tokens
    await storeDexcomConnection(user.id, tokens);

    // Trigger initial sync (last 30 days) — non-blocking
    syncDexcomGlucose(user.id).catch((err) => {
      console.error("Initial Dexcom sync failed:", err);
    });

    return NextResponse.redirect(
      new URL("/profile?dexcom=connected", request.url)
    );
  } catch (err) {
    console.error("Dexcom callback error:", err);
    return NextResponse.redirect(
      new URL("/profile?dexcom=error&reason=exchange_failed", request.url)
    );
  }
}
