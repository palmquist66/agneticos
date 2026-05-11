import { db } from "@/lib/db";
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

    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json(
      { status: "error" },
      { status: 500 },
    );
  }
}
