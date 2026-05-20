import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { token, platform } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 400 }
      );
    }

    if (platform !== "ios" && platform !== "android") {
      return NextResponse.json(
        { error: "Platform must be 'ios' or 'android'" },
        { status: 400 }
      );
    }

    await db.deviceToken.upsert({
      where: { token },
      create: {
        userId: user.id,
        token,
        platform,
        active: true,
      },
      update: {
        userId: user.id,
        platform,
        active: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/notifications/device-token]", error);
    return NextResponse.json(
      { error: "Failed to register device token" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 400 }
      );
    }

    await db.deviceToken.deleteMany({
      where: { userId: user.id, token },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[DELETE /api/notifications/device-token]", error);
    return NextResponse.json(
      { error: "Failed to remove device token" },
      { status: 500 }
    );
  }
}
