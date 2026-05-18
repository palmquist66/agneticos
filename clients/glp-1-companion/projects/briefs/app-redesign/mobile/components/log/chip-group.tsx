import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string }[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
  label,
}: ChipGroupProps<T>) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (optionValue: T) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (multiple) {
      const current = selected as T[];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-Medium",
            color: colors.mutedForeground,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <Pressable
              key={option.value}
              onPress={() => toggle(option.value)}
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : colors.card,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-Medium",
                  color: isSelected ? colors.primaryForeground : colors.foreground,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
