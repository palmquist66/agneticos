import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ActiveMedications } from "@/components/meds/active-medications";
import { TitrationTimeline } from "@/components/meds/titration-timeline";
import { InjectionSiteHistory } from "@/components/meds/injection-site-history";
import { AddMedicationSheet } from "@/components/meds/add-medication-sheet";
import { Pill, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MedsPage() {
  const user = await getCurrentUser();

  const [medications, titrationSteps, injectionSites] = await Promise.all([
    db.medicationSchedule.findMany({
      where: { userId: user.id, active: true },
      orderBy: { createdAt: "desc" },
    }),
    db.titrationSchedule.findMany({
      where: { userId: user.id },
      orderBy: { order: "asc" },
    }),
    db.injectionSite.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: "desc" },
      take: 20,
    }),
  ]);

  const hasAnyData = medications.length > 0 || titrationSteps.length > 0 || injectionSites.length > 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Medications</h1>
        <AddMedicationSheet />
      </div>

      <div className="mt-6 space-y-4">
        {!hasAnyData ? (
          <div className="flex flex-col items-center rounded-xl border py-12 text-center">
            <Pill className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">No medications added</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your medications to track adherence and see patterns.
            </p>
          </div>
        ) : (
          <>
            <ActiveMedications medications={medications} />
            <TitrationTimeline steps={titrationSteps} />
            <InjectionSiteHistory sites={injectionSites} />
          </>
        )}
      </div>
    </div>
  );
}
