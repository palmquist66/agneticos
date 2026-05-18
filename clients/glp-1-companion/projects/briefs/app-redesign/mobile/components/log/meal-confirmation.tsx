import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/colors";
import { ChipGroup } from "./chip-group";
import { NutritionDisplay } from "./nutrition-display";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export type MealData = {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: MealType;
  notes: string;
};

function suggestMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 15) return "lunch";
  if (hour < 20) return "dinner";
  return "snack";
}

export function MealConfirmation({
  initialData,
  onSave,
  onRetry,
  saving,
}: {
  initialData: {
    name: string;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  };
  onSave: (data: MealData) => void;
  onRetry: () => void;
  saving: boolean;
}) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [name, setName] = useState(initialData.name);
  const [calories, setCalories] = useState(initialData.calories);
  const [protein, setProtein] = useState(initialData.protein);
  const [carbs, setCarbs] = useState(initialData.carbs);
  const [fat, setFat] = useState(initialData.fat);
  const [mealType, setMealType] = useState<MealType>(suggestMealType());
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, calories, protein, carbs, fat, mealType, notes });
  };

  const nutritionFields = [
    { label: "Cal", value: calories, set: setCalories },
    { label: "Protein", value: protein, set: setProtein },
    { label: "Carbs", value: carbs, set: setCarbs },
    { label: "Fat", value: fat, set: setFat },
  ];

  return (
    <View style={{ gap: 16 }}>
      {/* Food name */}
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
          Food
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
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
          }}
        />
      </View>

      {/* Nutrition display */}
      <NutritionDisplay calories={calories} protein={protein} carbs={carbs} fat={fat} />

      {/* Editable nutrition fields */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {nutritionFields.map((field) => (
          <View key={field.label} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Inter",
                color: colors.mutedForeground,
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {field.label}
            </Text>
            <TextInput
              value={field.value !== null ? String(field.value) : ""}
              onChangeText={(text) => {
                const v = parseFloat(text);
                field.set(isNaN(v) ? null : v);
              }}
              keyboardType="decimal-pad"
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 8,
                fontSize: 14,
                fontFamily: "Inter",
                color: colors.foreground,
                textAlign: "center",
              }}
            />
          </View>
        ))}
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
          onPress={onRetry}
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
          disabled={saving || !name.trim()}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            opacity: saving || !name.trim() ? 0.5 : 1,
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
  );
}
