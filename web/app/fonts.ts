import { Libre_Caslon_Display, Libre_Caslon_Text, Public_Sans } from 'next/font/google';

/*
 * Design.pen type: Libre Caslon Display (headings), Libre Caslon Text (names, practice
 * titles, pull quotes) and Public Sans (everything else). next/font downloads them at build
 * time and serves them from this origin, so the CSP keeps `font-src 'self'`.
 */

const display = Libre_Caslon_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caslon-display',
});

const serif = Libre_Caslon_Text({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caslon-text',
  // Only the display face and the body face are above the fold on most pages.
  preload: false,
});

const sans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
});

/** Class names that define the three font variables; set on <html>. */
export const fontVariables = `${display.variable} ${serif.variable} ${sans.variable}`;
