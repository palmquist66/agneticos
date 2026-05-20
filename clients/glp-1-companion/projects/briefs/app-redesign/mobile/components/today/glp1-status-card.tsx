import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface Glp1Status {
  medName: string;
  dosage: string;
  dayOfCycle: number;
  nextDoseDate: string;
  isOverdue: boolean;
  lastDoseDate: string;
}

interface Props {
  status: Glp1Status;
  colors: AppColors;
}

export function Glp1StatusCard({ status, colors }: Props) {
  const daysLeft = 7 - status.dayOfCycle;
  const progress = status.dayOfCycle / 7;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: status.isOverdue ? colors.error : colors.border,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-SemiBold",
              color: colors.foreground,
            }}
          >
            {status.medName}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Inter",
              color: colors.mutedForeground,
            }}
          >
            {status.dosage}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: status.isOverdue ? colors.errorBg : colors.successBg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter-SemiBold",
              color: status.isOverdue ? colors.error : colors.success,
            }}
          >
            {status.isOverdue ? "Overdue" : `Day ${status.dayOfCycle}/7`}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          marginTop: 16,
          height: 6,
          backgroundColor: colors.muted,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${Math.min(progress * 100, 100)}%`,
            height: "100%",
            backgroundColor: status.isOverdue ? colors.error : colors.primary,
            borderRadius: 3,
          }}
        />
      </View>

      {/* Footer */}
      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          fontFamily: "Inter",
          color: colors.mutedForeground,
        }}
      >
        {status.isOverdue
          ? "Your next dose is overdue"
          : `Next dose in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
      </Text>
    </View>
  );
}
