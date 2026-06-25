import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050B18",
        card: "#0B1225",
        border: "#16213D",
        primary: {
          DEFAULT: "#1E90FF",
          foreground: "#FFFFFF",
        },
        cyan: {
          DEFAULT: "#00E5FF",
        },
        success: {
          DEFAULT: "#00D084",
        },
        muted: {
          DEFAULT: "#0E1730",
          foreground: "#8B97B8",
        },
        destructive: {
          DEFAULT: "#FF4D4D",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #1E90FF 0%, #00E5FF 100%)",
        "gradient-radial": "radial-gradient(circle at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 229, 255, 0.15)",
        "glow-lg": "0 0 80px rgba(30, 144, 255, 0.2)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulse_glow: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse_glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
