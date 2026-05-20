import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { name, calories, protein, carbs, fat, mealType, inputMethod, servings, notes } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Food name is required" },
        { status: 400 }
      );
    }

    await db.foodLog.create({
      data: {
        userId: user.id,
        name: name.trim(),
        calories: calories ? parseFloat(calories) : null,
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fat: fat ? parseFloat(fat) : null,
        mealType: mealType || null,
        inputMethod: inputMethod || "text",
        servings: servings ? parseFloat(servings) : null,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/log/food]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save food log" },
      { status: 500 }
    );
  }
}
