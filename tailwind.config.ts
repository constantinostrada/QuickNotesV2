import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/interfaces/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#fef9ee",
          100: "#fdf0d5",
          200: "#faddaa",
          300: "#f7c26e",
          400: "#f39e31",
          500: "#f0820f",
          600: "#e16509",
          700: "#ba4b09",
          800: "#943b10",
          900: "#783210",
          950: "#411705",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
