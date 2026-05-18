import { useState } from "react";
import { View, Text, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/api";
import { Colors } from "@/constants/colors";

const TIPS = [
  {
    icon: "+",
    title: "Log with the + button",
    description: "Tap the orange + button to log weight, meals, doses, and more.",
  },
  {
    icon: "📋",
    title: "Check Today daily",
    description: "Your Today tab shows today's numbers, scheduled meds, and recent activity.",
  },
  {
    icon: "📈",
    title: "Visit Trends weekly",
    description: "Track your progress over time with charts and AI insights.",
  },
];

export default function OnboardingReadyScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      await api("/api/onboarding/complete", { method: "POST" });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: "center" }}>
      {/* Success checkmark */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.successBg,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 40 }}>✓</Text>
        </View>
        <Text style={{ fontSize: 28, fontFamily: "Poppins-Bold", color: colors.foreground, textAlign: "center" }}>
          You're all set!
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground, textAlign: "center", marginTop: 8 }}>
          Here are a few tips to get started.
        </Text>
      </View>

      {/* Tips */}
      <View style={{ gap: 12, marginBottom: 32 }}>
        {TIPS.map((tip) => (
          <View
            key={tip.title}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.secondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>{tip.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-SemiBold", color: colors.foreground }}>
                {tip.title}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Inter", color: colors.mutedForeground }}>
                {tip.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {error ? (
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.error, textAlign: "center", marginBottom: 16 }}>
          {error}
        </Text>
      ) : null}

      {/* Go to Dashboard button */}
      <Pressable
        onPress={handleStart}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            Go to Dashboard
          </Text>
        )}
      </Pressable>
    </View>
  );
}
