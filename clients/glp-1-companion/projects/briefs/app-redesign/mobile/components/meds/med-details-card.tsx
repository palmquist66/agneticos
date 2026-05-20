import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { ChipGroup } from "@/components/log/chip-group";
import type { AppColors } from "@/constants/colors";

interface Props {
  scheduleId: string;
  dosage: string;
  frequency: string;
  days: string[];
  times: string[];
  colors: AppColors;
  onUpdated: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: "daily" as const, label: "Daily" },
  { value: "weekly" as const, label: "Weekly" },
  { value: "specific_days" as const, label: "Specific Days" },
  { value: "as_needed" as const, label: "As Needed" },
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

function formatFrequency(frequency: string, days: string[]) {
  if (frequency === "daily") return "Daily";
  if (frequency === "weekly")
    return days.length > 0 ? `Weekly (${days[0]})` : "Weekly";
  if (frequency === "specific_days")
    return days.map((d) => d.slice(0, 3)).join(", ");
  if (frequency === "as_needed") return "As Needed";
  return frequency;
}

export function MedDetailsCard({
  scheduleId,
  dosage,
  frequency,
  days,
  times,
  colors,
  onUpdated,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editDosage, setEditDosage] = useState(dosage);
  const [editFreq, setEditFreq] = useState(frequency);
  const [editDays, setEditDays] = useState<string[]>(days);
  const [editTimes, setEditTimes] = useState(times.join(", "));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!editDosage.trim()) {
      setError("Dosage is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api(`/api/meds/${scheduleId}`, {
        method: "PATCH",
        body: JSON.stringify({
          dosage: editDosage.trim(),
          frequency: editFreq,
          days: editDays,
          times: editTimes
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-SemiBold",
              color: colors.foreground,
            }}
          >
            Details
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setEditing(true);
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: colors.muted,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter-Medium",
                color: colors.mutedForeground,
              }}
            >
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              Dosage
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
              }}
            >
              {dosage}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              Frequency
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-Medium",
                color: colors.foreground,
              }}
            >
              {formatFrequency(frequency, days)}
            </Text>
          </View>

          {times.length > 0 && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter",
                  color: colors.mutedForeground,
                }}
              >
                Time
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-Medium",
                  color: colors.foreground,
                }}
              >
                {times.join(", ")}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Edit mode
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-SemiBold",
            color: colors.foreground,
          }}
        >
          Edit Details
        </Text>
        <Pressable
          onPress={() => {
            setEditing(false);
            setEditDosage(dosage);
            setEditFreq(frequency);
            setEditDays(days);
            setEditTimes(times.join(", "));
            setError("");
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: colors.muted,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Inter-Medium",
              color: colors.mutedForeground,
            }}
          >
            Cancel
          </Text>
        </Pressable>
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
          value={editDosage}
          onChangeText={setEditDosage}
          placeholder="e.g. 0.5mg"
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
        value={editFreq}
        onChange={(val) => setEditFreq(val as string)}
      />

      {/* Days (conditional) */}
      {(editFreq === "weekly" || editFreq === "specific_days") && (
        <ChipGroup
          label="Days"
          options={DAY_OPTIONS}
          value={editDays}
          onChange={(val) => setEditDays(val as string[])}
          multiple={editFreq === "specific_days"}
        />
      )}

      {/* Times */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Inter-Medium",
            color: colors.mutedForeground,
          }}
        >
          Time(s)
        </Text>
        <TextInput
          value={editTimes}
          onChangeText={setEditTimes}
          placeholder="e.g. 08:00, 20:00"
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

      <Pressable
        onPress={handleSave}
        disabled={loading || !editDosage.trim()}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          opacity: loading || !editDosage.trim() ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Inter-SemiBold",
              color: colors.primaryForeground,
            }}
          >
            Save Changes
          </Text>
        )}
      </Pressable>
    </View>
  );
}
