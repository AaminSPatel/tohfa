"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Rating from "@/components/ui/Rating";

/** One large quote at a time, with the overall rating alongside. */
export default function ReviewsCarousel({ title, reviews, average, total }) {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const go = (n) => setI((n + reviews.length) % reviews.length);
  const btn = "grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper";
  return (
    <section className="section-y bg-sand/60 overflow-hidden" aria-labelledby="reviews-heading">
      <div className="container-page grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 w-full">
        <div className="w-full min-w-0 lg:col-span-4">
          <h2 id="reviews-heading" className="text-display-md">{title}</h2>
          <p className="mt-4 sm:mt-6 font-display text-4xl sm:text-6xl">{average.toFixed(1)}</p>
          <Rating value={average} showValue={false} size={18} className="mt-2" />
          <p className="mt-2 text-xs sm:text-sm text-muted">From {total.toLocaleString("en-IN")}+ reviews across our gifts</p>
        </div>
        <div className="w-full min-w-0 lg:col-span-8" role="region" aria-roledescription="carousel" aria-label="Customer reviews">
          <div className="min-h-[11rem] sm:min-h-[13rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <blockquote className="font-display text-[clamp(1.15rem,2.6vw,2rem)] leading-snug text-ink">{r.text}</blockquote>
                <figcaption className="mt-3 sm:mt-5 text-sm sm:text-base text-ink-soft"><span className="font-medium text-ink">{r.name}</span>, {r.city}{r.occasion ? `. ${r.occasion}` : ""}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-6 sm:mt-8 flex items-center gap-3">
            <button className={btn} onClick={() => go(i - 1)} aria-label="Previous review"><FiArrowLeft /></button>
            <button className={btn} onClick={() => go(i + 1)} aria-label="Next review"><FiArrowRight /></button>
            <span className="ml-2 text-xs sm:text-sm text-muted" aria-hidden="true">{i + 1} / {reviews.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
