"use client";
import { motion } from "framer-motion";

// Opacity-only page transition: never breaks sticky/fixed children, respects reduced motion.
export default function Template({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
