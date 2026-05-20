import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";

export default function LogWeightScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const val = parseFloat(weight);
    if (isNaN(val) || val < 50 || val > 500) {
      setError("Enter a weight between 50-500 lbs");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/log/weight", {
        method: "POST",
        body: JSON.stringify({ weight: val, notes: notes || undefined }),
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
        Log Weight
      </Text>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
          Weight (lbs)
        </Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g. 185"
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
        disabled={loading || !weight.trim()}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          opacity: loading || !weight.trim() ? 0.6 : 1,
          marginTop: "auto",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Save Weight
          </Text>
        )}
      </Pressable>
    </View>
  );
}
