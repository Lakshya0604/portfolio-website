/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        mute: "rgb(var(--mute) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        teal: "rgb(var(--teal) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)",
        pink: "rgb(var(--pink) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        body: ["Newsreader", "Georgia", "Times New Roman", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
