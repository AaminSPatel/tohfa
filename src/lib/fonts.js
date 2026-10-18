import { Young_Serif, Hanken_Grotesk, Caveat } from "next/font/google";

// Display: warm, slightly chunky serif. Body: friendly grotesk. Hand: used only on the gift tag.
export const fontDisplay = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
export const fontBody = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
export const fontHand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
