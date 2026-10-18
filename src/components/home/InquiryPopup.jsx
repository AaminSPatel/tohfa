"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import Portal from "@/components/ui/Portal";
import { InquiryForm } from "@/components/layout/ContactForms";
import { useOverlay } from "@/lib/hooks";
import { siteConfig } from "@/data/siteConfig";

/** Timings (milliseconds). Change them here. */
const OPEN_AFTER = 5000;   // pop-up appears 5 seconds after the visitor arrives
const CLOSE_AFTER = 2000;  // the cross button appears 2 seconds after the pop-up opens

const SEEN = "tohfa.popup.seen";       // sessionStorage: shown once per visit
const DONE = "tohfa.popup.submitted";  // localStorage: don't ask again for a week after an inquiry
const WEEK = 7 * 24 * 60 * 60 * 1000;

function Trap({ refEl, open, onClose }) {
  useOverlay(open, onClose, refEl);
  return null;
}

export default function InquiryPopup() {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) return;
      const done = Number(localStorage.getItem(DONE) || 0);
      if (done && Date.now() - done < WEEK) return;
    } catch { /* storage blocked: still show it once */ }
    const t = setTimeout(() => { setOpen(true); try { sessionStorage.setItem(SEEN, "1"); } catch { /* ignore */ } }, OPEN_AFTER);
    return () => clearTimeout(t);
  }, []);

  // The cross appears CLOSE_AFTER ms after the pop-up opens
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setCanClose(true), CLOSE_AFTER);
    return () => clearTimeout(t);
  }, [open]);

  const close = () => { if (canClose) setOpen(false); };
  const onSuccess = () => {
    try { localStorage.setItem(DONE, String(Date.now())); } catch { /* ignore */ }
    setCanClose(true);
    setTimeout(() => setOpen(false), 3500);
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div key="popup" className="fixed inset-0 z-[85] grid place-items-center p-4">
            {/* Escape only works once the cross is visible */}
            <Trap refEl={ref} open={open} onClose={close} />
            <motion.div className="absolute inset-0 bg-ink/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} aria-hidden="true" />
            <motion.div
              ref={ref} role="dialog" aria-modal="true" aria-labelledby="popup-title" tabIndex={-1}
              className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-lg bg-paper p-6 shadow-lift outline-none sm:p-7"
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence>
                {canClose && (
                  <motion.button
                    key="x" type="button" onClick={() => setOpen(false)} aria-label="Close this form"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
                    className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-ink/10"
                  >
                    <FiX size={22} />
                  </motion.button>
                )}
              </AnimatePresence>
              <h2 id="popup-title" className="pr-10 text-display-sm">Looking for the right gift?</h2>
              <p className="mt-1 text-sm text-ink-soft">Tell us who it's for. {siteConfig.brandName} will reply on WhatsApp with ideas. Gift dhundhne me madad chahiye?</p>
              <div className="mt-5"><InquiryForm compact source="popup" onSuccess={onSuccess} /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
