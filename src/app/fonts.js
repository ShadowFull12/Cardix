import {
  Bricolage_Grotesque,
  Geist,
  JetBrains_Mono,
} from "next/font/google";

/**
 * Landing type system.
 *  - Bricolage Grotesque : display only. Variable optical size, real character,
 *                          not one of the default grotesques.
 *  - Geist               : body and UI text.
 *  - JetBrains Mono      : numerals, labels, handles. The app already speaks in
 *                          a mono voice; this gives it an actual face instead of
 *                          the browser's ui-monospace fallback.
 *
 * No display serif. Emphasis inside a headline is carried by weight and colour
 * in the same family, never by swapping in a second family.
 */

export const lpDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-lp-display",
  display: "swap",
});

export const lpSans = Geist({
  subsets: ["latin"],
  variable: "--font-lp-sans",
  display: "swap",
});

export const lpMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-lp-mono",
  display: "swap",
});

export const lpFontVars = `${lpDisplay.variable} ${lpSans.variable} ${lpMono.variable}`;
