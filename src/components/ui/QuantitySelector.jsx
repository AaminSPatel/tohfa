"use client";
import { FiMinus, FiPlus } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function QuantitySelector({ value, onChange, min = 1, max = 10, size = "md", label = "Quantity", className }) {
  const dim = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const btn = cn(dim, "grid place-items-center text-ink transition-colors hover:bg-ink/5 disabled:opacity-35");
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center rounded border border-ink/25", className)}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <FiMinus size={size === "sm" ? 14 : 16} />
      </button>
      <span className={cn("min-w-9 text-center font-medium tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <FiPlus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
