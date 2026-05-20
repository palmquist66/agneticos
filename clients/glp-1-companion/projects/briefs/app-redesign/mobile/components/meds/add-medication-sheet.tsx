import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { ChipGroup } from "@/components/log/chip-group";
import type { AppColors } from "@/constants/colors";

interface Props {
  colors: AppColors;
  onAdded: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: "daily" as const, label: "Daily" },
  { value: "weekly" as const, label: "Weekly" },
  { value: "specific_days" as const, label: "Specific Days" },
];

const DAY_OPTIONS = [
  { value: "monday" as const, label: "Mon" },
  { value: "tuesday" as const, label: "Tue" },
  { value: "wednesday" as const, label: "Wed" },
  { value: "thursday" as const, label: "Thu" },
  { value: "friday" as const, label: "Fri" },
  { value: "saturday" as const, label: "Sat" },
  { value: "sunday" as const, label: "Sun" },
];

export function AddMedicationSheet({ colors, onAdded }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState("08:00");
  const [isGlp1, setIsGlp1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    bottomSheetRef.current?.expand();
  }, []);

  const resetForm = () => {
    setMedName("");
    setDosage("");
    setFrequency("daily");
    setSelectedDays([]);
    setTime("08:00");
    setIsGlp1(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (!medName.trim() || !dosage.trim()) {
      setError("Name and dosage are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/meds", {
        method: "POST",
        body: JSON.stringify({
          medName: medName.trim(),
          dosage: dosage.trim(),
          frequency,
          days: selectedDays,
          times: time ? [time] : [],
          isGlp1,
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      bottomSheetRef.current?.close();
      resetForm();
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add medication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <Pressable
        onPress={handleOpen}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.accent,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            color: colors.accentForeground,
            marginTop: -2,
          }}
        >
          +
        </Text>
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors.card,
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.muted,
          width: 40,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-SemiBold",
              color: colors.foreground,
            }}
          >
            Add Medication
          </Text>

          {/* Med Name */}
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.mutedForeground,
              }}
            >
              Medication Name
            </Text>
            <TextInput
              value={medName}
              onChangeText={setMedName}
              placeholder="e.g. Metformin, Vitamin D"
              placeholderTextColor={colors.mutedForeground}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                fontFamily: "Inter",
                color: colors.foreground,
              }}
            />
          </View>

          {/* Dosage */}
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.mutedForeground,
              }}
            >
              Dosage
            </Text>
            <TextInput
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g. 500mg, 1000IU"
              placeholderTextColor={colors.mutedForeground}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                fontFamily: "Inter",
                color: colors.foreground,
              }}
            />
          </View>

          {/* Frequency */}
          <ChipGroup
            label="Frequency"
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={(val) => setFrequency(val as string)}
          />

          {/* Days (conditional) */}
          {(frequency === "weekly" || frequency === "specific_days") && (
            <ChipGroup
              label={frequency === "weekly" ? "Day of Week" : "Select Days"}
              options={DAY_OPTIONS}
              value={selectedDays}
              onChange={(val) => setSelectedDays(val as string[])}
              multiple={frequency === "specific_days"}
            />
          )}

          {/* Time */}
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.mutedForeground,
              }}
            >
              Time (HH:MM)
            </Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="08:00"
              placeholderTextColor={colors.mutedForeground}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                fontFamily: "Inter",
                color: colors.foreground,
              }}
            />
          </View>

          {/* GLP-1 Toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter",
                color: colors.foreground,
                flex: 1,
              }}
            >
              This is a GLP-1 medication (injection)
            </Text>
            <Switch
              value={isGlp1}
              onValueChange={setIsGlp1}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          {/* Error */}
          {error ? (
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter",
                color: colors.error,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading || !medName.trim() || !dosage.trim()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              opacity:
                loading || !medName.trim() || !dosage.trim() ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter-SemiBold",
                  color: colors.primaryForeground,
                }}
              >
                Add Medication
              </Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
