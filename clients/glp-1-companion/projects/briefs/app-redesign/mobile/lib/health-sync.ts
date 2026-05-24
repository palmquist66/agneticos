/**
 * Health sync orchestration — the glue between lib/health.ts (native reads)
 * and the backend import API.
 *
 *   connectHealth()      → request permissions, mark connected, initial pull
 *   syncHealthData()     → pull deltas + activity window, POST to /import
 *   disconnectHealth()   → mark disconnected, clear local cursors
 *   useHealthAutoSync()  → throttled foreground sync (mount + app-foreground)
 *
 * Auto-sync only runs once the user has explicitly connected (a flag in
 * SecureStore), so a background query never silently flips the connection on
 * or triggers a permission prompt.
 */
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";
import {
  getHealthSource,
  isHealthAvailable,
  requestHealthPermissions,
  getGrantedHealthTypes,
  pullHealthData,
  resetHealthSyncState,
} from "./health";
import type { HealthImportResponse } from "@shared/types";

const MIN_SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 min
const KEY_LAST_SYNC = "health.lastSync";
const KEY_ENABLED = "health.enabled";

export interface ConnectResult {
  ok: boolean;
  reason?: string;
}

async function isEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEY_ENABLED)) === "1";
}

/** Request permissions, record the connection server-side, do an initial pull. */
export async function connectHealth(): Promise<ConnectResult> {
  const source = getHealthSource();
  if (!source) return { ok: false, reason: "Native health isn't available on this platform." };

  const available = await isHealthAvailable();
  if (!available) {
    return {
      ok: false,
      reason:
        source === "health_connect"
          ? "Health Connect isn't set up on this device."
          : "Apple Health isn't available on this device.",
    };
  }

  const granted = await requestHealthPermissions();
  if (!granted) return { ok: false, reason: "Health permissions were not granted." };

  const grantedTypes = await getGrantedHealthTypes();
  await api("/api/sync/health/connect", {
    method: "POST",
    body: JSON.stringify({ source, grantedTypes }),
  });

  await SecureStore.setItemAsync(KEY_ENABLED, "1");
  await syncHealthData({ force: true });
  return { ok: true };
}

/** Flip the connection off and clear local sync cursors. Imported data stays. */
export async function disconnectHealth(): Promise<void> {
  const source = getHealthSource();
  if (source) {
    await api("/api/sync/health/disconnect", {
      method: "POST",
      body: JSON.stringify({ source }),
    }).catch(() => {});
  }
  await SecureStore.deleteItemAsync(KEY_ENABLED).catch(() => {});
  await SecureStore.deleteItemAsync(KEY_LAST_SYNC).catch(() => {});
  await resetHealthSyncState();
}

/**
 * Pull new health data and import it. Returns the import summary, or null when
 * skipped (not connected / throttled / unsupported platform).
 */
export async function syncHealthData(
  opts: { force?: boolean } = {}
): Promise<HealthImportResponse | null> {
  const source = getHealthSource();
  if (!source) return null;

  if (!opts.force) {
    if (!(await isEnabled())) return null;
    const last = await SecureStore.getItemAsync(KEY_LAST_SYNC);
    if (last && Date.now() - Number(last) < MIN_SYNC_INTERVAL_MS) return null;
  }

  try {
    const { samples, dailyActivity } = await pullHealthData();

    if (samples.length === 0 && dailyActivity.length === 0) {
      await SecureStore.setItemAsync(KEY_LAST_SYNC, String(Date.now()));
      return {
        success: true,
        imported: { weight: 0, glucose: 0, activity: 0 },
        skipped: { weight: 0, glucose: 0 },
      };
    }

    const resp = await api<HealthImportResponse>("/api/sync/health/import", {
      method: "POST",
      body: JSON.stringify({ source, samples, dailyActivity }),
    });

    await SecureStore.setItemAsync(KEY_LAST_SYNC, String(Date.now()));
    return resp;
  } catch (e) {
    console.warn("[health-sync] sync failed", e);
    return null;
  }
}

/** Foreground auto-sync: runs on mount and whenever the app returns to active. */
export function useHealthAutoSync(): void {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Fire once on mount (throttled + enabled-gated internally).
    void syncHealthData();

    const sub = AppState.addEventListener("change", (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        void syncHealthData();
      }
      appState.current = next;
    });

    return () => sub.remove();
  }, []);
}
