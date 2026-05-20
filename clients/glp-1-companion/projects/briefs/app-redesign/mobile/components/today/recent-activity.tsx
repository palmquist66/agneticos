import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface ActivityEntry {
  id: string;
  type: "weight" | "glucose" | "food" | "medication" | "side_effect";
  summary: string;
  loggedAt: string;
}

interface Props {
  entries: ActivityEntry[];
  colors: AppColors;
}

const TYPE_LABELS: Record<string, string> = {
  weight: "Weight",
  glucose: "Glucose",
  food: "Food",
  medication: "Medication",
  side_effect: "Side Effect",
};

const TYPE_COLORS: Record<string, (colors: AppColors) => string> = {
  weight: (c) => c.primary,
  glucose: (c) => c.info,
  food: (c) => c.warning,
  medication: (c) => c.success,
  side_effect: (c) => c.error,
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function RecentActivity({ entries, colors }: Props) {
  if (entries.length === 0) {
    return null;
  }

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
          fontSize: 16,
          fontFamily: "Poppins-SemiBold",
          color: colors.foreground,
          marginBottom: 12,
        }}
      >
        Recent Activity
      </Text>

      {entries.map((entry, index) => (
        <View
          key={entry.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            borderTopWidth: index > 0 ? 1 : 0,
            borderTopColor: colors.border,
          }}
        >
          {/* Type indicator dot */}
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: TYPE_COLORS[entry.type]?.(colors) || colors.primary,
              marginRight: 12,
            }}
          />

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
              }}
            >
              {entry.summary}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                marginTop: 2,
              }}
            >
              {TYPE_LABELS[entry.type]} · {formatTime(entry.loggedAt)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
