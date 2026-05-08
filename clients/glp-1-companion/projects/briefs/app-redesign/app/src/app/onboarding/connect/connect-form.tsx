"use client";

import { useRouter } from "next/navigation";
import { Activity, Watch, Heart, Check } from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  oauthUrl?: string;
}

const DATA_SOURCES: DataSource[] = [
  {
    id: "dexcom",
    name: "Dexcom CGM",
    description: "Continuous glucose readings every 5 minutes",
    icon: <Activity className="h-5 w-5" />,
    available: true,
    oauthUrl: "/api/sync/dexcom",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    description: "Weight and activity data",
    icon: <Watch className="h-5 w-5" />,
    available: true,
    oauthUrl: "/api/sync/fitbit",
  },
  {
    id: "apple_health",
    name: "Apple Health",
    description: "Available in the iOS app",
    icon: <Heart className="h-5 w-5" />,
    available: false,
  },
];

export function ConnectForm({ connectedSources }: { connectedSources: string[] }) {
  const router = useRouter();

  function handleConnect(source: DataSource) {
    if (source.oauthUrl) {
      window.location.href = source.oauthUrl;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connect your data</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Auto-import health data for richer patterns and insights.
        </p>
      </div>

      <div className="space-y-3">
        {DATA_SOURCES.map((source) => {
          const isConnected = connectedSources.includes(source.id);

          return (
            <div
              key={source.id}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                isConnected ? "border-success/20 bg-success-bg" : ""
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isConnected ? "bg-success-bg text-success" : "bg-muted text-muted-foreground"
              }`}>
                {source.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{source.name}</p>
                <p className="text-xs text-muted-foreground">{source.description}</p>
              </div>

              {isConnected ? (
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                  <Check className="h-3.5 w-3.5" />
                  Connected
                </div>
              ) : source.available ? (
                <button
                  onClick={() => handleConnect(source)}
                  className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  Connect
                </button>
              ) : (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {source.id === "apple_health" ? "iOS only" : "Coming soon"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You can always connect these later from your Profile page.
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push("/onboarding/ready")}
          className="text-sm text-muted-foreground hover:underline"
        >
          I&apos;ll enter data manually
        </button>
        <button
          onClick={() => router.push("/onboarding/ready")}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
