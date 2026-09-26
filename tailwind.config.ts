import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Square corners site-wide. rounded-full is kept for avatars and dots.
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
      xl: "0",
      full: "9999px",
    },
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
      boxShadow: {
        redGlow: "0 10px 40px -10px rgba(193,18,31,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
