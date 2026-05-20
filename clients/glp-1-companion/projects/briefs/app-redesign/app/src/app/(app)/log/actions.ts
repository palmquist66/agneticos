"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Weight ──────────────────────────────────────────────

export async function logWeight(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const weight = parseFloat(formData.get("weight") as string);
    const notes = (formData.get("notes") as string) || undefined;

    if (isNaN(weight) || weight < 50 || weight > 500) {
      return { success: false, error: "Weight must be between 50 and 500 lbs" };
    }

    await db.weightLog.create({
      data: { userId: user.id, weight, notes },
    });

    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save weight" };
  }
}

// ─── Glucose ─────────────────────────────────────────────

export async function logGlucose(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const value = parseFloat(formData.get("value") as string);
    const context = formData.get("context") as string;
    const notes = (formData.get("notes") as string) || undefined;

    if (isNaN(value) || value < 40 || value > 600) {
      return {
        success: false,
        error: "Glucose must be between 40 and 600 mg/dL",
      };
    }

    if (!context) {
      return { success: false, error: "Please select a context" };
    }

    await db.glucoseLog.create({
      data: { userId: user.id, value, context, notes },
    });

    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save glucose reading" };
  }
}

// ─── Side Effect ─────────────────────────────────────────

export async function logSideEffect(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const symptomsRaw = formData.get("symptoms") as string;
    const severity = formData.get("severity") as string;
    const notes = (formData.get("notes") as string) || undefined;

    const symptoms = symptomsRaw ? symptomsRaw.split(",") : [];

    if (symptoms.length === 0) {
      return { success: false, error: "Please select at least one symptom" };
    }
    if (!severity) {
      return { success: false, error: "Please select severity" };
    }

    const now = new Date();

    await db.$transaction(
      symptoms.map((symptom) =>
        db.sideEffect.create({
          data: {
            userId: user.id,
            symptom,
            severity,
            notes,
            loggedAt: now,
          },
        })
      )
    );

    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save side effects" };
  }
}

// ─── GLP-1 Dose ──────────────────────────────────────────

export async function logGlp1Dose(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const site = formData.get("site") as string;
    const notes = (formData.get("notes") as string) || undefined;

    if (!user.glp1Med || !user.glp1Dosage) {
      return {
        success: false,
        error: "No GLP-1 medication configured. Set it up in Profile first.",
      };
    }

    if (!site) {
      return { success: false, error: "Please select an injection site" };
    }

    const now = new Date();

    // Find the GLP-1 schedule if one exists
    const schedule = await db.medicationSchedule.findFirst({
      where: { userId: user.id, isGlp1: true, active: true },
    });

    await db.$transaction([
      db.medicationLog.create({
        data: {
          userId: user.id,
          scheduleId: schedule?.id,
          medName: user.glp1Med,
          dosage: user.glp1Dosage,
          status: "taken",
          notes,
          loggedAt: now,
        },
      }),
      db.injectionSite.create({
        data: {
          userId: user.id,
          site,
          loggedAt: now,
        },
      }),
    ]);

    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save dose" };
  }
}

// ─── Food (shared by meal-photo, meal-text, recipe) ──────

export async function logFood(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const name = formData.get("name") as string;
    const calories = parseFloat(formData.get("calories") as string) || null;
    const protein = parseFloat(formData.get("protein") as string) || null;
    const carbs = parseFloat(formData.get("carbs") as string) || null;
    const fat = parseFloat(formData.get("fat") as string) || null;
    const mealType = formData.get("mealType") as string;
    const inputMethod = formData.get("inputMethod") as string;
    const servings = parseFloat(formData.get("servings") as string) || null;
    const notes = (formData.get("notes") as string) || undefined;

    if (!name?.trim()) {
      return { success: false, error: "Food name is required" };
    }

    await db.foodLog.create({
      data: {
        userId: user.id,
        name: name.trim(),
        calories,
        protein,
        carbs,
        fat,
        mealType: mealType || null,
        inputMethod: inputMethod || "text",
        servings,
        notes,
      },
    });

    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save food log" };
  }
}
