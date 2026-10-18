"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

/** Big typographic list. On desktop, hovering/focusing a row previews a gift from that occasion. */
export default function OccasionList({ content, items }) {
  const [active, setActive] = useState(0);
  const current = items[active];
  return (
    <section id="occasions" className="section-y scroll-mt-20 bg-blush/60 overflow-hidden" aria-labelledby="occasions-heading">
      <div className="container-page">
        <SectionHeading id="occasions-heading" title={content.title} intro={content.intro} />
        <div className="mt-8 sm:mt-12 grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-12 w-full">
          <ul className="w-full min-w-0 lg:col-span-7">
            {items.map((o, i) => (
              <li key={o.slug} className="border-b border-ink/15 first:border-t">
                <Link href={`/shop?occasion=${o.slug}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                  className="group flex items-center justify-between gap-3 sm:gap-4 py-4 sm:py-6">
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[clamp(1.35rem,4vw,3rem)] leading-snug transition-colors duration-300 ${active === i ? "text-rani" : "text-ink"}`}>{o.label}</span>
                    <span className="mt-1 sm:mt-2 block max-w-md text-xs sm:text-sm text-ink-soft">{o.blurb}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted">
                    {o.count} {o.count === 1 ? "gift" : "gifts"}
                    <FiArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rani" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded bg-sand lg:col-span-5 lg:block" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              {current?.image && (
                <motion.div key={current.slug} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <Image src={current.image} alt="" fill sizes="40vw" className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
