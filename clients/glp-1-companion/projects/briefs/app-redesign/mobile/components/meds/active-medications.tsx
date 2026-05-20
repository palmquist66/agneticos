import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import type { AppColors } from "@/constants/colors";

interface MedicationSchedule {
  id: string;
  medName: string;
  dosage: string;
  frequency: string;
  isGlp1: boolean;
  active: boolean;
}

interface Props {
  medications: MedicationSchedule[];
  colors: AppColors;
}

function formatFrequency(frequency: string) {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekly") return "Weekly";
  if (frequency === "specific_days") return "Specific days";
  if (frequency === "as_needed") return "As needed";
  return frequency;
}

export function ActiveMedications({ medications, colors }: Props) {
  const router = useRouter();

  if (medications.length === 0) return null;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          Active Medications
        </Text>
      </View>

      {medications.map((med, index) => (
        <Pressable
          key={med.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/meds/${med.id}` as any);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderTopWidth: index > 0 ? 1 : 0,
            borderTopColor: colors.border,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>{med.isGlp1 ? "💉" : "💊"}</Text>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Inter-SemiBold",
                color: colors.foreground,
              }}
            >
              {med.medName}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                marginTop: 2,
              }}
            >
              {med.dosage} · {formatFrequency(med.frequency)}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              color: colors.mutedForeground,
            }}
          >
            ›
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
