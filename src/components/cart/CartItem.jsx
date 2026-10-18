"use client";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

/** One cart line. `status`: undefined | "unavailable" | "soldout" | "lowered" (set by the cart page after checking stock). */
export default function CartItem({ item, onQty, onRemove, status, compact = false, onNavigate }) {
  const unavailable = status === "unavailable" || status === "soldout";
  return (
    <div className="flex gap-4 py-5">
      <Link href={`/product/${item.slug}`} onClick={onNavigate} className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden rounded bg-sand sm:w-24">
        <Image src={item.image || FALLBACK_PRODUCT_IMAGE} alt={item.name} fill sizes="96px" className={unavailable ? "object-cover opacity-50" : "object-cover"} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} onClick={onNavigate} className="line-clamp-2 font-medium leading-snug hover:text-rani">{item.name}</Link>
            {item.personalisation && <p className="mt-1 text-sm text-muted">Personalised: <span className="text-ink-soft">{item.personalisation}</span></p>}
          </div>
          <p className="shrink-0 font-medium">{formatPrice(item.price * item.qty)}</p>
        </div>
        {status === "unavailable" && <p className="mt-1 text-sm font-medium text-rani">No longer available. Please remove it.</p>}
        {status === "soldout" && <p className="mt-1 text-sm font-medium text-rani">Sold out right now. Remove it to continue.</p>}
        {status === "lowered" && <p className="mt-1 text-sm font-medium text-rani">We only have {item.stock} left, so we adjusted your quantity.</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          {unavailable ? <span /> : <QuantitySelector size="sm" value={item.qty} max={Math.max(1, item.stock)} onChange={(q) => onQty(item.lineId, q)} label={`Quantity for ${item.name}`} />}
          <button onClick={() => onRemove(item.lineId)} className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-rani hover:underline" aria-label={`Remove ${item.name}`}>
            <FiTrash2 size={14} aria-hidden="true" />{compact ? "Remove" : "Remove from cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
