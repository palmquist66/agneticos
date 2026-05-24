import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { getHealthSource } from "@/lib/health";
import { connectHealth } from "@/lib/health-sync";

// Sources that connect via OAuth inside the full app (not during onboarding).
const LATER_CONNECTIONS = [
  {
    name: "Dexcom CGM",
    icon: "📊",
    description: "Continuous glucose monitoring — auto-sync your glucose readings.",
  },
  {
    name: "Fitbit",
    icon: "⌚",
    description: "Weight and activity data from your Fitbit device.",
  },
];

const NATIVE_LABEL: Record<string, { name: string; icon: string; description: string }> = {
  apple_health: {
    name: "Apple Health",
    icon: "❤️",
    description: "Weight, glucose, steps, and active energy from Apple Health.",
  },
  health_connect: {
    name: "Health Connect",
    icon: "❤️",
    description: "Weight, glucose, steps, and active energy from Health Connect.",
  },
};

export default function OnboardingConnectScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const source = getHealthSource();
  const native = source ? NATIVE_LABEL[source] : null;

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectNative = async () => {
    setConnecting(true);
    setError(null);
    const result = await connectHealth();
    if (result.ok) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setConnected(true);
    } else {
      setError(result.reason ?? "Couldn't connect. You can try again from Profile.");
    }
    setConnecting(false);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/onboarding/ready");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 120 }}>
        <Text style={{ fontSize: 24, fontFamily: "Poppins-Bold", color: colors.foreground }}>
          Connect your devices
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
          The more data flows in, the better your insights. Connect now or add these later from your
          Profile.
        </Text>

        {/* Native health — actionable */}
        {native && (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: connected ? colors.primary : colors.border,
              padding: 20,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ fontSize: 24 }}>{native.icon}</Text>
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.foreground }}>
                {native.name}
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              {native.description}
            </Text>

            {error && (
              <Text style={{ fontSize: 13, fontFamily: "Inter", color: colors.destructive }}>
                {error}
              </Text>
            )}

            {connected ? (
              <View
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: "Inter-SemiBold", color: colors.primary }}>
                  Connected ✓
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={handleConnectNative}
                disabled={connecting}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: connecting ? 0.6 : 1,
                }}
              >
                {connecting ? (
                  <ActivityIndicator size="small" color={colors.primaryForeground} />
                ) : (
                  <Text
                    style={{ fontSize: 14, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}
                  >
                    Connect {native.name}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        )}

        {/* OAuth sources — connect later from Profile */}
        {LATER_CONNECTIONS.map((connection) => (
          <View
            key={connection.name}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 20,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ fontSize: 24 }}>{connection.icon}</Text>
              <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.foreground }}>
                {connection.name}
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontFamily: "Inter", color: colors.mutedForeground }}>
              {connection.description}
            </Text>
            <View
              style={{
                backgroundColor: colors.muted,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginTop: 4,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: "Inter", color: colors.mutedForeground }}>
                Connect later from Profile.
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom button */}
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
          onPress={handleContinue}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: colors.primaryForeground }}>
            {connected ? "Continue" : "Skip for now"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
