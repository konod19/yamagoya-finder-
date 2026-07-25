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
        ink: "#16181A",
        muted: "#69675F",
        charcoal: {
          DEFAULT: "#16181A",
          light: "#24272A",
        },
        pine: {
          DEFAULT: "#2B3A2E",
          light: "#3E5340",
          dark: "#1B2519",
        },
        trail: {
          DEFAULT: "#E8391C",
          light: "#F26A4B",
          dark: "#B82C13",
        },
        line: "#E4E0D4",
        blaze: {
          high: "#3E6350",
          mid: "#C6862F",
          low: "#9C978A",
        },
        tier: {
          low: "#5F8A55",
          mid: "#3A6FA0",
          high: "#5A4C82",
        },
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
