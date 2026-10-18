"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default function ProductGallery({ images = [], name }) {
  const list = images.length ? images : [FALLBACK_PRODUCT_IMAGE];
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  const go = (n) => setIndex((n + list.length) % list.length);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded bg-sand"
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)} onPointerLeave={() => setZoom(false)} onPointerMove={(e) => e.pointerType === "mouse" && onMove(e)}
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); }}
        tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${name} photos`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Image src={list[index]} alt={`${name}, photo ${index + 1} of ${list.length}`} fill priority sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={{ transformOrigin: origin, transform: zoom ? "scale(1.6)" : "scale(1)" }} />
          </motion.div>
        </AnimatePresence>
        {list.length > 1 && (
          <>
            <button onClick={() => go(index - 1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 shadow-soft hover:bg-paper"><FiChevronLeft size={20} /></button>
            <button onClick={() => go(index + 1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 shadow-soft hover:bg-paper"><FiChevronRight size={20} /></button>
          </>
        )}
      </div>
      {list.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {list.map((src, i) => (
            <li key={src}>
              <button onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index} className={cn("relative block h-20 w-16 overflow-hidden rounded bg-sand ring-offset-2 transition", i === index ? "ring-2 ring-rani" : "opacity-70 hover:opacity-100")}>
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
