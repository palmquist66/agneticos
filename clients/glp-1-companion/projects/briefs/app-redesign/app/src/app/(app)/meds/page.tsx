import Link from "next/link";
import { Pill, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MedsPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Medications</h1>

      <div className="mt-6 space-y-4">
        {/* Active Medications placeholder */}
        <div className="flex flex-col items-center rounded-xl border py-12 text-center">
          <Pill className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium">No medications added</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your medications to track adherence and see patterns.
          </p>
          <Button size="sm" className="mt-4">
            <Plus className="mr-1 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        {/* Titration Timeline placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Titration Timeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your GLP-1 dose history will appear here once you start logging
            doses.
          </p>
        </div>

        {/* Injection Site Map placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">Injection Sites</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track injection site rotation after logging your first GLP-1 dose.
          </p>
        </div>

        {/* Medication History placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="text-sm font-medium">History</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your medication history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
