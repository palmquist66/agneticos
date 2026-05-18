import { useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

type Pattern = {
  type: string;
  title: string;
  summary: string;
  detail: string;
  confidence: "low" | "medium" | "high";
  dataPoints: number;
};

type Props = {
  patterns: Pattern[];
};

function ConfidenceBadge({
  confidence,
  colors,
}: {
  confidence: Pattern["confidence"];
  colors: ReturnType<typeof getColors>;
}) {
  const badgeColors = {
    high: { bg: colors.successBg, text: colors.success },
    medium: { bg: colors.warningBg, text: colors.warning },
    low: { bg: colors.muted, text: colors.mutedForeground },
  };
  const { bg, text } = badgeColors[confidence];

  return (
    <View style={{ backgroundColor: bg, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
      <Text style={{ fontSize: 10, fontFamily: "Inter-Medium", color: text }}>
        {confidence}
      </Text>
    </View>
  );
}

function getColors(colorScheme: "light" | "dark") {
  return Colors[colorScheme];
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        backgroundColor: colors.card,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
                flex: 1,
              }}
              numberOfLines={expanded ? undefined : 1}
            >
              {pattern.title}
            </Text>
            <ConfidenceBadge confidence={pattern.confidence} colors={colors} />
          </View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter",
              color: colors.mutedForeground,
              marginTop: 2,
            }}
            numberOfLines={expanded ? undefined : 2}
          >
            {pattern.summary}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: colors.mutedForeground,
            marginTop: 2,
          }}
        >
          {expanded ? "\u25B2" : "\u25BC"}
        </Text>
      </View>

      {expanded && (
        <View
          style={{
            marginTop: 8,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            {pattern.detail}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Inter",
              color: colors.mutedForeground,
              opacity: 0.6,
              marginTop: 4,
            }}
          >
            Based on {pattern.dataPoints} data points
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function PatternCards({ patterns }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
        Patterns
      </Text>

      {patterns.length === 0 ? (
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          Keep logging — patterns appear after 7+ days of data.
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {patterns.map((p) => (
            <PatternCard key={p.type} pattern={p} />
          ))}
        </View>
      )}
    </View>
  );
}
