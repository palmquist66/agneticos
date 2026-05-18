import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import { MealConfirmation, type MealData } from "@/components/log/meal-confirmation";

type Stage = "input" | "analyzing" | "confirming";

type AnalysisResult = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export default function LogMealTextScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("input");
  const [description, setDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError("Please describe your meal");
      return;
    }

    setStage("analyzing");
    setError("");

    try {
      const data = await api<AnalysisResult>("/api/ai/analyze-food", {
        method: "POST",
        body: JSON.stringify({ text: description.trim(), mode: "meal" }),
      });

      setAnalysisResult(data);
      setStage("confirming");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze meal");
      setStage("input");
    }
  };

  const handleSave = async (data: MealData) => {
    setSaving(true);
    setError("");
    try {
      await api("/api/log/food", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          mealType: data.mealType,
          inputMethod: "text",
          notes: data.notes || undefined,
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setStage("input");
    setAnalysisResult(null);
    setError("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Log Meal
        </Text>

        {stage === "input" && (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                Describe your meal
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Grilled chicken breast with rice and steamed broccoli"
                placeholderTextColor={colors.mutedForeground}
                multiline
                autoFocus
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  fontFamily: "Inter",
                  color: colors.foreground,
                  minHeight: 120,
                  textAlignVertical: "top",
                }}
              />
            </View>

            <Pressable
              onPress={handleAnalyze}
              disabled={!description.trim()}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                opacity: !description.trim() ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
                Analyze Meal
              </Text>
            </Pressable>
          </View>
        )}

        {stage === "analyzing" && (
          <View style={{ gap: 16, alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              Analyzing your meal...
            </Text>
          </View>
        )}

        {stage === "confirming" && analysisResult && (
          <MealConfirmation
            initialData={analysisResult}
            onSave={handleSave}
            onRetry={handleRetry}
            saving={saving}
          />
        )}

        {error ? (
          <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.error, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
