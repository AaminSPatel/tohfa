"use client";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";
import { useOverlay } from "@/lib/hooks";

function Trap({ refEl, open, onClose }) {
  useOverlay(open, onClose, refEl);
  return null;
}

/** Centered dialog (confirmations in admin, etc.) */
export default function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null);
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div key="modal" className="fixed inset-0 z-[90] grid place-items-center p-4">
            <Trap refEl={ref} open={open} onClose={onClose} />
            <motion.div className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
            <motion.div
              ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
              className="relative w-full max-w-md rounded-lg bg-paper p-6 shadow-lift outline-none"
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-display-sm">{title}</h2>
              <div className="mt-3 text-ink-soft">{children}</div>
              {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
