"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Watch, Heart, Check, AlertCircle, RefreshCw, Loader2, Unplug } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface DataSourceConnection {
  id: string;
  source: string;
  status: string;
  lastSyncAt: Date | null;
  lastSyncRecords: number | null;
}

const SOURCE_META: Record<string, { name: string; icon: React.ReactNode; description: string; oauthUrl?: string }> = {
  dexcom: {
    name: "Dexcom CGM",
    icon: <Activity className="h-4 w-4" />,
    description: "Continuous glucose readings",
    oauthUrl: "/api/sync/dexcom",
  },
  fitbit: {
    name: "Fitbit",
    icon: <Watch className="h-4 w-4" />,
    description: "Weight and activity",
    oauthUrl: "/api/sync/fitbit",
  },
  apple_health: {
    name: "Apple Health",
    icon: <Heart className="h-4 w-4" />,
    description: "iOS app required",
  },
};

function formatLastSync(date: Date | null) {
  if (!date) return "Never synced";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DataSourcesCard({ connections }: { connections: DataSourceConnection[] }) {
  const router = useRouter();
  const connectedMap = new Map(connections.map((c) => [c.source, c]));
  const allSources = ["dexcom", "fitbit", "apple_health"];
  const [syncing, setSyncing] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  async function handleSync(sourceId: string) {
    setSyncing(sourceId);
    try {
      const res = await fetch(`/api/sync/${sourceId}/pull`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsReconnect) {
          const sourceName = SOURCE_META[sourceId]?.name || sourceId;
          toast.error("Reconnection needed", {
            description: `Your ${sourceName} session expired. Please reconnect.`,
          });
        } else if (res.status === 429) {
          toast.info("Sync too frequent", {
            description: "Please wait a few minutes between syncs.",
          });
        } else {
          toast.error("Sync failed", { description: data.error });
        }
        return;
      }

      if (data.imported > 0) {
        toast.success(`Synced ${data.imported} new reading${data.imported === 1 ? "" : "s"}`);
      } else {
        toast.info("Already up to date", { description: "No new readings found." });
      }

      router.refresh();
    } catch {
      toast.error("Sync failed", { description: "Check your network connection." });
    } finally {
      setSyncing(null);
    }
  }

  async function handleDisconnect(sourceId: string) {
    if (!confirm("Disconnect this source? Your existing data will be kept.")) return;

    setDisconnecting(sourceId);
    try {
      const res = await fetch(`/api/sync/${sourceId}/disconnect`, { method: "POST" });
      if (res.ok) {
        toast.success("Disconnected");
        router.refresh();
      } else {
        toast.error("Failed to disconnect");
      }
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setDisconnecting(null);
    }
  }

  function handleConnect(sourceId: string) {
    const meta = SOURCE_META[sourceId];
    if (meta.oauthUrl) {
      // Redirect to OAuth flow
      window.location.href = meta.oauthUrl;
    } else {
      toast.info(`${meta.name} integration coming soon`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Data Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {allSources.map((sourceId) => {
          const meta = SOURCE_META[sourceId];
          const connection = connectedMap.get(sourceId);
          const isConnected = connection?.status === "connected";
          const hasError = connection?.status === "error" || connection?.status === "expired";
          const isSyncing = syncing === sourceId;
          const isDisconnecting = disconnecting === sourceId;

          return (
            <div
              key={sourceId}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isConnected
                  ? "bg-success-bg text-success"
                  : hasError
                  ? "bg-error-bg text-error"
                  : "bg-muted text-muted-foreground"
              }`}>
                {meta.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{meta.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {isConnected
                    ? `Last sync: ${formatLastSync(connection.lastSyncAt)}${connection.lastSyncRecords ? ` · ${connection.lastSyncRecords} records` : ""}`
                    : hasError
                    ? "Connection error — tap to reconnect"
                    : meta.description}
                </p>
              </div>

              {isConnected ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSync(sourceId)}
                    disabled={isSyncing}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    title="Sync now"
                  >
                    {isSyncing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDisconnect(sourceId)}
                    disabled={isDisconnecting}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-error disabled:opacity-50"
                    title="Disconnect"
                  >
                    {isDisconnecting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Unplug className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ) : hasError ? (
                <button
                  onClick={() => handleConnect(sourceId)}
                  className="shrink-0 rounded-md border border-error/20 bg-error-bg px-2.5 py-1 text-xs font-medium text-error hover:bg-error/10"
                >
                  Reconnect
                </button>
              ) : sourceId === "apple_health" ? (
                <span className="shrink-0 text-[10px] text-muted-foreground">iOS only</span>
              ) : (
                <button
                  onClick={() => handleConnect(sourceId)}
                  className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
