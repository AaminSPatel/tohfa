import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/** Built-in mark: a gift tag with a punched hole. Set siteConfig.logo.image to use your own file. */
export function TagMark({ className }) {
  return (
    <svg viewBox="0 0 24 28" className={cn("h-7 w-6", className)} aria-hidden="true">
      <path d="M7 1h10l5 4v21a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" fill="currentColor" />
      <circle cx="12" cy="7" r="2.2" fill="rgb(var(--c-paper))" />
    </svg>
  );
}

export default function Logo({ className, light = false }) {
  const { image, width, height } = siteConfig.logo;
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label={`${siteConfig.brandName} home`}>
      {image ? (
        <Image src={image} alt={siteConfig.brandName} width={width} height={height} priority className="h-8 w-auto" />
      ) : (
        <>
          <TagMark className={light ? "text-marigold" : "text-rani"} />
          <span className={cn("font-display text-[1.6rem] leading-none tracking-tight", light ? "text-paper" : "text-ink")}>{siteConfig.brandName}</span>
        </>
      )}
    </Link>
  );
}
