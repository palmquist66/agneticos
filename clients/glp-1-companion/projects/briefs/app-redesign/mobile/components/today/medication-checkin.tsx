import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import type { AppColors } from "@/constants/colors";

interface ScheduledMed {
  id: string;
  medName: string;
  dosage: string;
  taken: boolean;
  logId: string | null;
}

interface Props {
  meds: ScheduledMed[];
  colors: AppColors;
  onToggle: () => void;
}

export function MedicationCheckin({ meds, colors, onToggle }: Props) {
  const handleToggle = async (med: ScheduledMed) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (med.taken && med.logId) {
        // Untake — delete the log
        await api(`/api/log/medication/${med.logId}`, { method: "DELETE" });
      } else {
        // Take — create a log
        await api("/api/log/glp1-dose", {
          method: "POST",
          body: JSON.stringify({
            scheduleId: med.id,
            medName: med.medName,
            dosage: med.dosage,
          }),
        });
      }

      onToggle();
    } catch (err) {
      console.error("Toggle med error:", err);
    }
  };

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
        Medications
      </Text>

      {meds.map((med) => (
        <Pressable
          key={med.id}
          onPress={() => handleToggle(med)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            gap: 12,
          }}
        >
          {/* Checkbox */}
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: med.taken ? colors.success : colors.border,
              backgroundColor: med.taken ? colors.success : "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {med.taken && (
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                ✓
              </Text>
            )}
          </View>

          {/* Med info */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: med.taken ? colors.mutedForeground : colors.foreground,
                textDecorationLine: med.taken ? "line-through" : "none",
              }}
            >
              {med.medName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              {med.dosage}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
