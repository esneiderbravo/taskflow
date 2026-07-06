import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "rgb(var(--color-page) / <alpha-value>)",
        foreground: {
          DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
          muted: "rgb(var(--color-foreground-muted) / <alpha-value>)",
          faint: "rgb(var(--color-foreground-faint) / <alpha-value>)",
        },
        icon: "rgb(var(--color-icon) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
          hover: "rgb(var(--color-surface-hover) / <alpha-value>)",
          border: "rgb(var(--color-surface-border) / <alpha-value>)",
          input: "rgb(var(--color-surface-input) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          light: "rgb(var(--color-accent-light) / <alpha-value>)",
          dim: "rgb(var(--color-accent-dim) / <alpha-value>)",
        },
        "workshop-gold": "#d97706",
        "workshop-gold-light": "#f59e0b",
        "workshop-emerald": "#059669",
        "workshop-ruby": "#be123c",
        status: {
          ready: "rgb(var(--color-status-ready) / <alpha-value>)",
          active: "rgb(var(--color-status-active) / <alpha-value>)",
          done: "rgb(var(--color-status-done) / <alpha-value>)",
          danger: "rgb(var(--color-status-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        header: "var(--shadow-header)",
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
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
