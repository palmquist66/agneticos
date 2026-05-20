import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        primary: {
          DEFAULT: "#0F5F5A",
          foreground: "#FFFFFF",
          light: "#4DB6AC",
        },
        secondary: {
          DEFAULT: "#EAF5F3",
          foreground: "#0F5F5A",
        },
        muted: {
          DEFAULT: "#F2EEE5",
          foreground: "#6F6A5C",
        },
        accent: {
          DEFAULT: "#FF8A6A",
          foreground: "#FFFFFF",
        },
        destructive: "#C0392B",
        success: "#2E8B6F",
        warning: "#D9892C",
        error: "#C0392B",
        info: "#2C7BB2",
      },
      fontFamily: {
        sans: ["Inter"],
        "sans-medium": ["Inter-Medium"],
        "sans-semibold": ["Inter-SemiBold"],
        "sans-bold": ["Inter-Bold"],
        heading: ["Poppins"],
        "heading-medium": ["Poppins-Medium"],
        "heading-semibold": ["Poppins-SemiBold"],
        "heading-bold": ["Poppins-Bold"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
} satisfies Config;
