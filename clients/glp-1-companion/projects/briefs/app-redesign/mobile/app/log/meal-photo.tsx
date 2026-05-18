import { useState } from "react";
import { View, Text, Pressable, useColorScheme, ActivityIndicator, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import { MealConfirmation, type MealData } from "@/components/log/meal-confirmation";

type Stage = "idle" | "analyzing" | "confirming";

type AnalysisResult = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export default function LogMealPhotoScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("idle");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async (useCamera: boolean) => {
    setError("");

    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setError(useCamera ? "Camera permission is required" : "Photo library permission is required");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    await analyzeImage(asset.uri);
  };

  const analyzeImage = async (uri: string) => {
    setStage("analyzing");
    setError("");

    try {
      // Resize image to max 1024px, JPEG 0.8 quality
      const manipulated = await manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: SaveFormat.JPEG, base64: true }
      );

      if (!manipulated.base64) {
        throw new Error("Failed to convert image to base64");
      }

      const data = await api<AnalysisResult>("/api/ai/analyze-food", {
        method: "POST",
        body: JSON.stringify({ image: manipulated.base64, mode: "meal" }),
      });

      setAnalysisResult(data);
      setStage("confirming");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      setStage("idle");
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
          inputMethod: "photo",
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
    setStage("idle");
    setImageUri(null);
    setAnalysisResult(null);
    setError("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Log Meal (Photo)
        </Text>

        {stage === "idle" && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              Take a photo or choose from your gallery to analyze your meal.
            </Text>

            <Pressable
              onPress={() => pickImage(true)}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
                Take Photo
              </Text>
            </Pressable>

            <Pressable
              onPress={() => pickImage(false)}
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Inter-Medium", color: colors.foreground }}>
                Choose from Gallery
              </Text>
            </Pressable>
          </View>
        )}

        {stage === "analyzing" && (
          <View style={{ gap: 16, alignItems: "center" }}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
            )}
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              Analyzing your meal...
            </Text>
          </View>
        )}

        {stage === "confirming" && analysisResult && (
          <View style={{ gap: 16 }}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: 160,
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
            )}
            <MealConfirmation
              initialData={analysisResult}
              onSave={handleSave}
              onRetry={handleRetry}
              saving={saving}
            />
          </View>
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
