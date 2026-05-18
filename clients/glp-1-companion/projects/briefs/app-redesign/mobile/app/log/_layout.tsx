import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

export default function LogLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: "Poppins-SemiBold", fontSize: 18, color: colors.foreground },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        presentation: "modal",
      }}
    >
      <Stack.Screen name="weight" options={{ title: "Log Weight" }} />
      <Stack.Screen name="glucose" options={{ title: "Log Glucose" }} />
      <Stack.Screen name="glp1-dose" options={{ title: "Log GLP-1 Dose" }} />
      <Stack.Screen name="meal-photo" options={{ title: "Log Meal (Photo)" }} />
      <Stack.Screen name="meal-text" options={{ title: "Log Meal" }} />
      <Stack.Screen name="side-effect" options={{ title: "Log Side Effect" }} />
      <Stack.Screen name="recipe" options={{ title: "Log Recipe" }} />
    </Stack>
  );
}
