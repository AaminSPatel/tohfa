import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "group inline-flex items-center justify-center gap-2 rounded font-medium leading-none whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-rani text-white hover:bg-rani-dark",
  ink: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
  soft: "bg-blush text-ink hover:bg-blush-deep",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-paper text-ink hover:bg-white",
};
const sizes = { sm: "h-10 px-4 text-sm", md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-8 text-base" };

/** Renders a <Link>, an external <a>, or a <button> depending on props. */
export default function Button({ href, variant = "primary", size = "md", className, children, external, ...props }) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href && (external || /^(https?:|tel:|mailto:)/.test(href))) {
    return <a href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props}>{children}</a>;
  }
  if (href) return <Link href={href} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}
