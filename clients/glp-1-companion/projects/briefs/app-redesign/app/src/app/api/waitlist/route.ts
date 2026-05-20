import { db } from "@/lib/db";
import { sendWaitlistConfirmation } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ status: "invalid" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ status: "invalid" }, { status: 400 });
    }

    const existing = await db.waitlist.findUnique({
      where: { email: trimmed },
    });

    if (existing) {
      return NextResponse.json({ status: "duplicate" });
    }

    await db.waitlist.create({
      data: { email: trimmed, source: "landing" },
    });

    // Fire-and-forget — don't block the response on email delivery
    sendWaitlistConfirmation(trimmed).catch((err) =>
      console.error("[waitlist] email failed:", err)
    );

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return NextResponse.json(
      { status: "error", message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
