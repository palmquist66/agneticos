import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/colors";
import { api } from "@/lib/api";
import { Glp1StatusCard } from "@/components/today/glp1-status-card";
import { TodaysNumbers } from "@/components/today/todays-numbers";
import { RecentActivity } from "@/components/today/recent-activity";
import { MedicationCheckin } from "@/components/today/medication-checkin";
import { FABSheet } from "@/components/nav/fab-sheet";
// Response shape from GET /api/today
interface TodayResponse {
  glp1Status: any;
  scheduledMeds: any[];
  todaysNumbers: any;
  recentActivity: any[];
}

export default function TodayScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [data, setData] = useState<TodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await api<TodayResponse>("/api/today");
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter",
            color: colors.error,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {data?.glp1Status && (
          <Glp1StatusCard status={data.glp1Status} colors={colors} />
        )}

        {data?.scheduledMeds && data.scheduledMeds.length > 0 && (
          <MedicationCheckin
            meds={data.scheduledMeds}
            colors={colors}
            onToggle={onRefresh}
          />
        )}

        {data?.todaysNumbers && (
          <TodaysNumbers numbers={data.todaysNumbers} colors={colors} />
        )}

        {data?.recentActivity && (
          <RecentActivity entries={data.recentActivity} colors={colors} />
        )}
      </ScrollView>

      <FABSheet colors={colors} />
    </View>
  );
}
