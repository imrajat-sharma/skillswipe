/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef6fc",
          100: "#d8e9f7",
          200: "#b5d6ed",
          300: "#87b8dc",
          400: "#5a9cc9",
          500: "#317faf",
          600: "#236892",
          700: "#1a5478",
          800: "#184866",
          900: "#163e56",
        },
        secondary: {
          50: "#edf9f8",
          100: "#d2efeb",
          200: "#a8ddd6",
          300: "#71c5bb",
          400: "#42a89d",
          500: "#2d8d84",
          600: "#24766f",
          700: "#225f5a",
          800: "#224d49",
          900: "#1f4140",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Sora", "system-ui", "sans-serif"],
      },
      borderRadius: {
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
      },
      boxShadow: {
        soft: "0 10px 24px rgba(12, 37, 66, 0.12)",
        card: "0 12px 28px rgba(15, 39, 63, 0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.28s ease-out",
        "card-in": "cardIn 0.32s ease-out",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cardIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
