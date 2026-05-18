import { useState } from "react";
import { View, Text, Pressable, useColorScheme, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";

const MEDICATIONS = [
  { name: "Ozempic", dosages: ["0.25mg", "0.5mg", "1mg", "2mg"] },
  { name: "Wegovy", dosages: ["0.25mg", "0.5mg", "1mg", "1.7mg", "2.4mg"] },
  { name: "Mounjaro", dosages: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"] },
  { name: "Zepbound", dosages: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"] },
  { name: "Saxenda", dosages: ["0.6mg", "1.2mg", "1.8mg", "2.4mg", "3mg"] },
  { name: "Victoza", dosages: ["0.6mg", "1.2mg", "1.8mg"] },
  { name: "Trulicity", dosages: ["0.75mg", "1.5mg", "3mg", "4.5mg"] },
  { name: "Rybelsus", dosages: ["3mg", "7mg", "14mg"] },
];

export default function OnboardingMedicationScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const [selectedDosage, setSelectedDosage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMed = MEDICATIONS.find((m) => m.name === selectedMed);

  const handleNext = async () => {
    setLoading(true);
    setError("");
    try {
      await api("/api/onboarding/medication", {
        method: "POST",
        body: JSON.stringify({
          glp1Med: selectedMed,
          glp1Dosage: selectedDosage,
        }),
      });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push("/onboarding/goals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/goals");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          What are you taking?
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
          Select your GLP-1 medication so we can track your doses.
        </Text>

        {/* Medication grid */}
        <View style={{ gap: 8 }}>
          {[MEDICATIONS.slice(0, 2), MEDICATIONS.slice(2, 4), MEDICATIONS.slice(4, 6), MEDICATIONS.slice(6, 8)].map((row, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8 }}>
              {row.map((med) => {
                const isSelected = selectedMed === med.name;
                return (
                  <Pressable
                    key={med.name}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedMed(med.name);
                      setSelectedDosage(null);
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.secondary : colors.card,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: isSelected ? "Inter-SemiBold" : "Inter-Medium",
                        color: isSelected ? colors.primary : colors.foreground,
                      }}
                    >
                      {med.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Dosage selector */}
        {currentMed && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
              Current dosage
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {currentMed.dosages.map((dosage) => {
                const isSelected = selectedDosage === dosage;
                return (
                  <Pressable
                    key={dosage}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedDosage(dosage);
                    }}
                    style={{
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter-Medium",
                        color: isSelected ? colors.primaryForeground : colors.foreground,
                      }}
                    >
                      {dosage}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {error ? (
          <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.error, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Bottom buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 24,
          paddingBottom: 40,
          backgroundColor: colors.background,
          gap: 12,
        }}
      >
        <Pressable
          onPress={handleNext}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
              Next
            </Text>
          )}
        </Pressable>
        <Pressable onPress={handleSkip} style={{ alignItems: "center", paddingVertical: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
