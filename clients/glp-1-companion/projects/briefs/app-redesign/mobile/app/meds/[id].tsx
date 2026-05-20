import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { api } from "@/lib/api";
import { MedDetailsCard } from "@/components/meds/med-details-card";
import { AdherenceCard } from "@/components/meds/adherence-card";
import { DoseHistory } from "@/components/meds/dose-history";
import { MedActions } from "@/components/meds/med-actions";

interface MedDetailData {
  schedule: {
    id: string;
    medName: string;
    dosage: string;
    frequency: string;
    days: string[];
    times: string[];
    isGlp1: boolean;
    active: boolean;
  };
  logs: {
    id: string;
    status: string;
    loggedAt: string;
  }[];
  adherence: {
    rate: number;
    taken: number;
    missed: number;
    skipped: number;
    total: number;
  };
}

export default function MedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [data, setData] = useState<MedDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await api<MedDetailData>(`/api/meds/${id}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

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

  if (error || !data) {
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
          {error || "Medication not found"}
        </Text>
      </View>
    );
  }

  const { schedule, logs, adherence } = data;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 24 }}>
            {schedule.isGlp1 ? "💉" : "💊"}
          </Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins-SemiBold",
                color: colors.foreground,
              }}
            >
              {schedule.medName}
            </Text>
          </View>
          {!schedule.active && (
            <View
              style={{
                backgroundColor: colors.muted,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter-Medium",
                  color: colors.mutedForeground,
                }}
              >
                Inactive
              </Text>
            </View>
          )}
        </View>

        {/* Details */}
        <MedDetailsCard
          scheduleId={schedule.id}
          dosage={schedule.dosage}
          frequency={schedule.frequency}
          days={schedule.days}
          times={schedule.times}
          colors={colors}
          onUpdated={fetchData}
        />

        {/* Adherence */}
        <AdherenceCard adherence={adherence} colors={colors} />

        {/* Dose history */}
        <DoseHistory logs={logs} colors={colors} />

        {/* Actions */}
        <MedActions
          scheduleId={schedule.id}
          active={schedule.active}
          colors={colors}
        />
      </ScrollView>
    </View>
  );
}
