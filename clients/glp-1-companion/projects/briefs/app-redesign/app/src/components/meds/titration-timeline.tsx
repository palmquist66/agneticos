import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Clock } from "lucide-react";

interface TitrationStep {
  id: string;
  medName: string;
  dosage: string;
  order: number;
  status: string; // 'completed' | 'current' | 'planned'
  startedAt: Date | null;
  endedAt: Date | null;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <Check className="h-3.5 w-3.5 text-success" />;
  if (status === "current") return <Circle className="h-3.5 w-3.5 fill-brand-warm text-brand-warm" />;
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function TitrationTimeline({ steps }: { steps: TitrationStep[] }) {
  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Titration Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your GLP-1 dose titration history will appear here once you start logging doses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Titration Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[11px] top-6 h-full w-px bg-primary/20" />
              )}

              {/* Status dot */}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-card">
                <StatusIcon status={step.status} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{step.dosage}</span>
                  {step.status === "current" && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">Current</Badge>
                  )}
                  {step.status === "completed" && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Done</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {step.startedAt && formatDate(step.startedAt)}
                  {step.startedAt && step.endedAt && " – "}
                  {step.endedAt && formatDate(step.endedAt)}
                  {step.status === "planned" && "Upcoming"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
