import { useState } from "react";
import { View, Text, TextInput, Pressable, useColorScheme, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";
import { ChipGroup } from "@/components/log/chip-group";

const SYMPTOM_OPTIONS = [
  { value: "nausea", label: "Nausea" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "constipation", label: "Constipation" },
  { value: "stomach_pain", label: "Stomach Pain" },
  { value: "headache", label: "Headache" },
  { value: "fatigue", label: "Fatigue" },
  { value: "dizziness", label: "Dizziness" },
  { value: "reduced_appetite", label: "Reduced Appetite" },
  { value: "injection_site", label: "Injection Site Reaction" },
  { value: "other", label: "Other" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
] as const;

export default function LogSideEffectScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }
    if (!severity) {
      setError("Please select severity");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/log/side-effect", {
        method: "POST",
        body: JSON.stringify({
          symptoms,
          severity,
          notes: notes || undefined,
        }),
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Log Side Effect
        </Text>

        {/* Symptoms - multi-select */}
        <ChipGroup
          options={[...SYMPTOM_OPTIONS]}
          value={symptoms}
          onChange={(v) => setSymptoms(v as string[])}
          multiple
          label="Symptoms (select all that apply)"
        />

        {/* Severity - single select */}
        <ChipGroup
          options={[...SEVERITY_OPTIONS]}
          value={severity}
          onChange={(v) => setSeverity(v as string)}
          label="Severity"
        />

        {/* Notes */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: colors.mutedForeground }}>
            Notes (optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional details..."
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
      </ScrollView>

      {/* Fixed save button at bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 24,
          paddingBottom: 40,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          onPress={handleSave}
          disabled={loading || symptoms.length === 0 || !severity}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            opacity: loading || symptoms.length === 0 || !severity ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
              Save Side Effect
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
