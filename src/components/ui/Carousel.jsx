"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

/**
 * Native scroll-snap carousel: touch-friendly, keyboard accessible (focusable region + arrow buttons),
 * no extra library. Children should have a fixed width (e.g. w-[72%] sm:w-[40%] lg:w-[25%]).
 */
export default function Carousel({ label, children, className, controlsClassName }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByPage = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollByPage(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollByPage(-1); }
  };

  const btn = "grid h-11 w-11 place-items-center rounded-full border border-ink/30 text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className={className}>
      <div
        ref={ref} onScroll={update} onKeyDown={onKeyDown}
        role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:gap-6 lg:px-12"
      >
        {children}
      </div>
      <div className={cn("mt-6 flex justify-end gap-2", controlsClassName)}>
        <button type="button" className={btn} onClick={() => scrollByPage(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><FiArrowLeft /></button>
        <button type="button" className={btn} onClick={() => scrollByPage(1)} disabled={edge.end} aria-label={`Next ${label}`}><FiArrowRight /></button>
      </div>
    </div>
  );
}

export const CarouselItem = ({ children, className }) => (
  <div className={cn("shrink-0 snap-start", className)}>{children}</div>
);
