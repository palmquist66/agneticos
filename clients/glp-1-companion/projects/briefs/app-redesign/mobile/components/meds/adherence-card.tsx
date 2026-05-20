import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface Props {
  adherence: {
    rate: number;
    taken: number;
    missed: number;
    skipped: number;
    total: number;
  };
  colors: AppColors;
}

export function AdherenceCard({ adherence, colors }: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
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
        Adherence
      </Text>

      {adherence.total === 0 ? (
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter",
            color: colors.mutedForeground,
          }}
        >
          No doses logged yet.
        </Text>
      ) : (
        <View style={{ gap: 12 }}>
          {/* Rate bar */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                Adherence rate
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-SemiBold",
                  color: colors.foreground,
                }}
              >
                {adherence.rate}%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.muted,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${adherence.rate}%`,
                  borderRadius: 4,
                  backgroundColor: colors.success,
                }}
              />
            </View>
          </View>

          {/* Counts */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.successBg,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter-SemiBold",
                  color: colors.success,
                }}
              >
                {adherence.taken}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter",
                  color: colors.success,
                }}
              >
                Taken
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.errorBg,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter-SemiBold",
                  color: colors.error,
                }}
              >
                {adherence.missed}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter",
                  color: colors.error,
                }}
              >
                Missed
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.muted,
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Inter-SemiBold",
                  color: colors.mutedForeground,
                }}
              >
                {adherence.skipped}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                Skipped
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
