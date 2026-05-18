import { View, Text, Pressable, useColorScheme, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";

const CONNECTIONS = [
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
  {
    name: "Apple Health",
    icon: "❤️",
    description: "Weight, steps, and health data from Apple Health.",
  },
];

export default function OnboardingConnectScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

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
          Sync data from your health devices. You can connect these later from your Profile.
        </Text>

        {CONNECTIONS.map((connection) => (
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
                Connect later from Profile — device setup works best in the full app.
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
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
