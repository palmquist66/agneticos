"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logGlp1Dose } from "../actions";
import { LogPageLayout } from "@/components/log/log-page-layout";
import {
  InjectionSitePicker,
  type InjectionSiteValue,
} from "@/components/log/injection-site-picker";
import { Pill } from "lucide-react";

type RecentSite = { site: string; loggedAt: Date };

export function DoseForm({
  medName,
  dosage,
  lastDoseDate,
  recentSites,
  recommended,
}: {
  medName: string | null;
  dosage: string | null;
  lastDoseDate: Date | null;
  recentSites: RecentSite[];
  recommended: InjectionSiteValue | null;
}) {
  const router = useRouter();
  const [site, setSite] = useState<InjectionSiteValue | null>(
    recommended ?? null
  );
  const [notes, setNotes] = useState("");

  const [state, action, pending] = useActionState(logGlp1Dose, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Dose logged");
      router.push("/today");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  if (!medName || !dosage) {
    return (
      <LogPageLayout title="Log GLP-1 Dose">
        <div className="flex flex-col items-center rounded-xl border py-12 text-center">
          <Pill className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No GLP-1 medication configured yet.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set up your medication in Profile to log doses.
          </p>
        </div>
      </LogPageLayout>
    );
  }

  const daysAgo = lastDoseDate
    ? Math.floor(
        (Date.now() - new Date(lastDoseDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <LogPageLayout title="Log GLP-1 Dose">
      <form action={action} className="space-y-6">
        <input type="hidden" name="site" value={site ?? ""} />
        <input type="hidden" name="notes" value={notes} />

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium">{medName}</p>
          <p className="text-sm text-muted-foreground">{dosage}</p>
          {daysAgo !== null && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last dose:{" "}
              {daysAgo === 0
                ? "today"
                : daysAgo === 1
                  ? "yesterday"
                  : `${daysAgo} days ago`}
            </p>
          )}
        </div>

        <InjectionSitePicker
          value={site}
          onChange={setSite}
          recommended={recommended}
          recentSites={recentSites}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={pending || !site}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </LogPageLayout>
  );
}
