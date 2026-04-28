import { Plus } from "lucide-react";

export default function TodayPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Today</h1>

      <div className="mt-6 space-y-4">
        {/* GLP-1 Status Card placeholder */}
        <EmptyCard
          title="GLP-1 Status"
          description="Set up your medication in Profile to see your injection cycle here."
        />

        {/* Medication Check-In placeholder */}
        <EmptyCard
          title="Today's Medications"
          description="No medications scheduled. Add your first medication to get daily reminders."
        />

        {/* Today's Numbers placeholder */}
        <div className="grid grid-cols-3 gap-3">
          <MetricPlaceholder label="Weight" unit="lbs" />
          <MetricPlaceholder label="Glucose" unit="mg/dL" />
          <MetricPlaceholder label="Protein" unit="g" />
        </div>

        {/* Pattern Spotlight placeholder */}
        <EmptyCard
          title="Pattern Spotlight"
          description="Keep logging — patterns appear after 7+ days of data."
        />

        {/* Recent Activity placeholder */}
        <div className="rounded-xl border p-4">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nothing logged yet today.
              <br />
              Tap <strong>+</strong> to log your first entry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function MetricPlaceholder({
  label,
  unit,
}: {
  label: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">&mdash;</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  );
}
