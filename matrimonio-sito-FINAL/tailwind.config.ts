import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:    "#FAF8F2",
        charcoal: "#2A2A2A",
        // New palette
        azure:    "#5B7BA8",   // Azzurro polvere Cerulean
        bordeaux: "#6B1F1F",   // Bordeaux Sceptre Red
        olive:    "#6B7240",   // Verde oliva
        butter:   "#F4ECC2",   // Giallo burro
        cream:    "#F0EBD8",   // Crema calda
        greige:   "#E2DAC8",   // Bordi/separatori
        mist:     "#7A7570",   // Testo secondario
        // Legacy aliases for compatibility
        camel:    "#6B1F1F",   // bordeaux replaces camel for CTAs
        sage:     "#6B7240",   // olive replaces sage
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["DM Sans", "system-ui", "sans-serif"],
        mono:  ["DM Mono", "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem,8vw,6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        heading: ["clamp(1.8rem,4vw,3rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      spacing: {
        section:      "7rem",
        "section-sm": "4rem",
      },
    },
  },
  plugins: [],
};
export default config;
