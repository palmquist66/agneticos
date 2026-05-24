import { View, Text, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

type ActivityDataPoint = {
  date: string;
  steps: number | null;
  activeEnergyKcal: number | null;
};

type Props = {
  data: ActivityDataPoint[];
};

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

export function ActivityChart({ data }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  if (data.length === 0) return null;

  const stepDays = data.filter((d) => d.steps != null) as { date: string; steps: number }[];
  const energyDays = data.filter((d) => d.activeEnergyKcal != null) as {
    date: string;
    activeEnergyKcal: number;
  }[];

  const avgSteps = avg(stepDays.map((d) => d.steps));
  const avgEnergy = avg(energyDays.map((d) => d.activeEnergyKcal));

  // Last 14 days of step bars.
  const bars = stepDays.slice(-14);
  const maxSteps = bars.length ? Math.max(...bars.map((d) => d.steps)) : 0;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 14,
      }}
    >
      <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: colors.foreground }}>
        Activity
      </Text>

      {/* Summary stats */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontFamily: "Poppins-Bold", color: colors.foreground }}>
            {avgSteps != null ? avgSteps.toLocaleString() : "—"}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: "Inter", color: colors.mutedForeground }}>
            avg steps / day
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontFamily: "Poppins-Bold", color: colors.foreground }}>
            {avgEnergy != null ? `${avgEnergy.toLocaleString()}` : "—"}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: "Inter", color: colors.mutedForeground }}>
            avg active kcal / day
          </Text>
        </View>
      </View>

      {/* Step bars */}
      {bars.length > 0 && maxSteps > 0 && (
        <View style={{ gap: 6 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 4,
              height: 80,
            }}
          >
            {bars.map((d) => (
              <View key={d.date} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
                <View
                  style={{
                    width: "70%",
                    height: Math.max((d.steps / maxSteps) * 80, 3),
                    backgroundColor: colors.primary,
                    borderRadius: 3,
                  }}
                />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 11, fontFamily: "Inter", color: colors.mutedForeground }}>
              {(() => {
                const d = new Date(bars[0].date);
                return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
              })()}
            </Text>
            <Text style={{ fontSize: 11, fontFamily: "Inter", color: colors.mutedForeground }}>
              {(() => {
                const d = new Date(bars[bars.length - 1].date);
                return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
              })()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
