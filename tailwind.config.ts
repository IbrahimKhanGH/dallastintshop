import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C1121F",
          redDark: "#8B0E17",
          redGlow: "#FF1F2D",
          black: "#050505",
          surface: "#111111",
          off: "#F3F3F3",
          muted: "#A3A3A3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "red-grad": "linear-gradient(135deg, #C1121F 0%, #8B0E17 100%)",
        "red-glow": "radial-gradient(60% 60% at 50% 50%, rgba(193,18,31,0.55) 0%, rgba(193,18,31,0) 70%)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        redGlow: "0 10px 40px -10px rgba(193,18,31,0.6)",
        redGlowLg: "0 20px 80px -20px rgba(193,18,31,0.8)",
      },
      animation: {
        "led-pulse": "ledPulse 3.5s ease-in-out infinite",
        "scan": "scan 6s linear infinite",
      },
      keyframes: {
        ledPulse: {
          "0%, 100%": { opacity: "0.6", filter: "blur(2px)" },
          "50%": { opacity: "1", filter: "blur(0px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
