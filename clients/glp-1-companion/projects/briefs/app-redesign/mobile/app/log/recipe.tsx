import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import { NutritionDisplay } from "@/components/log/nutrition-display";
import { ChipGroup } from "@/components/log/chip-group";

type Stage = "input" | "analyzing" | "confirming";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

type RecipeAnalysis = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  servings?: number;
};

function suggestMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export default function LogRecipeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("input");
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<RecipeAnalysis | null>(null);
  const [totalServings, setTotalServings] = useState(4);
  const [servingsEaten, setServingsEaten] = useState(1);
  const [mealType, setMealType] = useState<MealType>(suggestMealType());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      setError("Please enter your recipe ingredients");
      return;
    }

    setStage("analyzing");
    setError("");

    try {
      const data = await api<RecipeAnalysis>("/api/ai/analyze-food", {
        method: "POST",
        body: JSON.stringify({ text: ingredients.trim(), mode: "recipe" }),
      });

      setRecipe(data);
      if (data.servings) setTotalServings(data.servings);
      setStage("confirming");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze recipe");
      setStage("input");
    }
  };

  const portionMultiplier = totalServings > 0 ? servingsEaten / totalServings : 1;

  const perPortion = recipe
    ? {
        calories: recipe.calories !== null ? Math.round(recipe.calories * portionMultiplier) : null,
        protein: recipe.protein !== null ? Math.round(recipe.protein * portionMultiplier) : null,
        carbs: recipe.carbs !== null ? Math.round(recipe.carbs * portionMultiplier) : null,
        fat: recipe.fat !== null ? Math.round(recipe.fat * portionMultiplier) : null,
      }
    : null;

  const handleSave = async () => {
    if (!recipe || !perPortion) return;

    setSaving(true);
    setError("");
    try {
      await api("/api/log/food", {
        method: "POST",
        body: JSON.stringify({
          name: recipe.name,
          calories: perPortion.calories,
          protein: perPortion.protein,
          carbs: perPortion.carbs,
          fat: perPortion.fat,
          mealType,
          inputMethod: "recipe",
          servings: servingsEaten,
          notes: notes || undefined,
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
    setRecipe(null);
    setError("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Log Recipe
        </Text>

        {stage === "input" && (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                Ingredients
              </Text>
              <TextInput
                value={ingredients}
                onChangeText={setIngredients}
                placeholder={"e.g.\n2 chicken breasts\n1 cup rice\n2 tbsp olive oil\n1 cup broccoli"}
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
                  minHeight: 160,
                  textAlignVertical: "top",
                }}
              />
            </View>

            <Pressable
              onPress={handleAnalyze}
              disabled={!ingredients.trim()}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                opacity: !ingredients.trim() ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
                Analyze Recipe
              </Text>
            </Pressable>
          </View>
        )}

        {stage === "analyzing" && (
          <View style={{ gap: 16, alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              Analyzing your recipe...
            </Text>
          </View>
        )}

        {stage === "confirming" && recipe && perPortion && (
          <View style={{ gap: 16 }}>
            {/* Recipe name */}
            <View
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.foreground }}>
                {recipe.name}
              </Text>
            </View>

            {/* Total nutrition */}
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                Total Recipe Nutrition
              </Text>
              <NutritionDisplay
                calories={recipe.calories}
                protein={recipe.protein}
                carbs={recipe.carbs}
                fat={recipe.fat}
              />
            </View>

            {/* Servings controls */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                  Total Servings
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pressable
                    onPress={() => setTotalServings(Math.max(1, totalServings - 1))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.foreground }}>-</Text>
                  </Pressable>
                  <Text style={{ fontSize: 20, fontFamily: "Inter-SemiBold", color: colors.foreground, minWidth: 30, textAlign: "center" }}>
                    {totalServings}
                  </Text>
                  <Pressable
                    onPress={() => setTotalServings(totalServings + 1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.foreground }}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                  Servings Eaten
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pressable
                    onPress={() => setServingsEaten(Math.max(0.5, servingsEaten - 0.5))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.foreground }}>-</Text>
                  </Pressable>
                  <Text style={{ fontSize: 20, fontFamily: "Inter-SemiBold", color: colors.foreground, minWidth: 30, textAlign: "center" }}>
                    {servingsEaten}
                  </Text>
                  <Pressable
                    onPress={() => setServingsEaten(Math.min(totalServings, servingsEaten + 0.5))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 18, color: colors.foreground }}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Per-portion nutrition */}
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                Your Portion ({servingsEaten} of {totalServings})
              </Text>
              <NutritionDisplay
                calories={perPortion.calories}
                protein={perPortion.protein}
                carbs={perPortion.carbs}
                fat={perPortion.fat}
              />
            </View>

            {/* Meal type */}
            <ChipGroup
              options={MEAL_OPTIONS}
              value={mealType}
              onChange={(v) => setMealType(v as MealType)}
              label="Meal type"
            />

            {/* Notes */}
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
                Notes (optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any notes..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                style={{
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  fontFamily: "Inter",
                  color: colors.foreground,
                  minHeight: 60,
                  textAlignVertical: "top",
                }}
              />
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={handleRetry}
                disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: saving ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.foreground }}>
                  Retry
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {saving ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={{ fontSize: 14, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
                    Save
                  </Text>
                )}
              </Pressable>
            </View>
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
