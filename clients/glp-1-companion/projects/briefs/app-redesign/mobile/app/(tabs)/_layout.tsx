import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import {
  TabBarIcon,
  TodayIcon,
  TrendsIcon,
  MedsIcon,
  ProfileIcon,
} from "@/components/nav/tab-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 4,
          height: 88,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-Medium",
          fontSize: 11,
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 18,
          color: colors.foreground,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color, focused }) => (
            <TodayIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: ({ color, focused }) => (
            <TrendsIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="meds"
        options={{
          title: "Meds",
          tabBarIcon: ({ color, focused }) => (
            <MedsIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
