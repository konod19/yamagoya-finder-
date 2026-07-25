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
        ochre: {
          DEFAULT: "#A8763A",
          light: "#C79A5F",
        },
        line: "#DDD8CC",
        blaze: {
          high: "#3E6350",
          mid: "#B8863F",
          low: "#8B877A",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
