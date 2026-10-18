"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const GIFT_NOTE_KEY = "tohfa.giftNote";

/**
 * The brand's signature moment: a hanging gift tag you can actually write on.
 * Whatever is written is saved on the device and pre-fills the gift note at checkout.
 */
export default function GiftTag({ toPlaceholder, messagePlaceholder, caption }) {
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GIFT_NOTE_KEY) || "null");
      if (saved) { setTo(saved.to || ""); setMsg(saved.msg || ""); }
    } catch { /* ignore */ }
  }, []);

  const save = (next) => {
    try { localStorage.setItem(GIFT_NOTE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  return (
    <motion.div
      className="relative w-[212px] origin-top sm:w-[236px]"
      style={{ transformOrigin: "50% 0" }}
      animate={typing ? { rotate: 0 } : { rotate: [-1.6, 1.6, -1.6] }}
      transition={typing ? { duration: 0.4 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* twine */}
      <svg className="absolute -top-28 left-1/2 h-32 w-8 -translate-x-1/2" viewBox="0 0 32 128" fill="none" aria-hidden="true">
        <path d="M16 0 C16 40 10 70 16 104" stroke="#C99A6B" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="16" cy="112" rx="8" ry="11" stroke="#C99A6B" strokeWidth="3" />
      </svg>
      <div className="drop-shadow-[0_18px_22px_rgba(36,19,30,0.22)]">
        <div className="gift-tag bg-paper px-5 pb-6 pt-14">
          <label htmlFor="tag-to" className="sr-only">Who is the gift for?</label>
          <div className="flex items-baseline gap-2 font-hand text-[1.7rem] leading-none text-ink">
            <span aria-hidden="true">To</span>
            <input
              id="tag-to" value={to} maxLength={18} placeholder={toPlaceholder}
              onFocus={() => setTyping(true)} onBlur={() => setTyping(false)}
              onChange={(e) => { setTo(e.target.value); save({ to: e.target.value, msg }); }}
              className="w-full min-w-0 border-b border-dashed border-ink/35 bg-transparent pb-0.5 text-rani placeholder:text-ink/45 focus:border-rani focus:outline-none"
            />
          </div>
          <label htmlFor="tag-msg" className="sr-only">Your message for the card</label>
          <textarea
            id="tag-msg" rows={4} value={msg} maxLength={80} placeholder={messagePlaceholder}
            onFocus={() => setTyping(true)} onBlur={() => setTyping(false)}
            onChange={(e) => { setMsg(e.target.value); save({ to, msg: e.target.value }); }}
            className="mt-4 w-full resize-none border-0 bg-transparent font-hand text-[1.35rem] leading-[1.25] text-ink placeholder:text-ink/45 focus:outline-none"
          />
        </div>
      </div>
      <p className="mt-3 text-[0.8rem] leading-snug text-ink-soft">{caption}</p>
    </motion.div>
  );
}
