import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e0d0b",
        surface: {
          DEFAULT: "#171614",
          raised: "#201f1c",
          hover: "#2a2926",
          border: "#3a3834",
        },
        cream: {
          DEFAULT: "#ede9e3",
          muted: "#8a847a",
          faint: "#5c5850",
        },
        brass: {
          DEFAULT: "#c9a227",
          light: "#e0bc4a",
          dim: "#8a7420",
        },
        coral: {
          DEFAULT: "#d4846a",
          muted: "#b86f58",
        },
        sage: {
          DEFAULT: "#6b8f71",
          muted: "#4a6b50",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(58,56,52,0.5)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,162,39,0.15)",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
