import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedDetailActions } from "@/components/meds/med-detail-actions";
import { MedDetailsCard } from "@/components/meds/med-details-card";
import { ArrowLeft, Pill, Syringe, Check, X, SkipForward } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatFrequency(frequency: string, days: string[]) {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekly") return days.length > 0 ? `Weekly (${days[0]})` : "Weekly";
  if (frequency === "specific_days") return days.map((d) => d.slice(0, 3)).join(", ");
  return frequency;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "taken") return <Check className="h-3.5 w-3.5 text-success" />;
  if (status === "missed") return <X className="h-3.5 w-3.5 text-error" />;
  return <SkipForward className="h-3.5 w-3.5 text-muted-foreground" />;
}

export default async function MedicationDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const user = await getCurrentUser();

  const schedule = await db.medicationSchedule.findFirst({
    where: { id, userId: user.id },
  });

  if (!schedule) notFound();

  // Get dose history for this medication
  const logs = await db.medicationLog.findMany({
    where: { userId: user.id, scheduleId: id },
    orderBy: { loggedAt: "desc" },
    take: 30,
  });

  // Calculate adherence stats
  const taken = logs.filter((l) => l.status === "taken").length;
  const missed = logs.filter((l) => l.status === "missed").length;
  const skipped = logs.filter((l) => l.status === "skipped").length;
  const total = logs.length;
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/meds"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          {schedule.isGlp1 ? (
            <Syringe className="h-5 w-5 text-primary" />
          ) : (
            <Pill className="h-5 w-5 text-primary" />
          )}
          <h1 className="text-lg font-semibold">{schedule.medName}</h1>
          {!schedule.active && (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Editable info card */}
        <MedDetailsCard
          scheduleId={id}
          dosage={schedule.dosage}
          frequency={schedule.frequency}
          days={schedule.days}
          times={schedule.times}
        />

        {/* Adherence stats */}
        <Card>
          <CardHeader>
            <CardTitle>Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            {total === 0 ? (
              <p className="text-sm text-muted-foreground">No doses logged yet.</p>
            ) : (
              <div className="space-y-3">
                {/* Rate bar */}
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Adherence rate</span>
                    <span className="font-medium">{adherenceRate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${adherenceRate}%` }}
                    />
                  </div>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-success-bg p-2">
                    <p className="text-lg font-semibold text-success">{taken}</p>
                    <p className="text-[10px] text-success">Taken</p>
                  </div>
                  <div className="rounded-lg bg-error-bg p-2">
                    <p className="text-lg font-semibold text-error">{missed}</p>
                    <p className="text-[10px] text-error">Missed</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-lg font-semibold text-muted-foreground">{skipped}</p>
                    <p className="text-[10px] text-muted-foreground">Skipped</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent history */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <StatusIcon status={log.status} />
                  <span className="flex-1 capitalize">{log.status}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(log.loggedAt)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <MedDetailActions scheduleId={id} active={schedule.active} />
      </div>
    </div>
  );
}
