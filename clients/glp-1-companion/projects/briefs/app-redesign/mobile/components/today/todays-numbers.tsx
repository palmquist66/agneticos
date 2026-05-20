import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface TodaysNumbersData {
  weight: { value: number; delta: number | null; unit: string } | null;
  glucose: { value: number; context: string | null; unit: string } | null;
  protein: { value: number; target: number; unit: string } | null;
}

interface Props {
  numbers: TodaysNumbersData;
  colors: AppColors;
}

export function TodaysNumbers({ numbers, colors }: Props) {
  const cards = [];

  if (numbers.weight) {
    cards.push({
      label: "Weight",
      value: `${numbers.weight.value}`,
      unit: numbers.weight.unit,
      subtitle: numbers.weight.delta
        ? `${numbers.weight.delta > 0 ? "+" : ""}${numbers.weight.delta} lbs`
        : null,
      subtitleColor:
        numbers.weight.delta && numbers.weight.delta < 0
          ? colors.success
          : colors.mutedForeground,
    });
  }

  if (numbers.glucose) {
    cards.push({
      label: "Glucose",
      value: `${numbers.glucose.value}`,
      unit: numbers.glucose.unit,
      subtitle: numbers.glucose.context?.replace(/_/g, " ") || null,
      subtitleColor: colors.mutedForeground,
    });
  }

  if (numbers.protein) {
    cards.push({
      label: "Protein",
      value: `${numbers.protein.value}`,
      unit: `/ ${numbers.protein.target}${numbers.protein.unit}`,
      subtitle: null,
      subtitleColor: colors.mutedForeground,
    });
  }

  if (cards.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter",
            color: colors.mutedForeground,
            textAlign: "center",
          }}
        >
          No data logged today yet. Tap + to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {cards.map((card) => (
        <View
          key={card.label}
          style={{
            flex: 1,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter-Medium",
              color: colors.mutedForeground,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {card.label}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 4 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins-Bold",
                color: colors.foreground,
              }}
            >
              {card.value}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                marginLeft: 2,
              }}
            >
              {card.unit}
            </Text>
          </View>
          {card.subtitle && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter",
                color: card.subtitleColor,
                marginTop: 2,
              }}
            >
              {card.subtitle}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
