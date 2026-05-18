import { View, Text, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

export function NutritionDisplay({
  calories,
  protein,
  carbs,
  fat,
}: {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const items = [
    { label: "Cal", value: calories, unit: "" },
    { label: "Protein", value: protein, unit: "g" },
    { label: "Carbs", value: carbs, unit: "g" },
    { label: "Fat", value: fat, unit: "g" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.muted,
        padding: 12,
      }}
    >
      {items.map((item) => (
        <View key={item.label} style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Inter-SemiBold",
              color: colors.foreground,
            }}
          >
            {item.value !== null ? Math.round(item.value) : "\u2014"}
            {item.value !== null && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                {item.unit}
              </Text>
            )}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Inter",
              color: colors.mutedForeground,
              marginTop: 2,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
