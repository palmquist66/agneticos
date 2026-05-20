"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// ─── Save Medication Selection ────────────────────────────

export async function saveOnboardingMedication(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const glp1Med = (formData.get("glp1Med") as string)?.trim() || null;
    const glp1Dosage = (formData.get("glp1Dosage") as string)?.trim() || null;

    await db.user.update({
      where: { id: user.id },
      data: { glp1Med, glp1Dosage },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to save medication" };
  }
}

// ─── Save Goals ───────────────────────────────────────────

export async function saveOnboardingGoals(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const goalWeight = parseFloat(formData.get("goalWeight") as string) || null;
    const proteinTarget = parseInt(formData.get("proteinTarget") as string) || null;
    const glucoseMin = parseInt(formData.get("glucoseMin") as string) || null;
    const glucoseMax = parseInt(formData.get("glucoseMax") as string) || null;

    await db.user.update({
      where: { id: user.id },
      data: { goalWeight, proteinTarget, glucoseMin, glucoseMax },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to save goals" };
  }
}

// ─── Complete Onboarding ──────────────────────────────────

export async function completeOnboarding() {
  const user = await getCurrentUser();

  await db.user.update({
    where: { id: user.id },
    data: { onboarded: true },
  });

  redirect("/today");
}
