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
        vinho: {
          DEFAULT: "#5B0F1E",
          dark: "#3E0A15",
          light: "#7A1B2E",
        },
        dourado: {
          DEFAULT: "#C8A24B",
          dark: "#A9843A",
          light: "#DDBE78",
        },
        creme: {
          DEFAULT: "#F7F3EE",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-instrument)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
