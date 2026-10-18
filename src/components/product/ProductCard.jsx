import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/Price";
import Rating from "@/components/ui/Rating";
import QuickAdd from "./QuickAdd";
import { stockState } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

const SIZES = "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw";

/** Server component. The second photo fades in on hover; the quick-add button is the only client island. */
export default function ProductCard({ product, priority = false, sizes = SIZES }) {
  const state = stockState(product.stock);
  const [first, second] = product.images?.length ? product.images : [FALLBACK_PRODUCT_IMAGE];
  const badge = state.key === "out" ? "Sold out" : state.key === "low" ? state.label : product.bestseller ? "Bestseller" : null;
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded bg-sand">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 block" aria-label={product.name} tabIndex={-1}>
          <Image src={first} alt={`${product.name}`} fill sizes={sizes} priority={priority}
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${state.key === "out" ? "opacity-60" : ""}`} />
          {second && (
            <Image src={second} alt="" fill sizes={sizes} aria-hidden="true"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden" />
          )}
        </Link>
        {badge && (
          <span className={`pointer-events-none absolute left-0 top-3 rounded-r px-2.5 py-1 text-xs font-medium ${state.key === "out" ? "bg-ink text-paper" : state.key === "low" ? "bg-marigold text-ink" : "bg-paper text-ink"}`}>{badge}</span>
        )}
        <QuickAdd product={product} />
      </div>
      <div className="mt-3 sm:mt-3.5">
        <h3 className="font-sans text-[0.92rem] sm:text-[1rem] font-medium leading-snug line-clamp-2">
          <Link href={`/product/${product.slug}`} className="hover:text-rani">{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} size={12} className="mt-1" />
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mt-1.5" />
      </div>
    </article>
  );
}
