import { View } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

interface TabIconProps {
  color: string;
  focused: boolean;
  size?: number;
}

export function TabBarIcon({ color, focused, size = 24 }: TabIconProps & { children: React.ReactNode }) {
  return <View style={{ opacity: focused ? 1 : 0.7 }}>{/* children */}</View>;
}

// Sun/calendar icon for Today
export function TodayIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
      <Path
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Chart/trend line icon for Trends
export function TrendsIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 20l4-4 4 2 5-6 5-4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6h4v4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Pill/capsule icon for Meds
export function MedsIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 1.5a4.5 4.5 0 0 0-4.5 4.5v12a4.5 4.5 0 0 0 9 0V6a4.5 4.5 0 0 0-4.5-4.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M6 12h9" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M18 8h2M18 12h2M18 16h2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Person/user icon for Profile
export function ProfileIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <Path
        d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
