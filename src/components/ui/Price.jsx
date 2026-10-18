import { formatPrice, discountPercent, cn } from "@/lib/utils";

export default function Price({ price, compareAtPrice, size = "md", className }) {
  const off = discountPercent(price, compareAtPrice);
  const big = size === "lg";
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2.5", className)}>
      <span className={cn("font-medium text-ink", big ? "text-3xl" : "text-base")}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <s className={cn("text-muted", big ? "text-lg" : "text-sm")}><span className="sr-only">Was </span>{formatPrice(compareAtPrice)}</s>
          <span className={cn("font-medium text-leaf", big ? "text-base" : "text-sm")}>{off}% off</span>
        </>
      )}
    </div>
  );
}
