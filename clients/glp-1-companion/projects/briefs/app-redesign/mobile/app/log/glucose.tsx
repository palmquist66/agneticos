import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";

const CONTEXTS = [
  { value: "fasting", label: "Fasting" },
  { value: "before_meal", label: "Before Meal" },
  { value: "after_meal", label: "After Meal" },
  { value: "bedtime", label: "Bedtime" },
];

export default function LogGlucoseScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [value, setValue] = useState("");
  const [context, setContext] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 40 || val > 600) {
      setError("Enter a value between 40-600 mg/dL");
      return;
    }
    if (!context) {
      setError("Please select a context");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/log/glucose", {
        method: "POST",
        body: JSON.stringify({ value: val, context, notes: notes || undefined }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, gap: 20 }}>
      <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
        Log Glucose
      </Text>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
          Reading (mg/dL)
        </Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="e.g. 105"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="decimal-pad"
          autoFocus
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            fontSize: 24,
            fontFamily: "Inter-SemiBold",
            color: colors.foreground,
            textAlign: "center",
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
          Context
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {CONTEXTS.map((ctx) => (
            <Pressable
              key={ctx.value}
              onPress={() => {
                setContext(ctx.value);
                Haptics.selectionAsync();
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: context === ctx.value ? colors.primary : colors.card,
                borderWidth: 1,
                borderColor: context === ctx.value ? colors.primary : colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-Medium",
                  color: context === ctx.value ? colors.primaryForeground : colors.foreground,
                }}
              >
                {ctx.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
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
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            fontFamily: "Inter",
            color: colors.foreground,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
      </View>

      {error ? (
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.error, textAlign: "center" }}>
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={loading || !value.trim()}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          opacity: loading || !value.trim() ? 0.6 : 1,
          marginTop: "auto",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Save Glucose
          </Text>
        )}
      </Pressable>
    </View>
  );
}
