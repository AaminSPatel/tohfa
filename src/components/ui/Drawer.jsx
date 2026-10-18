"use client";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import Portal from "./Portal";
import { useOverlay } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];
const sides = {
  right: { panel: "right-0 top-0 h-full w-full max-w-md", from: { x: "100%" }, to: { x: 0 } },
  left: { panel: "left-0 top-0 h-full w-full max-w-sm", from: { x: "-100%" }, to: { x: 0 } },
  bottom: { panel: "bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-lg", from: { y: "100%" }, to: { y: 0 } },
};

/** Slide-in panel used for the cart, mobile menu and mobile filters. */
export default function Drawer({ open, onClose, title, side = "right", children, footer, className }) {
  const ref = useRef(null);
  const s = sides[side];
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div key="drawer" className="fixed inset-0 z-[80]">
            <OverlayBody refEl={ref} open={open} onClose={onClose} />
            <motion.div
              className="absolute inset-0 bg-ink/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} aria-hidden="true"
            />
            <motion.aside
              ref={ref}
              role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
              className={cn("absolute flex flex-col bg-paper shadow-lift outline-none", s.panel, className)}
              initial={s.from} animate={s.to} exit={s.from}
              transition={{ duration: 0.38, ease }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-display-sm">{title}</h2>
                <button onClick={onClose} aria-label={`Close ${title}`} className="grid h-10 w-10 place-items-center rounded hover:bg-ink/5">
                  <FiX size={22} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
              {footer && <div className="border-t border-line bg-paper px-5 py-4">{footer}</div>}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

// Hook needs to live inside the mounted overlay so focus moves into the panel.
function OverlayBody({ refEl, open, onClose }) {
  useOverlay(open, onClose, refEl);
  return null;
}
