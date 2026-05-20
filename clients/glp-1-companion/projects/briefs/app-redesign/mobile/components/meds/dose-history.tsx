import { View, Text } from "react-native";
import type { AppColors } from "@/constants/colors";

interface MedicationLogEntry {
  id: string;
  status: string;
  loggedAt: string;
}

interface Props {
  logs: MedicationLogEntry[];
  colors: AppColors;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function getStatusIcon(status: string) {
  if (status === "taken") return "✓";
  if (status === "missed") return "✗";
  return "↷";
}

function getStatusColor(status: string, colors: AppColors) {
  if (status === "taken") return colors.success;
  if (status === "missed") return colors.error;
  return colors.mutedForeground;
}

export function DoseHistory({ logs, colors }: Props) {
  if (logs.length === 0) return null;

  const recentLogs = logs.slice(0, 10);

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
        Recent History
      </Text>

      <View style={{ gap: 8 }}>
        {recentLogs.map((log) => {
          const statusColor = getStatusColor(log.status, colors);
          return (
            <View
              key={log.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-SemiBold",
                  color: statusColor,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {getStatusIcon(log.status)}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: "Inter",
                  color: colors.foreground,
                  textTransform: "capitalize",
                }}
              >
                {log.status}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                {formatDate(log.loggedAt)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
