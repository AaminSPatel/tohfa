import Link from "next/link";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

/** Underlined text tabs (not pills). Horizontally scrollable on mobile. */
export default function CategoryTabs({ active }) {
  const items = [{ slug: null, name: "All gifts", href: "/shop" }, ...categories.map((c) => ({ slug: c.slug, name: c.name, href: `/shop/${c.slug}` }))];
  return (
    <nav aria-label="Categories" className="border-b border-line">
      <ul className="no-scrollbar -mx-5 flex gap-7 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {items.map((i) => {
          const on = (active || null) === i.slug;
          return (
            <li key={i.href} className="shrink-0">
              <Link href={i.href} aria-current={on ? "page" : undefined}
                className={cn("block border-b-2 py-3.5 text-[0.95rem] transition-colors", on ? "border-rani text-ink" : "border-transparent text-muted hover:text-ink")}>
                {i.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
