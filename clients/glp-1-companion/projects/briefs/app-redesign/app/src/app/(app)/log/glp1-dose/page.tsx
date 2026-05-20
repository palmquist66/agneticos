import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DoseForm } from "./dose-form";
import type { InjectionSiteValue } from "@/components/log/injection-site-picker";

export const dynamic = "force-dynamic";

const ALL_SITES: InjectionSiteValue[] = [
  "left_arm",
  "right_arm",
  "left_abdomen",
  "right_abdomen",
  "left_thigh",
  "right_thigh",
];

export default async function Glp1DosePage() {
  const user = await getCurrentUser();

  const [lastDose, recentSites] = await Promise.all([
    db.medicationLog.findFirst({
      where: {
        userId: user.id,
        medName: user.glp1Med ?? undefined,
      },
      orderBy: { loggedAt: "desc" },
      select: { loggedAt: true },
    }),
    db.injectionSite.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: "desc" },
      take: 12,
      select: { site: true, loggedAt: true },
    }),
  ]);

  // Recommend the site least recently used
  const usedSites = new Set(recentSites.map((s) => s.site));
  const recommended: InjectionSiteValue =
    ALL_SITES.find((s) => !usedSites.has(s)) ??
    (recentSites.length > 0
      ? (recentSites[recentSites.length - 1].site as InjectionSiteValue)
      : "left_abdomen");

  return (
    <DoseForm
      medName={user.glp1Med}
      dosage={user.glp1Dosage}
      lastDoseDate={lastDose?.loggedAt ?? null}
      recentSites={recentSites}
      recommended={recommended}
    />
  );
}
