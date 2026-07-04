import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#f4f7fb",
        foreground: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          faint: "#94a3b8",
        },
        surface: {
          DEFAULT: "#f4f7fb",
          raised: "#ffffff",
          hover: "#f8fafc",
          border: "#e2e8f0",
          input: "#ffffff",
        },
        accent: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dim: "#1d4ed8",
        },
        status: {
          ready: "#64748b",
          active: "#d97706",
          done: "#059669",
          danger: "#e11d48",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.9)",
        "card-hover":
          "0 8px 24px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(37, 99, 235, 0.12)",
        header: "0 1px 0 rgba(226, 232, 240, 0.9)",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "fade-up": "fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.75" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
