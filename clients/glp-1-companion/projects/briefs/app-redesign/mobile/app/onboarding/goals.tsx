import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";

export default function OnboardingGoalsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [goalWeight, setGoalWeight] = useState("");
  const [proteinTarget, setProteinTarget] = useState("100");
  const [glucoseMin, setGlucoseMin] = useState("70");
  const [glucoseMax, setGlucoseMax] = useState("180");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    setLoading(true);
    setError("");
    try {
      await api("/api/onboarding/goals", {
        method: "POST",
        body: JSON.stringify({
          goalWeight: goalWeight || null,
          proteinTarget: proteinTarget || null,
          glucoseMin: glucoseMin || null,
          glucoseMax: glucoseMax || null,
        }),
      });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push("/onboarding/connect");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/connect");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Set your goals
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
          These help us personalize your dashboard. You can change them later.
        </Text>

        {/* Goal weight */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
            Goal weight (lbs)
          </Text>
          <TextInput
            value={goalWeight}
            onChangeText={setGoalWeight}
            placeholder="e.g. 165"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="decimal-pad"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 20,
              fontFamily: "Inter-SemiBold",
              color: colors.foreground,
              textAlign: "center",
            }}
          />
        </View>

        {/* Protein target */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
            Daily protein target (g)
          </Text>
          <TextInput
            value={proteinTarget}
            onChangeText={setProteinTarget}
            placeholder="100"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 20,
              fontFamily: "Inter-SemiBold",
              color: colors.foreground,
              textAlign: "center",
            }}
          />
        </View>

        {/* Glucose range */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
            Glucose target range (mg/dL)
          </Text>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <TextInput
              value={glucoseMin}
              onChangeText={setGlucoseMin}
              placeholder="70"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 20,
                fontFamily: "Inter-SemiBold",
                color: colors.foreground,
                textAlign: "center",
              }}
            />
            <Text style={{ fontSize: 16, fontFamily: "Inter", color: colors.mutedForeground }}>
              to
            </Text>
            <TextInput
              value={glucoseMax}
              onChangeText={setGlucoseMax}
              placeholder="180"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 20,
                fontFamily: "Inter-SemiBold",
                color: colors.foreground,
                textAlign: "center",
              }}
            />
          </View>
        </View>

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
