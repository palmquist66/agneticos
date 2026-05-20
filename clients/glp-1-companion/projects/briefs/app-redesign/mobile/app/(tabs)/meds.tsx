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
import { ActiveMedications } from "@/components/meds/active-medications";
import { TitrationTimeline } from "@/components/meds/titration-timeline";
import { InjectionSiteMap } from "@/components/meds/injection-site-map";
import { AddMedicationSheet } from "@/components/meds/add-medication-sheet";

interface MedsPageData {
  medications: any[];
  titrationSteps: any[];
  injectionSites: any[];
}

export default function MedsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [data, setData] = useState<MedsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await api<MedsPageData>("/api/meds");
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

  const hasAnyData =
    (data?.medications?.length ?? 0) > 0 ||
    (data?.titrationSteps?.length ?? 0) > 0 ||
    (data?.injectionSites?.length ?? 0) > 0;

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
        {!hasAnyData ? (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 48,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 12 }}>💊</Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Inter-SemiBold",
                color: colors.foreground,
              }}
            >
              No medications added
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                marginTop: 4,
                textAlign: "center",
                paddingHorizontal: 24,
              }}
            >
              Add your medications to track adherence and see patterns.
            </Text>
          </View>
        ) : (
          <>
            {data?.medications && (
              <ActiveMedications
                medications={data.medications}
                colors={colors}
              />
            )}
            {data?.titrationSteps && (
              <TitrationTimeline
                steps={data.titrationSteps}
                colors={colors}
              />
            )}
            {data?.injectionSites && (
              <InjectionSiteMap
                sites={data.injectionSites}
                colors={colors}
              />
            )}
          </>
        )}
      </ScrollView>

      <AddMedicationSheet colors={colors} onAdded={fetchData} />
    </View>
  );
}
