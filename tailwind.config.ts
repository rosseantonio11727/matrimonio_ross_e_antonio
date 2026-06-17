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
        // ─── Wedding palette (Pantone-sourced) ───────────────────────────
        wedding: {
          cream:    "#F4EEDB",   // sfondo principale — burroso, materico
          sky:      "#A3B8CC",   // azzurro polvere — accenti, icone, bordi
          burgundy: "#4A0E17",   // borgogna profondo — titoli impatto, CTA
          slate:    "#2C3E50",   // grigio-azzurro — corpo testo
        },
        // ─── Legacy aliases (componenti esistenti) ────────────────────────
        ivory:    "#FAF8F2",
        charcoal: "#2A2A2A",
        azure:    "#A3B8CC",    // aggiornato → wedding-sky
        bordeaux: "#4A0E17",    // aggiornato → wedding-burgundy
        olive:    "#6B7240",
        butter:   "#F4EEDB",    // aggiornato → wedding-cream
        cream:    "#F4EEDB",
        greige:   "#E2D9C4",
        mist:     "#7A7570",
        camel:    "#4A0E17",
        sage:     "#6B7240",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-geist)",     "system-ui", "sans-serif"],
        mono:  ["var(--font-mono)",      "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem,8vw,6rem)",  { lineHeight: "1.05", letterSpacing: "-0.02em" }],
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
