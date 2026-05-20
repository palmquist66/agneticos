"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Add Medication Schedule ──────────────────────────────

export async function addMedicationSchedule(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const medName = (formData.get("medName") as string)?.trim();
    const dosage = (formData.get("dosage") as string)?.trim();
    const frequency = formData.get("frequency") as string;
    const daysRaw = formData.get("days") as string;
    const timesRaw = formData.get("times") as string;
    const isGlp1 = formData.get("isGlp1") === "true";

    if (!medName) return { success: false, error: "Medication name is required" };
    if (!dosage) return { success: false, error: "Dosage is required" };
    if (!frequency) return { success: false, error: "Frequency is required" };

    const days = daysRaw ? daysRaw.split(",").filter(Boolean) : [];
    const times = timesRaw ? timesRaw.split(",").filter(Boolean) : [];

    // If this is a GLP-1 med, deactivate any existing GLP-1 schedule
    if (isGlp1) {
      await db.medicationSchedule.updateMany({
        where: { userId: user.id, isGlp1: true, active: true },
        data: { active: false },
      });
    }

    await db.medicationSchedule.create({
      data: {
        userId: user.id,
        medName,
        dosage,
        frequency,
        days,
        times,
        isGlp1,
        active: true,
      },
    });

    revalidatePath("/meds");
    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to add medication" };
  }
}

// ─── Update Medication Schedule ───────────────────────────

export async function updateMedicationSchedule(
  scheduleId: string,
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const dosage = (formData.get("dosage") as string)?.trim();
    const frequency = formData.get("frequency") as string;
    const daysRaw = formData.get("days") as string;
    const timesRaw = formData.get("times") as string;

    if (!dosage) return { success: false, error: "Dosage is required" };

    const days = daysRaw ? daysRaw.split(",").filter(Boolean) : [];
    const times = timesRaw ? timesRaw.split(",").filter(Boolean) : [];

    await db.medicationSchedule.update({
      where: { id: scheduleId, userId: user.id },
      data: { dosage, frequency, days, times },
    });

    // If GLP-1, also sync back to user profile
    const schedule = await db.medicationSchedule.findFirst({
      where: { id: scheduleId, userId: user.id },
    });
    if (schedule?.isGlp1) {
      await db.user.update({
        where: { id: user.id },
        data: { glp1Dosage: dosage },
      });
    }

    revalidatePath(`/meds/${scheduleId}`);
    revalidatePath("/meds");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update medication" };
  }
}

// ─── Deactivate Medication Schedule ───────────────────────

export async function deactivateMedication(scheduleId: string) {
  try {
    const user = await getCurrentUser();

    await db.medicationSchedule.update({
      where: { id: scheduleId, userId: user.id },
      data: { active: false },
    });

    revalidatePath("/meds");
    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to deactivate medication" };
  }
}

// ─── Reactivate Medication Schedule ───────────────────────

export async function reactivateMedication(scheduleId: string) {
  try {
    const user = await getCurrentUser();

    await db.medicationSchedule.update({
      where: { id: scheduleId, userId: user.id },
      data: { active: true },
    });

    revalidatePath("/meds");
    revalidatePath("/today");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to reactivate medication" };
  }
}
