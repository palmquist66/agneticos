"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const SYNCABLE_SOURCES = ["dexcom", "fitbit"];

const isDev = process.env.NODE_ENV === "development";

interface SourceStatus {
  source: string;
  status: string;
  lastSyncAt: string | null;
}

export function AutoSync() {
  const router = useRouter();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const controller = new AbortController();

    async function syncStale() {
      try {
        const res = await fetch("/api/sync/status", {
          signal: controller.signal,
        });
        if (!res.ok) return;

        const { sources } = (await res.json()) as { sources: SourceStatus[] };
        const now = Date.now();

        const staleSources = sources.filter((s) => {
          if (!SYNCABLE_SOURCES.includes(s.source)) return false;
          if (s.status !== "connected") return false;
          if (!s.lastSyncAt) return true; // never synced
          return now - new Date(s.lastSyncAt).getTime() > STALE_THRESHOLD_MS;
        });

        if (isDev) {
          const connected = sources.filter(
            (s) => SYNCABLE_SOURCES.includes(s.source) && s.status === "connected"
          );
          console.log(
            `[AutoSync] ${connected.length} connected, ${staleSources.length} stale`,
            staleSources.map((s) => s.source)
          );
        }

        if (staleSources.length === 0) return;

        // Fire syncs in parallel, settle all
        const results = await Promise.allSettled(
          staleSources.map(async (s) => {
            const pullRes = await fetch(`/api/sync/${s.source}/pull`, {
              method: "POST",
              signal: controller.signal,
            });
            if (!pullRes.ok) {
              if (isDev) console.log(`[AutoSync] ${s.source} pull failed: ${pullRes.status}`);
              return { source: s.source, imported: 0 };
            }
            const data = await pullRes.json();
            if (isDev) console.log(`[AutoSync] ${s.source} synced: ${data.imported} imported`);
            return { source: s.source, imported: data.imported ?? 0 };
          })
        );

        if (controller.signal.aborted) return;

        const totalImported = results.reduce((sum, r) => {
          if (r.status === "fulfilled") return sum + r.value.imported;
          return sum;
        }, 0);

        if (totalImported > 0) {
          toast.success(`Synced ${totalImported} new reading${totalImported === 1 ? "" : "s"}`, {
            description: "Auto-synced from connected sources.",
          });
          router.refresh();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Silent fail — auto-sync should never block the app
      }
    }

    syncStale();

    return () => controller.abort();
  }, [router]);

  return null;
}
