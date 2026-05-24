import { useEffect, useRef, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import { tokenCache } from "@/lib/auth";
import { api, setAuthTokenGetter } from "@/lib/api";
import {
  setupNotificationCategories,
  handleNotificationResponse,
  registerForPushNotifications,
} from "@/lib/notifications";
import { useHealthAutoSync } from "@/lib/health-sync";

SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Set it in your .env file."
  );
}

function AuthGate() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Wire up API client with Clerk token getter
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  // Check onboarding status after sign-in
  const checkOnboarding = useCallback(async () => {
    try {
      const user = await api<{ onboarded: boolean }>("/api/user");
      if (user.onboarded === false) {
        router.replace("/onboarding/medication");
      } else {
        router.replace("/(tabs)/today");
      }
    } catch {
      // If the check fails, go to tabs anyway
      router.replace("/(tabs)/today");
    } finally {
      setOnboardingChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "sign-in";
    const inOnboarding = segments[0] === "onboarding";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      // Just signed in — check if onboarding is needed
      checkOnboarding();
    }
  }, [isLoaded, isSignedIn, segments]);

  // ─── Notification setup ────────────────────────────────
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const tokenListener = useRef<Notifications.EventSubscription | null>(null);

  // Register iOS notification categories on mount
  useEffect(() => {
    setupNotificationCategories();
  }, []);

  // Listen for notification taps (warm start)
  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  // Handle cold-start notification tap
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });
  }, []);

  // Re-register token if it refreshes
  useEffect(() => {
    if (!isSignedIn) return;

    tokenListener.current = Notifications.addPushTokenListener(() => {
      registerForPushNotifications();
    });

    return () => {
      tokenListener.current?.remove();
    };
  }, [isSignedIn]);

  // Foreground health sync (no-op until the user connects a health source).
  useHealthAutoSync();

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AuthGate />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
