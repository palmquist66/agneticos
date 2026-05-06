import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Glp1Status } from "@/lib/today-queries";
import { Syringe } from "lucide-react";

export function Glp1StatusCard({ status }: { status: Glp1Status }) {
  const progress = (status.dayOfCycle / 7) * 100;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Syringe className="h-4 w-4 text-accent" />
          GLP-1 Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm font-medium">{status.medName}</p>
            <p className="text-xs text-muted-foreground">{status.dosage}</p>
          </div>
          <p
            className={cn(
              "text-sm font-medium",
              status.isOverdue && "text-destructive"
            )}
          >
            {status.isOverdue ? "Overdue" : `Day ${status.dayOfCycle} of 7`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              status.isOverdue ? "bg-destructive" : "bg-accent"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p
          className={cn(
            "text-xs",
            status.isOverdue
              ? "font-medium text-destructive"
              : "text-muted-foreground"
          )}
        >
          {status.isOverdue
            ? `Dose was due ${formatDate(status.nextDoseDate)}`
            : `Next dose: ${formatDate(status.nextDoseDate)}`}
        </p>
      </CardContent>
    </Card>
  );
}
