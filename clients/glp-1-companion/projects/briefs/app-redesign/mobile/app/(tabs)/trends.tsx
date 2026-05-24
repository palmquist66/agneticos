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
import { TimeRangeSelector } from "@/components/trends/time-range-selector";
import { WeightChart } from "@/components/trends/weight-chart";
import { GlucoseChart } from "@/components/trends/glucose-chart";
import { ActivityChart } from "@/components/trends/activity-chart";
import { PatternCards } from "@/components/trends/pattern-cards";
import { AIChat } from "@/components/trends/ai-chat";
import { DeepAnalysis } from "@/components/trends/deep-analysis";

type TimeRange = "7d" | "14d" | "30d" | "60d" | "90d";

type WeightDataPoint = {
  date: string;
  weight: number;
  movingAvg: number | null;
};

type GlucoseDataPoint = {
  date: string;
  value: number;
  context: string | null;
};

type GlucoseStats = {
  avg: number;
  min: number;
  max: number;
  inRange: number;
  count: number;
};

type ActivityDataPoint = {
  date: string;
  steps: number | null;
  activeEnergyKcal: number | null;
};

type Pattern = {
  type: string;
  title: string;
  summary: string;
  detail: string;
  confidence: "low" | "medium" | "high";
  dataPoints: number;
};

type TrendsResponse = {
  weight: WeightDataPoint[];
  glucose: GlucoseDataPoint[];
  activity: ActivityDataPoint[];
  glucoseStats: GlucoseStats | null;
  patterns: Pattern[];
  goalWeight: number | null;
  glucoseMin: number;
  glucoseMax: number;
};

export default function TrendsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [range, setRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        setError(null);
        if (!isRefresh) setLoading(true);
        const result = await api<TrendsResponse>(`/api/trends?range=${range}`);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trends");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
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

  const hasChartData =
    (data?.weight?.length ?? 0) > 0 ||
    (data?.glucose?.length ?? 0) > 0 ||
    (data?.activity?.length ?? 0) > 0;

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
        <TimeRangeSelector value={range} onChange={setRange} />

        {data?.weight && data.weight.length > 0 && (
          <WeightChart data={data.weight} goalWeight={data.goalWeight} />
        )}

        {data?.glucose && data.glucose.length > 0 && (
          <GlucoseChart
            data={data.glucose}
            stats={data.glucoseStats}
            targetMin={data.glucoseMin}
            targetMax={data.glucoseMax}
          />
        )}

        {data?.activity && data.activity.length > 0 && (
          <ActivityChart data={data.activity} />
        )}

        {!hasChartData && (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-SemiBold",
                color: colors.foreground,
                marginBottom: 4,
              }}
            >
              No data yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                textAlign: "center",
              }}
            >
              Start logging your weight or glucose readings to see trends here.
            </Text>
          </View>
        )}

        {data?.patterns && <PatternCards patterns={data.patterns} />}

        <AIChat />

        <DeepAnalysis />
      </ScrollView>
    </View>
  );
}
