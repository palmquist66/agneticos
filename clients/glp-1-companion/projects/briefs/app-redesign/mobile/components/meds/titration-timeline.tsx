import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface TitrationStep {
  id: string;
  medName: string;
  dosage: string;
  order: number;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
}

interface Props {
  steps: TitrationStep[];
  colors: AppColors;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

function getStatusColor(status: string, colors: AppColors) {
  if (status === "completed") return colors.success;
  if (status === "current") return colors.primary;
  return colors.mutedForeground;
}

function getStatusBg(status: string, colors: AppColors) {
  if (status === "completed") return colors.successBg;
  if (status === "current") return colors.secondary;
  return colors.muted;
}

export function TitrationTimeline({ steps, colors }: Props) {
  if (steps.length === 0) return null;

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
          marginBottom: 16,
        }}
      >
        Titration Timeline
      </Text>

      {steps.map((step, index) => {
        const statusColor = getStatusColor(step.status, colors);
        const statusBg = getStatusBg(step.status, colors);
        const isLast = index === steps.length - 1;

        return (
          <View
            key={step.id}
            style={{
              flexDirection: "row",
              gap: 12,
              minHeight: 52,
            }}
          >
            {/* Timeline connector */}
            <View style={{ alignItems: "center", width: 20 }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    step.status === "completed" || step.status === "current"
                      ? statusColor
                      : "transparent",
                  borderWidth: 2,
                  borderColor: statusColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {step.status === "completed" && (
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: colors.border,
                    marginVertical: 2,
                  }}
                />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingBottom: isLast ? 0 : 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter-SemiBold",
                    color: colors.foreground,
                  }}
                >
                  {step.dosage}
                </Text>
                <View
                  style={{
                    backgroundColor: statusBg,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Inter-Medium",
                      color: statusColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {step.status}
                  </Text>
                </View>
              </View>

              {(step.startedAt || step.endedAt) && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter",
                    color: colors.mutedForeground,
                    marginTop: 2,
                  }}
                >
                  {step.startedAt ? formatDate(step.startedAt) : ""}
                  {step.startedAt && step.endedAt ? " – " : ""}
                  {step.endedAt ? formatDate(step.endedAt) : ""}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
