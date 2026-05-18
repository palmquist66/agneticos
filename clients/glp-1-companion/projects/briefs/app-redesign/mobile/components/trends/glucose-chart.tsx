import { useState, useMemo } from "react";
import { View, Text, useColorScheme } from "react-native";
import { CartesianChart, Line, Scatter } from "victory-native";
import { Circle } from "@shopify/react-native-skia";
import { Colors } from "@/constants/colors";
import { ChipGroup } from "@/components/log/chip-group";

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

type Props = {
  data: GlucoseDataPoint[];
  stats: GlucoseStats | null;
  targetMin: number;
  targetMax: number;
};

type ContextFilter = "all" | "fasting" | "before_meal" | "after_meal" | "bedtime";

const CONTEXT_OPTIONS: { value: ContextFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fasting", label: "Fasting" },
  { value: "before_meal", label: "Before meal" },
  { value: "after_meal", label: "After meal" },
  { value: "bedtime", label: "Bedtime" },
];

export function GlucoseChart({ data, stats, targetMin, targetMax }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [contextFilter, setContextFilter] = useState<ContextFilter>("all");

  const filtered = useMemo(
    () =>
      contextFilter === "all"
        ? data
        : data.filter((d) => d.context === contextFilter),
    [data, contextFilter]
  );

  if (data.length === 0) return null;

  if (filtered.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          Glucose
        </Text>
        <ChipGroup
          options={CONTEXT_OPTIONS}
          value={contextFilter}
          onChange={(v) => setContextFilter(v as ContextFilter)}
        />
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter",
            color: colors.mutedForeground,
            textAlign: "center",
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          No readings for this filter.
        </Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = filtered.map((d, i) => ({
    x: i,
    value: d.value,
    targetHigh: targetMax,
    targetLow: targetMin,
    dateLabel: new Date(d.date).toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
    }),
  }));

  const values = filtered.map((d) => d.value);
  const minVal = Math.min(...values, targetMin);
  const maxVal = Math.max(...values, targetMax);
  const padding = Math.max((maxVal - minVal) * 0.1, 10);
  const yMin = Math.floor(minVal - padding);
  const yMax = Math.ceil(maxVal + padding);

  const formatXLabel = (val: number) => {
    const idx = Math.round(val);
    return chartData[idx]?.dateLabel ?? "";
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins-SemiBold",
          color: colors.foreground,
          marginBottom: 12,
        }}
      >
        Glucose
      </Text>

      <ChipGroup
        options={CONTEXT_OPTIONS}
        value={contextFilter}
        onChange={(v) => setContextFilter(v as ContextFilter)}
      />

      {/* Stats row */}
      {stats && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 12,
            paddingVertical: 8,
            backgroundColor: colors.muted,
            borderRadius: 8,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                color: colors.foreground,
              }}
            >
              {stats.avg}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              Avg mg/dL
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                color: colors.foreground,
              }}
            >
              {stats.min}–{stats.max}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              Range
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                color:
                  stats.inRange >= 70
                    ? colors.success
                    : stats.inRange >= 50
                      ? colors.warning
                      : colors.error,
              }}
            >
              {stats.inRange}%
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              In target
            </Text>
          </View>
        </View>
      )}

      <View style={{ height: 200, marginTop: 8 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["value", "targetHigh", "targetLow"]}
          domain={{ y: [yMin, yMax] }}
          axisOptions={{
            formatXLabel,
            formatYLabel: (v: number | undefined) => `${Math.round(v ?? 0)}`,
            tickCount: { x: 5, y: 5 },
            font: null,
            labelColor: colors.mutedForeground,
            lineColor: colors.border,
          }}
          padding={{ left: 10, right: 10, top: 10, bottom: 5 }}
        >
          {({ points, yScale }) => {
            // Custom scatter with color-coded dots
            const scatterPoints = points.value;

            return (
              <>
                {/* Target range band — drawn as two reference lines */}
                <Line
                  points={points.targetHigh}
                  color={colors.success}
                  strokeWidth={1}
                  opacity={0.3}
                />
                <Line
                  points={points.targetLow}
                  color={colors.success}
                  strokeWidth={1}
                  opacity={0.3}
                />

                {/* Connecting line */}
                <Line
                  points={points.value}
                  color={colors.chart1}
                  strokeWidth={1.5}
                  opacity={0.4}
                />

                {/* Color-coded scatter dots */}
                {scatterPoints.map((pt, i) => {
                  if (typeof pt.y !== "number") return null;
                  const val = filtered[i]?.value;
                  const dotColor =
                    val < targetMin
                      ? colors.warning
                      : val > targetMax
                        ? colors.error
                        : colors.success;

                  return (
                    <Circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={4}
                      color={dotColor}
                    />
                  );
                })}
              </>
            );
          }}
        </CartesianChart>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.success,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            In range
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.warning,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Low
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.error,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            High
          </Text>
        </View>
      </View>
    </View>
  );
}
