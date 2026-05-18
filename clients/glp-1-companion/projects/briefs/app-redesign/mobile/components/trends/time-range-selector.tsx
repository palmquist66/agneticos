import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";

type TimeRange = "7d" | "14d" | "30d" | "60d" | "90d";

const RANGES: TimeRange[] = ["7d", "14d", "30d", "60d", "90d"];

type Props = {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
};

export function TimeRangeSelector({ value, onChange }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {RANGES.map((range) => {
        const active = range === value;
        return (
          <Pressable
            key={range}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(range);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: active ? colors.primary : colors.muted,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: active ? colors.primaryForeground : colors.mutedForeground,
              }}
            >
              {range}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
