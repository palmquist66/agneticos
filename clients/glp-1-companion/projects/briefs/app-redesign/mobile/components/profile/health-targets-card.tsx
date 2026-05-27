import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, type AppColors } from "@/constants/colors";
import { api } from "@/lib/api";

interface HealthTargetsCardProps {
  goalWeight: number | null;
  proteinTarget: number | null;
  glucoseMin: number | null;
  glucoseMax: number | null;
  onUpdate: (data: {
    goalWeight: number | null;
    proteinTarget: number | null;
    glucoseMin: number | null;
    glucoseMax: number | null;
  }) => void;
}

export function HealthTargetsCard({
  goalWeight,
  proteinTarget,
  glucoseMin,
  glucoseMax,
  onUpdate,
}: HealthTargetsCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [weightVal, setWeightVal] = useState(goalWeight?.toString() ?? "");
  const [proteinVal, setProteinVal] = useState(proteinTarget?.toString() ?? "");
  const [gMinVal, setGMinVal] = useState(glucoseMin?.toString() ?? "");
  const [gMaxVal, setGMaxVal] = useState(glucoseMax?.toString() ?? "");

  const startEditing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeightVal(goalWeight?.toString() ?? "");
    setProteinVal(proteinTarget?.toString() ?? "");
    setGMinVal(glucoseMin?.toString() ?? "");
    setGMaxVal(glucoseMax?.toString() ?? "");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setWeightVal(goalWeight?.toString() ?? "");
    setProteinVal(proteinTarget?.toString() ?? "");
    setGMinVal(glucoseMin?.toString() ?? "");
    setGMaxVal(glucoseMax?.toString() ?? "");
    setError("");
    setEditing(false);
  };

  const validate = (): string | null => {
    const w = weightVal.trim() ? parseFloat(weightVal) : null;
    const p = proteinVal.trim() ? parseInt(proteinVal, 10) : null;
    const gMin = gMinVal.trim() ? parseInt(gMinVal, 10) : null;
    const gMax = gMaxVal.trim() ? parseInt(gMaxVal, 10) : null;

    if (w !== null && (isNaN(w) || w < 50 || w > 500)) {
      return "Goal weight must be between 50 and 500 lbs";
    }
    if (p !== null && (isNaN(p) || p < 20 || p > 500)) {
      return "Protein target must be between 20 and 500g";
    }
    if (gMin !== null && (isNaN(gMin) || gMin < 40 || gMin > 200)) {
      return "Glucose min must be between 40 and 200 mg/dL";
    }
    if (gMax !== null && (isNaN(gMax) || gMax < 100 || gMax > 400)) {
      return "Glucose max must be between 100 and 400 mg/dL";
    }
    if (gMin !== null && gMax !== null && gMin >= gMax) {
      return "Glucose min must be less than max";
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      goalWeight: weightVal.trim() ? parseFloat(weightVal) : null,
      proteinTarget: proteinVal.trim() ? parseInt(proteinVal, 10) : null,
      glucoseMin: gMinVal.trim() ? parseInt(gMinVal, 10) : null,
      glucoseMax: gMaxVal.trim() ? parseInt(gMaxVal, 10) : null,
    };

    try {
      await api("/api/user/health-targets", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUpdate(payload);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: colors.foreground,
    textAlign: "center" as const,
  };

  // ─── Edit mode ───────────────────────────────────────────
  if (editing) {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 16,
        }}
      >
        {/* Header */}
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
            Health Targets
          </Text>
          <Pressable onPress={cancelEditing} hitSlop={8}>
            <Text style={{ fontSize: 18, color: colors.mutedForeground }}>
              ✕
            </Text>
          </Pressable>
        </View>

        {/* Goal weight */}
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-Medium",
              color: colors.mutedForeground,
            }}
          >
            Goal weight (lbs)
          </Text>
          <TextInput
            value={weightVal}
            onChangeText={setWeightVal}
            placeholder="e.g. 165"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="decimal-pad"
            style={inputStyle}
          />
        </View>

        {/* Protein target */}
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-Medium",
              color: colors.mutedForeground,
            }}
          >
            Daily protein target (g)
          </Text>
          <TextInput
            value={proteinVal}
            onChangeText={setProteinVal}
            placeholder="e.g. 100"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            style={inputStyle}
          />
        </View>

        {/* Glucose range */}
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-Medium",
              color: colors.mutedForeground,
            }}
          >
            Glucose target range (mg/dL)
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <TextInput
              value={gMinVal}
              onChangeText={setGMinVal}
              placeholder="70"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{ ...inputStyle, flex: 1 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter",
                color: colors.mutedForeground,
              }}
            >
              to
            </Text>
            <TextInput
              value={gMaxVal}
              onChangeText={setGMaxVal}
              placeholder="180"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              style={{ ...inputStyle, flex: 1 }}
            />
          </View>
        </View>

        {/* Error */}
        {error ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter",
              color: colors.error,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter-SemiBold",
                color: colors.primaryForeground,
              }}
            >
              Save Targets
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  // ─── Read mode ───────────────────────────────────────────
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
      }}
    >
      {/* Header */}
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
          Health Targets
        </Text>
        <Pressable onPress={startEditing} hitSlop={8}>
          <Text style={{ fontSize: 16, color: colors.mutedForeground }}>
            ✏️
          </Text>
        </Pressable>
      </View>

      {/* Rows */}
      <TargetRow
        label="Goal Weight"
        value={goalWeight != null ? `${goalWeight} lbs` : null}
        colors={colors}
      />
      <TargetRow
        label="Daily Protein"
        value={proteinTarget != null ? `${proteinTarget}g` : null}
        colors={colors}
      />
      <TargetRow
        label="Glucose Range"
        value={
          glucoseMin != null && glucoseMax != null
            ? `${glucoseMin}–${glucoseMax} mg/dL`
            : glucoseMin != null
              ? `${glucoseMin}+ mg/dL`
              : glucoseMax != null
                ? `≤${glucoseMax} mg/dL`
                : null
        }
        colors={colors}
      />
    </View>
  );
}

function TargetRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string | null;
  colors: AppColors;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter",
          color: colors.mutedForeground,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter-SemiBold",
          color: value ? colors.foreground : colors.mutedForeground,
        }}
      >
        {value ?? "Not set"}
      </Text>
    </View>
  );
}
