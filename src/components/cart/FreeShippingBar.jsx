"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/siteConfig";
import { formatPrice } from "@/lib/utils";

/** Nudges people toward the free-delivery threshold. */
export default function FreeShippingBar({ subtotal }) {
  const t = siteConfig.shipping.freeThreshold;
  const left = Math.max(0, t - subtotal);
  const pct = Math.min(100, (subtotal / t) * 100);
  return (
    <div>
      <p className="text-sm text-ink-soft">
        {left > 0 ? <>Add <strong className="font-medium text-ink">{formatPrice(left)}</strong> more for free delivery.</> : <strong className="font-medium text-leaf">You've got free delivery.</strong>}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free delivery">
        <motion.div className="h-full rounded-full bg-rani" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}
