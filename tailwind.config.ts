import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Soft Sunrise"
        cream: {
          50: "#FFFBF5",
          100: "#FFF6EA",
        },
        coral: {
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        indigo: {
          soft: "#818CF8",
          warm: "#6366F1",
        },
        ink: {
          900: "#1E293B",
          700: "#334155",
          500: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "soft-bounce": "soft-bounce 2s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "soft-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(99, 102, 241, 0.15)",
        "soft-lg": "0 12px 40px -12px rgba(99, 102, 241, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
