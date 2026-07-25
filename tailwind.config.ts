import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#F6F4EE",
        surface: "#FFFFFF",
        ink: "#21281F",
        muted: "#6E6A5E",
        pine: {
          DEFAULT: "#2C4A3B",
          light: "#3E6350",
          dark: "#1B2F25",
        },
        trail: {
          DEFAULT: "#E2572B",
          light: "#F0946B",
          dark: "#B8431E",
        },
        line: "#E4E0D4",
        blaze: {
          high: "#3E6350",
          mid: "#C6862F",
          low: "#9C978A",
        },
        tier: {
          low: "#7FA65C",
          mid: "#3E7DB8",
          high: "#5B4E8C",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
export default config;
