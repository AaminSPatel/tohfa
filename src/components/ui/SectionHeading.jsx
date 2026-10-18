import Link from "next/link";
import { cn } from "@/lib/utils";

/** Section title with optional intro and a text link on the right. */
export default function SectionHeading({ title, intro, link, id, as: Tag = "h2", className, light = false }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <Tag id={id} className={cn("text-display-lg", light && "text-paper")}>{title}</Tag>
        {intro && <p className={cn("mt-3 max-w-xl text-lead", light ? "text-paper/75" : "text-ink-soft")}>{intro}</p>}
      </div>
      {link && (
        <Link href={link.href} className={cn("shrink-0 border-b border-current pb-0.5 text-sm font-medium transition-colors hover:text-rani", light ? "text-paper" : "text-ink")}>
          {link.label}
        </Link>
      )}
    </div>
  );
}
