import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InjectionSiteEntry {
  id: string;
  site: string;
  loggedAt: Date;
}

const SITE_LABELS: Record<string, string> = {
  left_arm: "Left Arm",
  right_arm: "Right Arm",
  left_abdomen: "Left Abdomen",
  right_abdomen: "Right Abdomen",
  left_thigh: "Left Thigh",
  right_thigh: "Right Thigh",
};

const SITE_POSITIONS: Record<string, { x: number; y: number }> = {
  left_arm: { x: 20, y: 25 },
  right_arm: { x: 80, y: 25 },
  left_abdomen: { x: 35, y: 50 },
  right_abdomen: { x: 65, y: 50 },
  left_thigh: { x: 35, y: 75 },
  right_thigh: { x: 65, y: 75 },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function InjectionSiteHistory({ sites }: { sites: InjectionSiteEntry[] }) {
  if (sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Injection Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track injection site rotation after logging your first GLP-1 dose.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Count usage per site and find the last used site
  const siteCounts: Record<string, number> = {};
  const lastUsed = sites[0]; // most recent first from query

  for (const entry of sites) {
    siteCounts[entry.site] = (siteCounts[entry.site] || 0) + 1;
  }

  // Suggest next site: least used or least recently used
  const allSites = Object.keys(SITE_LABELS);
  const suggestedSite = allSites
    .filter((s) => s !== lastUsed?.site)
    .sort((a, b) => (siteCounts[a] || 0) - (siteCounts[b] || 0))[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Injection Sites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Site map visualization */}
        <div className="relative mx-auto h-40 w-32">
          {/* Body outline (simplified) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-36 w-16 rounded-full border-2 border-muted opacity-30" />
          </div>

          {/* Site dots */}
          {allSites.map((site) => {
            const pos = SITE_POSITIONS[site];
            const count = siteCounts[site] || 0;
            const isLast = site === lastUsed?.site;
            const isSuggested = site === suggestedSite;

            return (
              <div
                key={site}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    isLast
                      ? "border-primary bg-primary"
                      : isSuggested
                      ? "border-success bg-success/20"
                      : count > 0
                      ? "border-muted-foreground/50 bg-muted"
                      : "border-muted bg-card"
                  }`}
                />
                {count > 0 && (
                  <span className="mt-0.5 text-[9px] text-muted-foreground">{count}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Last
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-success bg-success/20" /> Suggested
          </span>
        </div>

        {/* Recent history */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Recent</p>
          {sites.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex justify-between text-xs">
              <span>{SITE_LABELS[entry.site] || entry.site}</span>
              <span className="text-muted-foreground">{formatDate(entry.loggedAt)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
