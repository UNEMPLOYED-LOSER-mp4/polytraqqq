module.exports = {
  content: [
    "./assets/src/js/**/*.{js,jsx}"
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      fontFamily: {
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"]
      },
      fontSize: {
        "3xs": "var(--text-3xs)",
        "2xs": "var(--text-2xs)",
        "xs": ["var(--text-xs)", { lineHeight: "1rem" }],
        "sm": ["var(--text-sm)", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["var(--text-lg)", { lineHeight: "1.75rem" }],
        "xl": ["var(--text-xl)", { lineHeight: "1.75rem" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "2rem" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "1.15" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "1.1" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "1.03" }],
        "6xl": ["var(--text-6xl)", { lineHeight: "1.03" }],
        "7xl": ["var(--text-7xl)", { lineHeight: "1.0" }]
      }
    }
  },
  plugins: []
};