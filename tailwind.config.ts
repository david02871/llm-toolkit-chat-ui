import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "background-primary": "var(--background-primary)",
        "background-sidebar": "var(--background-sidebar)",
        "background-sidebar-surface": "var(--background-sidebar-surface)",
        "background-surface": "var(--background-surface)",
        "background-surface-secondary": "var(--background-surface-secondary)",
        "border-medium": "var(--border-medium)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
