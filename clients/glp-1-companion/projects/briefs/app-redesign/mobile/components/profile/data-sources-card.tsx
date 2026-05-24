import { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { api } from "@/lib/api";
import { getHealthSource, isHealthAvailable } from "@/lib/health";
import { connectHealth, disconnectHealth, syncHealthData } from "@/lib/health-sync";

interface SyncSource {
  source: string;
  status: string;
  available: boolean;
  lastSyncAt: string | null;
  lastSyncRecords: number | null;
  lastSyncError: string | null;
  totalRecords: number;
}

const LABELS: Record<string, { name: string; blurb: string }> = {
  apple_health: {
    name: "Apple Health",
    blurb: "Auto-import weight, glucose, steps, and active energy from Apple Health.",
  },
  health_connect: {
    name: "Health Connect",
    blurb: "Auto-import weight, glucose, steps, and active energy from Health Connect.",
  },
};

function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DataSourcesCard() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const source = getHealthSource(); // 'apple_health' | 'health_connect' | null
  const label = source ? LABELS[source] : null;

  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [info, setInfo] = useState<SyncSource | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!source) return;
    try {
      const res = await api<{ sources: SyncSource[] }>("/api/sync/status");
      setInfo(res.sources.find((s) => s.source === source) ?? null);
    } catch {
      setInfo(null);
    }
  }, [source]);

  useEffect(() => {
    if (!source) {
      setLoading(false);
      return;
    }
    (async () => {
      setAvailable(await isHealthAvailable());
      await refresh();
      setLoading(false);
    })();
  }, [source, refresh]);

  // Not a native platform (e.g. web) — nothing to show.
  if (!source || !label) return null;

  const connected = info?.status === "connected";

  const handleConnect = async () => {
    setWorking(true);
    setMessage(null);
    const result = await connectHealth();
    if (result.ok) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refresh();
      setMessage("Connected — pulling your history…");
    } else {
      setMessage(result.reason ?? "Couldn't connect.");
    }
    setWorking(false);
  };

  const handleSync = async () => {
    setWorking(true);
    setMessage(null);
    const resp = await syncHealthData({ force: true });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (resp) {
      const n = resp.imported.weight + resp.imported.glucose + resp.imported.activity;
      setMessage(n > 0 ? `Synced ${n} new record${n === 1 ? "" : "s"}.` : "You're up to date.");
    } else {
      setMessage("Sync failed — try again.");
    }
    await refresh();
    setWorking(false);
  };

  const handleDisconnect = async () => {
    setWorking(true);
    setMessage(null);
    await disconnectHealth();
    await refresh();
    setMessage(null);
    setWorking(false);
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: colors.foreground }}>
          {label.name}
        </Text>
        {loading || working ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: connected ? colors.secondary : colors.muted,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: connected ? colors.primary : colors.mutedForeground,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter-SemiBold",
                color: connected ? colors.primary : colors.mutedForeground,
              }}
            >
              {connected ? "Connected" : "Not connected"}
            </Text>
          </View>
        )}
      </View>

      {!loading && connected && (
        <Text style={{ fontSize: 13, fontFamily: "Inter", color: colors.mutedForeground }}>
          {info?.totalRecords ?? 0} records · last synced {timeAgo(info?.lastSyncAt ?? null)}
        </Text>
      )}

      {!loading && !connected && (
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
          {available ? label.blurb : `${label.name} isn't available on this device.`}
        </Text>
      )}

      {message && (
        <Text style={{ fontSize: 13, fontFamily: "Inter", color: colors.primary }}>{message}</Text>
      )}

      {/* Actions */}
      {!loading && available && !connected && (
        <Pressable
          onPress={handleConnect}
          disabled={working}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 2,
            opacity: working ? 0.6 : 1,
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Connect {label.name}
          </Text>
        </Pressable>
      )}

      {!loading && connected && (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 2 }}>
          <Pressable
            onPress={handleSync}
            disabled={working}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              opacity: working ? 0.6 : 1,
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
              Sync now
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDisconnect}
            disabled={working}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: working ? 0.6 : 1,
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: colors.mutedForeground }}>
              Disconnect
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
