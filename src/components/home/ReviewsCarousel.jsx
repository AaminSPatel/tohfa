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
  const btn = "grid h-11 w-11 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper";
  return (
    <section className="section-y bg-sand/60" aria-labelledby="reviews-heading">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="reviews-heading" className="text-display-md">{title}</h2>
          <p className="mt-6 font-display text-6xl">{average.toFixed(1)}</p>
          <Rating value={average} showValue={false} size={20} className="mt-2" />
          <p className="mt-2 text-sm text-muted">From {total.toLocaleString("en-IN")}+ reviews across our gifts</p>
        </div>
        <div className="lg:col-span-8" role="region" aria-roledescription="carousel" aria-label="Customer reviews">
          <div className="min-h-[15rem] sm:min-h-[13rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <blockquote className="font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-snug text-ink">{r.text}</blockquote>
                <figcaption className="mt-5 text-ink-soft"><span className="font-medium text-ink">{r.name}</span>, {r.city}{r.occasion ? `. ${r.occasion}` : ""}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <button className={btn} onClick={() => go(i - 1)} aria-label="Previous review"><FiArrowLeft /></button>
            <button className={btn} onClick={() => go(i + 1)} aria-label="Next review"><FiArrowRight /></button>
            <span className="ml-2 text-sm text-muted" aria-hidden="true">{i + 1} / {reviews.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
