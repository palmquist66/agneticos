"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Update User Info ─────────────────────────────────────

export async function updateUserInfo(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const name = (formData.get("name") as string)?.trim() || null;
    const glp1Med = (formData.get("glp1Med") as string)?.trim() || null;
    const glp1Dosage = (formData.get("glp1Dosage") as string)?.trim() || null;
    const otherMedsRaw = (formData.get("otherMeds") as string)?.trim() || "";

    const otherMeds = otherMedsRaw
      ? otherMedsRaw.split(",").map((m) => m.trim()).filter(Boolean)
      : [];

    await db.user.update({
      where: { id: user.id },
      data: { name, glp1Med, glp1Dosage, otherMeds },
    });

    // Sync GLP-1 med to MedicationSchedule so it appears on Meds tab
    if (glp1Med) {
      const existing = await db.medicationSchedule.findFirst({
        where: { userId: user.id, isGlp1: true, active: true },
      });
      if (existing) {
        await db.medicationSchedule.update({
          where: { id: existing.id },
          data: { medName: glp1Med, dosage: glp1Dosage || "As prescribed" },
        });
      } else {
        await db.medicationSchedule.create({
          data: {
            userId: user.id,
            medName: glp1Med,
            dosage: glp1Dosage || "As prescribed",
            frequency: "weekly",
            isGlp1: true,
            active: true,
          },
        });
      }
    }

    // Sync other meds to MedicationSchedule
    if (otherMeds.length > 0) {
      const existingOther = await db.medicationSchedule.findMany({
        where: { userId: user.id, isGlp1: false, active: true },
      });
      const existingNames = new Set(existingOther.map((m) => m.medName));
      const newNames = new Set(otherMeds);

      // Create schedules for newly added meds
      for (const med of otherMeds) {
        if (!existingNames.has(med)) {
          await db.medicationSchedule.create({
            data: {
              userId: user.id,
              medName: med,
              dosage: "As prescribed",
              frequency: "daily",
              isGlp1: false,
              active: true,
            },
          });
        }
      }

      // Deactivate meds removed from profile
      for (const existing of existingOther) {
        if (!newNames.has(existing.medName)) {
          await db.medicationSchedule.update({
            where: { id: existing.id },
            data: { active: false },
          });
        }
      }
    }

    revalidatePath("/profile");
    revalidatePath("/today");
    revalidatePath("/meds");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}

// ─── Update Health Targets ────────────────────────────────

export async function updateHealthTargets(
  _prev: { success: boolean; error?: string },
  formData: FormData
) {
  try {
    const user = await getCurrentUser();
    const goalWeight = parseFloat(formData.get("goalWeight") as string) || null;
    const proteinTarget = parseInt(formData.get("proteinTarget") as string) || null;
    const glucoseMin = parseInt(formData.get("glucoseMin") as string) || null;
    const glucoseMax = parseInt(formData.get("glucoseMax") as string) || null;

    if (goalWeight !== null && (goalWeight < 50 || goalWeight > 500)) {
      return { success: false, error: "Goal weight must be between 50 and 500 lbs" };
    }
    if (proteinTarget !== null && (proteinTarget < 20 || proteinTarget > 500)) {
      return { success: false, error: "Protein target must be between 20 and 500g" };
    }
    if (glucoseMin !== null && glucoseMax !== null && glucoseMin >= glucoseMax) {
      return { success: false, error: "Glucose min must be less than max" };
    }

    await db.user.update({
      where: { id: user.id },
      data: { goalWeight, proteinTarget, glucoseMin, glucoseMax },
    });

    revalidatePath("/profile");
    revalidatePath("/today");
    revalidatePath("/trends");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update health targets" };
  }
}
