import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

export default function OnboardingLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: colors.foreground },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="medication" options={{ title: "Your Medication" }} />
      <Stack.Screen name="goals" options={{ title: "Your Goals" }} />
      <Stack.Screen name="connect" options={{ title: "Connect Devices" }} />
      <Stack.Screen name="ready" options={{ title: "", headerShown: false }} />
    </Stack>
  );
}
