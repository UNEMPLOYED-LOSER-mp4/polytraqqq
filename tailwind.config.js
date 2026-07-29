/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan all JSX/JS files under our GUI source for utility class usage.
  // Tailwind v3 needs explicit content paths to know what to emit.
  content: [
    "./src/api/gui/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand palette used throughout the GUI. Reference via
        // utility classes like bg-pf-accent, text-pf-text, border-pf-panel-border.
        // RGB-triple-with-alpha-channel pattern so opacity modifiers work
        // (e.g. bg-pf-accent/30, hover:bg-pf-accent/50).
        "pf-accent": "rgb(255 58 58 / <alpha-value>)",
        "pf-panel": "rgb(15 15 17 / <alpha-value>)",
        "pf-panel-border": "rgb(255 58 58 / <alpha-value>)",
        "pf-text": "rgb(232 232 234 / <alpha-value>)",
        "pf-text-dim": "rgb(139 139 146 / <alpha-value>)",
      },
      fontFamily: {
        mono: ["ui-monospace", "JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      keyframes: {
        "pf-pulse": {
          "50%": { opacity: "0.6" },
        },
        "pf-pop-in": {
          "0%":   { opacity: "0", transform: "scale(0.96) translateY(-8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "pf-dot-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(1.4)" },
        },
      },
      animation: {
        "pf-pulse": "pf-pulse 1s ease-in-out infinite",
        "pf-pop-in": "pf-pop-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "pf-dot-pulse": "pf-dot-pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};