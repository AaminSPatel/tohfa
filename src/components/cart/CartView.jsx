"use client";
import { useEffect, useRef, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CartItem from "./CartItem";
import FreeShippingBar from "./FreeShippingBar";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";
import { hinglish } from "@/data/hinglish";

export function OrderTotals({ subtotal, delivery, total }) {
  return (
    <dl className="space-y-3 text-[0.95rem]">
      <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{delivery ? formatPrice(delivery) : <span className="text-leaf">Free</span>}</dd></div>
      <div className="flex justify-between border-t border-line pt-4 text-lg font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
    </dl>
  );
}

export default function CartView() {
  const { items, hydrated, setQty, remove, replaceItems, subtotal, delivery, total } = useCart();
  const [status, setStatus] = useState({});
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const checked = useRef(false);

  // Once the cart has loaded, compare it with the live catalogue (price, stock, availability).
  useEffect(() => {
    if (!hydrated || checked.current || items.length === 0) return;
    checked.current = true;
    setChecking(true);
    fetch(`/api/catalog?slugs=${encodeURIComponent([...new Set(items.map((i) => i.slug))].join(","))}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ products }) => {
        const next = {};
        const updated = items.map((i) => {
          const live = products.find((p) => p.slug === i.slug);
          if (!live) { next[i.lineId] = "unavailable"; return i; }
          if (live.stock <= 0) { next[i.lineId] = "soldout"; return { ...i, stock: 0, price: live.price }; }
          const qty = Math.min(i.qty, live.stock);
          if (qty < i.qty) next[i.lineId] = "lowered";
          return { ...i, price: live.price, name: live.name, stock: live.stock, qty };
        });
        setStatus(next);
        replaceItems(updated);
      })
      .catch(() => setFailed(true))
      .finally(() => setChecking(false));
  }, [hydrated, items, replaceItems]);

  if (!hydrated) return <div className="container-page py-16"><div className="h-64 animate-pulse rounded bg-sand/60" role="status" aria-label="Loading your cart" /></div>;

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState icon={<FiShoppingBag size={26} />} title="Your cart is empty" text={`Gifts you add will wait here. ${hinglish.emptyCart}`} action={{ label: "Browse gifts", href: "/shop" }} />
      </div>
    );
  }

  const blocked = items.some((i) => status[i.lineId] === "unavailable" || status[i.lineId] === "soldout");

  return (
    <div className="container-page pb-20 pt-8 sm:pt-12">
      <h1 className="text-display-lg">Your cart</h1>
      {failed && <p className="mt-4 rounded border border-line bg-sand/60 px-4 py-3 text-sm text-ink-soft">We couldn't double-check stock just now. We'll confirm everything when you place the order.</p>}
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="divide-y divide-line border-y border-line" aria-busy={checking}>
            {items.map((item) => <CartItem key={item.lineId} item={item} status={status[item.lineId]} onQty={setQty} onRemove={remove} />)}
          </div>
          <Button href="/shop" variant="ghost" className="mt-5">Continue shopping</Button>
        </div>
        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="space-y-6 rounded bg-blush/60 p-6 sm:p-8 lg:sticky lg:top-28">
            <FreeShippingBar subtotal={subtotal} />
            <OrderTotals subtotal={subtotal} delivery={delivery} total={total} />
            {blocked ? (
              <p role="alert" className="text-sm font-medium text-rani">Remove the unavailable items to continue.</p>
            ) : (
              <Button href="/checkout" size="lg" className="w-full">Proceed to checkout</Button>
            )}
            <p className="text-center text-sm text-muted">No account needed. Pay on delivery or by UPI after we confirm.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
