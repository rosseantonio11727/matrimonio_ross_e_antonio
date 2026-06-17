import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  style:    ["normal", "italic"],
  variable: "--font-cormorant",
  display:  "swap",
});

const geist = Geist({
  subsets:  ["latin"],
  variable: "--font-geist",
  display:  "swap",
});

const geistMono = Geist_Mono({
  subsets:  ["latin"],
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
    <html lang="it" className={`${cormorant.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
