"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import { heroImages } from "@/data/images";

/** The emotional beat: dark, quiet, one idea. Image drifts slowly with scroll. */
export default function StorySection({ content }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : ["-6%", "6%"]);
  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-ink text-paper" aria-labelledby="story-heading">
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
          <Image src={heroImages.story} alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
      <div className="container-page relative py-16 sm:py-28 lg:py-40">
        <blockquote id="story-heading" className="max-w-4xl font-display text-[clamp(1.5rem,5vw,4.4rem)] leading-[1.12] tracking-tight">{content.quote}</blockquote>
        <p className="mt-5 sm:mt-8 max-w-xl text-base sm:text-lead text-paper/80">{content.text}</p>
        <Button href={content.cta.href} variant="light" size="lg" className="mt-6 sm:mt-9 w-full sm:w-auto">{content.cta.label}</Button>
      </div>
    </section>
  );
}
