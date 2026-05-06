import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [weightLogs, glucoseLogs, medicationLogs, sideEffects, titrationSteps] =
      await Promise.all([
        db.weightLog.findMany({
          where: { userId: user.id, loggedAt: { gte: thirtyDaysAgo } },
          orderBy: { loggedAt: "asc" },
          take: 60,
        }),
        db.glucoseLog.findMany({
          where: { userId: user.id, loggedAt: { gte: thirtyDaysAgo } },
          orderBy: { loggedAt: "asc" },
          take: 200,
        }),
        db.medicationLog.findMany({
          where: { userId: user.id, loggedAt: { gte: thirtyDaysAgo } },
          orderBy: { loggedAt: "desc" },
          take: 100,
        }),
        db.sideEffect.findMany({
          where: { userId: user.id, loggedAt: { gte: thirtyDaysAgo } },
          orderBy: { loggedAt: "desc" },
          take: 100,
        }),
        db.titrationSchedule.findMany({
          where: { userId: user.id },
          orderBy: { order: "asc" },
          take: 20,
        }),
      ]);

    // Calculate stats
    const weights = weightLogs.map((l) => l.weight);
    const startWeight = weights[0] ?? null;
    const currentWeight = weights[weights.length - 1] ?? null;
    const weightChange = startWeight && currentWeight ? currentWeight - startWeight : null;

    const glucoseValues = glucoseLogs.map((l) => l.value);
    const avgGlucose = glucoseValues.length > 0
      ? Math.round(glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length)
      : null;
    const minGlucose = glucoseValues.length > 0 ? Math.min(...glucoseValues) : null;
    const maxGlucose = glucoseValues.length > 0 ? Math.max(...glucoseValues) : null;
    const inRange = glucoseValues.filter(
      (v) => v >= (user.glucoseMin ?? 70) && v <= (user.glucoseMax ?? 180)
    ).length;
    const timeInRange = glucoseValues.length > 0
      ? Math.round((inRange / glucoseValues.length) * 100)
      : null;

    const medsTaken = medicationLogs.filter((l) => l.status === "taken").length;
    const medsMissed = medicationLogs.filter((l) => l.status === "missed").length;
    const adherenceRate = medsTaken + medsMissed > 0
      ? Math.round((medsTaken / (medsTaken + medsMissed)) * 100)
      : null;

    // Side effect frequency
    const sideEffectCounts: Record<string, number> = {};
    for (const se of sideEffects) {
      sideEffectCounts[se.symptom] = (sideEffectCounts[se.symptom] || 0) + 1;
    }
    const topSideEffects = Object.entries(sideEffectCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GLP-1 Health Report — ${user.name || "Patient"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 24px; color: #07302E; line-height: 1.5; }
    h1 { font-family: 'Poppins', -apple-system, sans-serif; font-size: 24px; margin-bottom: 4px; color: #0F5F5A; }
    h2 { font-family: 'Poppins', -apple-system, sans-serif; font-size: 16px; margin-top: 28px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #E5DFD2; color: #0F5F5A; }
    .subtitle { color: #6F6A5C; font-size: 14px; margin-bottom: 24px; }
    .meta { display: flex; gap: 24px; margin-bottom: 24px; font-size: 13px; color: #6F6A5C; }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
    .stat-box { border: 1px solid #E5DFD2; border-radius: 12px; padding: 12px; }
    .stat-box .value { font-size: 20px; font-weight: 600; color: #0F5F5A; }
    .stat-box .label { font-size: 11px; color: #6F6A5C; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #E5DFD2; }
    th { font-weight: 600; background: #EAF5F3; color: #0F5F5A; }
    .note { font-size: 12px; color: #6F6A5C; margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5DFD2; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>GLP-1 Companion — Health Report</h1>
  <p class="subtitle">30-Day Summary for Healthcare Provider</p>

  <div class="meta">
    <span><strong>Patient:</strong> ${user.name || "—"}</span>
    <span><strong>Medication:</strong> ${user.glp1Med || "—"} ${user.glp1Dosage || ""}</span>
    <span><strong>Report Date:</strong> ${reportDate}</span>
  </div>

  <h2>Weight</h2>
  <div class="stat-grid">
    <div class="stat-box">
      <div class="value">${currentWeight ? `${currentWeight} lbs` : "—"}</div>
      <div class="label">Current Weight</div>
    </div>
    <div class="stat-box">
      <div class="value">${weightChange !== null ? `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} lbs` : "—"}</div>
      <div class="label">30-Day Change</div>
    </div>
    <div class="stat-box">
      <div class="value">${user.goalWeight ? `${user.goalWeight} lbs` : "—"}</div>
      <div class="label">Goal Weight</div>
    </div>
  </div>

  <h2>Glucose</h2>
  <div class="stat-grid">
    <div class="stat-box">
      <div class="value">${avgGlucose !== null ? `${avgGlucose} mg/dL` : "—"}</div>
      <div class="label">Average</div>
    </div>
    <div class="stat-box">
      <div class="value">${minGlucose !== null && maxGlucose !== null ? `${minGlucose}–${maxGlucose}` : "—"}</div>
      <div class="label">Range (mg/dL)</div>
    </div>
    <div class="stat-box">
      <div class="value">${timeInRange !== null ? `${timeInRange}%` : "—"}</div>
      <div class="label">Time in Range (${user.glucoseMin ?? 70}–${user.glucoseMax ?? 180})</div>
    </div>
  </div>

  <h2>Medication Adherence</h2>
  <div class="stat-grid">
    <div class="stat-box">
      <div class="value">${adherenceRate !== null ? `${adherenceRate}%` : "—"}</div>
      <div class="label">Adherence Rate</div>
    </div>
    <div class="stat-box">
      <div class="value">${medsTaken}</div>
      <div class="label">Doses Taken</div>
    </div>
    <div class="stat-box">
      <div class="value">${medsMissed}</div>
      <div class="label">Doses Missed</div>
    </div>
  </div>

  ${titrationSteps.length > 0 ? `
  <h2>Titration History</h2>
  <table>
    <thead><tr><th>Dosage</th><th>Status</th><th>Started</th><th>Ended</th></tr></thead>
    <tbody>
      ${titrationSteps.map((step) => `
        <tr>
          <td>${step.dosage}</td>
          <td>${step.status}</td>
          <td>${step.startedAt ? new Date(step.startedAt).toLocaleDateString() : "—"}</td>
          <td>${step.endedAt ? new Date(step.endedAt).toLocaleDateString() : "—"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  ` : ""}

  ${topSideEffects.length > 0 ? `
  <h2>Reported Side Effects (30 days)</h2>
  <table>
    <thead><tr><th>Symptom</th><th>Occurrences</th></tr></thead>
    <tbody>
      ${topSideEffects.map(([symptom, count]) => `
        <tr><td>${symptom.replace(/_/g, " ")}</td><td>${count}</td></tr>
      `).join("")}
    </tbody>
  </table>
  ` : ""}

  ${user.otherMeds.length > 0 ? `
  <h2>Other Medications</h2>
  <p style="font-size: 14px;">${user.otherMeds.join(", ")}</p>
  ` : ""}

  <p class="note">
    Generated by GLP-1 Companion on ${reportDate}. This report is based on self-reported data
    and should be reviewed with the patient. Not a substitute for clinical assessment.
  </p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
