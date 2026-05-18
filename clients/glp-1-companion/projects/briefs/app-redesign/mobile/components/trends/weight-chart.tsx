import { View, Text, useColorScheme } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { DashPathEffect } from "@shopify/react-native-skia";
import { Colors } from "@/constants/colors";

type WeightDataPoint = {
  date: string;
  weight: number;
  movingAvg: number | null;
};

type Props = {
  data: WeightDataPoint[];
  goalWeight: number | null;
};

export function WeightChart({ data, goalWeight }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  if (data.length === 0) return null;

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const padding = Math.max((maxWeight - minWeight) * 0.1, 2);
  const yMin = Math.floor(
    Math.min(minWeight, goalWeight ?? minWeight) - padding
  );
  const yMax = Math.ceil(maxWeight + padding);

  // Insight: overall change
  const firstWeight = data[0].weight;
  const lastWeight = data[data.length - 1].weight;
  const change = lastWeight - firstWeight;

  // Prepare chart data — victory-native v41 needs numeric x or date string
  const chartData = data.map((d, i) => ({
    x: i,
    weight: d.weight,
    movingAvg: d.movingAvg ?? undefined,
    goal: goalWeight ?? undefined,
    dateLabel: (() => {
      const date = new Date(d.date + "T00:00:00");
      return `${date.getMonth() + 1}/${date.getDate()}`;
    })(),
  }));

  // Format x-axis labels
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
          marginBottom: 4,
        }}
      >
        Weight
      </Text>

      {Math.abs(change) >= 0.1 && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter",
            color: colors.mutedForeground,
            marginBottom: 8,
          }}
        >
          {change < 0 ? "Down" : "Up"}{" "}
          <Text
            style={{ color: change < 0 ? colors.success : colors.error }}
          >
            {Math.abs(change).toFixed(1)} lbs
          </Text>{" "}
          over this period
        </Text>
      )}

      <View style={{ height: 200 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["weight", "movingAvg", "goal"]}
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
          {({ points }) => (
            <>
              {/* Goal reference line */}
              {goalWeight && points.goal && (
                <Line
                  points={points.goal}
                  color={colors.primary}
                  strokeWidth={1.5}
                  opacity={0.5}
                >
                  <DashPathEffect intervals={[6, 4]} />
                </Line>
              )}

              {/* Moving average line */}
              {points.movingAvg && (
                <Line
                  points={points.movingAvg}
                  color={colors.mutedForeground}
                  strokeWidth={1.5}
                  connectMissingData
                >
                  <DashPathEffect intervals={[4, 4]} />
                </Line>
              )}

              {/* Main weight line */}
              <Line
                points={points.weight}
                color={colors.foreground}
                strokeWidth={2}
                curveType="natural"
              />
            </>
          )}
        </CartesianChart>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 4,
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 16,
              height: 2,
              backgroundColor: colors.foreground,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            Weight
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 16,
              height: 2,
              backgroundColor: colors.mutedForeground,
              opacity: 0.6,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            7d avg
          </Text>
        </View>
        {goalWeight && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 16,
                height: 2,
                backgroundColor: colors.primary,
                opacity: 0.5,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              Goal: {goalWeight}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
