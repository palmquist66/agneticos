"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Medication Toggle ──────────────────────────────────

export async function toggleMedTaken(
  scheduleId: string,
  medName: string,
  dosage: string,
  currentlyTaken: boolean,
  logId: string | null
) {
  try {
    const user = await getCurrentUser();

    if (currentlyTaken && logId) {
      await db.medicationLog.delete({
        where: { id: logId, userId: user.id },
      });
    } else {
      await db.medicationLog.create({
        data: {
          userId: user.id,
          scheduleId,
          medName,
          dosage,
          status: "taken",
          loggedAt: new Date(),
        },
      });
    }

    revalidatePath("/today");
    return { success: true };
  } catch (error) {
    console.error("toggleMedTaken error:", error);
    return { success: false, error: "Failed to update medication status" };
  }
}

export async function markAllMedsTaken(
  untakenMeds: { scheduleId: string; medName: string; dosage: string }[]
) {
  try {
    const user = await getCurrentUser();
    const now = new Date();

    await db.$transaction(
      untakenMeds.map((med) =>
        db.medicationLog.create({
          data: {
            userId: user.id,
            scheduleId: med.scheduleId,
            medName: med.medName,
            dosage: med.dosage,
            status: "taken",
            loggedAt: now,
          },
        })
      )
    );

    revalidatePath("/today");
    return { success: true };
  } catch (error) {
    console.error("markAllMedsTaken error:", error);
    return { success: false, error: "Failed to mark medications as taken" };
  }
}

// ─── Entry Update ───────────────────────────────────────

export async function updateEntry(
  entryType: string,
  entryId: string,
  data: Record<string, unknown>
) {
  try {
    const user = await getCurrentUser();

    switch (entryType) {
      case "weight": {
        const weight = parseFloat(data.weight as string);
        if (isNaN(weight) || weight < 50 || weight > 500) {
          return { success: false, error: "Weight must be between 50 and 500 lbs" };
        }
        await db.weightLog.update({
          where: { id: entryId, userId: user.id },
          data: { weight, notes: (data.notes as string) || null },
        });
        break;
      }
      case "glucose": {
        const value = parseFloat(data.value as string);
        if (isNaN(value) || value < 40 || value > 600) {
          return { success: false, error: "Glucose must be between 40 and 600 mg/dL" };
        }
        await db.glucoseLog.update({
          where: { id: entryId, userId: user.id },
          data: {
            value,
            context: (data.context as string) || null,
            notes: (data.notes as string) || null,
          },
        });
        break;
      }
      case "food": {
        const name = data.name as string;
        if (!name?.trim()) {
          return { success: false, error: "Food name is required" };
        }
        await db.foodLog.update({
          where: { id: entryId, userId: user.id },
          data: {
            name: name.trim(),
            calories: data.calories ? parseFloat(data.calories as string) : null,
            protein: data.protein ? parseFloat(data.protein as string) : null,
            carbs: data.carbs ? parseFloat(data.carbs as string) : null,
            fat: data.fat ? parseFloat(data.fat as string) : null,
            notes: (data.notes as string) || null,
          },
        });
        break;
      }
      case "medication": {
        await db.medicationLog.update({
          where: { id: entryId, userId: user.id },
          data: { notes: (data.notes as string) || null },
        });
        break;
      }
      case "side_effect": {
        await db.sideEffect.update({
          where: { id: entryId, userId: user.id },
          data: {
            severity: (data.severity as string) || undefined,
            notes: (data.notes as string) || null,
          },
        });
        break;
      }
      default:
        return { success: false, error: "Unknown entry type" };
    }

    revalidatePath("/today");
    return { success: true };
  } catch (error) {
    console.error("updateEntry error:", error);
    return { success: false, error: "Failed to update entry" };
  }
}

// ─── Entry Delete ───────────────────────────────────────

export async function deleteEntry(entryType: string, entryId: string) {
  try {
    const user = await getCurrentUser();

    switch (entryType) {
      case "weight":
        await db.weightLog.delete({ where: { id: entryId, userId: user.id } });
        break;
      case "glucose":
        await db.glucoseLog.delete({ where: { id: entryId, userId: user.id } });
        break;
      case "food":
        await db.foodLog.delete({ where: { id: entryId, userId: user.id } });
        break;
      case "medication":
        await db.medicationLog.delete({ where: { id: entryId, userId: user.id } });
        break;
      case "side_effect":
        await db.sideEffect.delete({ where: { id: entryId, userId: user.id } });
        break;
      default:
        return { success: false, error: "Unknown entry type" };
    }

    revalidatePath("/today");
    return { success: true };
  } catch (error) {
    console.error("deleteEntry error:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}
