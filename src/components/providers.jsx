"use client";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/components/cart/CartProvider";

/** reducedMotion="user" makes every Framer Motion transform animation respect prefers-reduced-motion. */
export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>{children}</CartProvider>
    </MotionConfig>
  );
}
