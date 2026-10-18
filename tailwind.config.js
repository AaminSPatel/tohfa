/** Design tokens live in src/app/globals.css (:root). Tailwind just maps to them. */
const rgb = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: rgb("paper"),
        ink: { DEFAULT: rgb("ink"), soft: rgb("ink-soft") },
        muted: rgb("muted"),
        rani: { DEFAULT: rgb("rani"), dark: rgb("rani-dark") },
        marigold: { DEFAULT: rgb("marigold"), soft: rgb("marigold-soft") },
        blush: { DEFAULT: rgb("blush"), deep: rgb("blush-deep") },
        sand: rgb("sand"),
        line: rgb("line"),
        leaf: rgb("leaf"),
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(2.7rem, 6.8vw, 5.6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.15rem, 4.6vw, 3.7rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.65rem, 2.9vw, 2.4rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-sm": ["1.3rem", { lineHeight: "1.2" }],
        lead: ["1.125rem", { lineHeight: "1.7" }],
      },
      borderRadius: { sm: "3px", DEFAULT: "6px", md: "8px", lg: "14px" },
      boxShadow: {
        soft: "0 1px 2px rgb(36 19 30 / .06), 0 10px 24px -14px rgb(36 19 30 / .22)",
        lift: "0 22px 40px -22px rgb(36 19 30 / .38)",
      },
      maxWidth: { page: "1280px" },
      transitionTimingFunction: { out: "cubic-bezier(.22,1,.36,1)" },
    },
  },
  plugins: [],
};
