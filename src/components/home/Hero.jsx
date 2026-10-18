"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiEdit3, FiPackage, FiTruck } from "react-icons/fi";
import Button from "@/components/ui/Button";
import GiftTag from "./GiftTag";
import { heroImages } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];
const icons = { edit: FiEdit3, package: FiPackage, truck: FiTruck };

function Words({ text, start = 0.15 }) {
  const words = text.split(" ");
  return (
    <h1 className="text-display-xl" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span className="inline-block" initial={{ y: "108%" }} animate={{ y: 0 }} transition={{ duration: 0.85, ease, delay: start + i * 0.07 }}>
            {w}{i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Hero({ content }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const r = (a, b) => (reduce ? [0, 0] : [a, b]);
  const yFrame = useTransform(scrollYProgress, [0, 1], r(0, -50));
  const yBox = useTransform(scrollYProgress, [0, 1], r(0, 60));
  const yCandle = useTransform(scrollYProgress, [0, 1], r(0, -40));

  return (
    <section ref={ref} className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-6 xl:col-span-6">
          <div id="hero-heading"><Words text={content.headline} /></div>
          <motion.p className="mt-6 max-w-[34rem] text-lead text-ink-soft" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.65 }}>
            {content.sub}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.8 }}>
            <Button href={content.primaryCta.href} size="lg">{content.primaryCta.label}</Button>
            <Button href={content.secondaryCta.href} variant="outline" size="lg">{content.secondaryCta.label}</Button>
          </motion.div>
          <motion.ul className="mt-10 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-3 sm:gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            {content.trust.map((t) => {
              const Icon = icons[t.icon] || FiPackage;
              return (
                <li key={t.title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 shrink-0 text-rani" size={18} aria-hidden="true" />
                  <span><span className="block font-medium text-ink">{t.title}</span><span className="text-muted">{t.text}</span></span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto mt-8 w-full max-w-[560px] lg:col-span-6 lg:mt-0 lg:max-w-none lg:pl-8">
          <motion.div className="relative mx-auto aspect-[1/1.02] w-full max-w-[560px] sm:aspect-[1/0.95] lg:ml-auto" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.2 }}>
            <div className="absolute inset-x-[6%] bottom-0 top-[12%] bg-blush" />
            <div className="absolute inset-x-[6%] bottom-0 top-[12%] translate-x-3 translate-y-3 border border-rani/60" aria-hidden="true" />
            <motion.div style={{ y: yFrame }} className="absolute right-[1%] top-[4%] w-[60%]">
              <Image src={heroImages.frame} alt="A personalised wooden photo frame with a couple's picture" width={800} height={1000} priority sizes="(min-width:1024px) 360px, 60vw" />
            </motion.div>
            <motion.div style={{ y: yCandle }} className="absolute bottom-[3%] left-[43%] hidden w-[20%] sm:block">
              <Image src={heroImages.candle} alt="A hand-poured scented candle" width={800} height={1000} sizes="140px" />
            </motion.div>
            <motion.div style={{ y: yBox }} className="absolute -bottom-[2%] right-[0%] w-[46%]">
              <Image src={heroImages.box} alt="A gift box with a marigold ribbon" width={800} height={1000} priority sizes="(min-width:1024px) 260px, 40vw" />
            </motion.div>
            <div className="absolute left-[1%] top-[24%] z-10 origin-top-left max-sm:scale-[0.86] sm:left-0">
              <GiftTag toPlaceholder={content.tag.toPlaceholder} messagePlaceholder={content.tag.messagePlaceholder} caption={content.tag.caption} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
