import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, DM_Mono } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  style:    ["normal", "italic"],
  variable: "--font-cormorant",
  display:  "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-geist",
  display:  "swap",
});

const dmMono = DM_Mono({
  subsets:  ["latin"],
  weight:   ["300", "400", "500"],
  variable: "--font-mono",
  display:  "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "Rossella & Antonio — 11 Luglio 2027",
  description: "Matrimonio a Masseria Palesi, Martina Franca, Puglia.",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
