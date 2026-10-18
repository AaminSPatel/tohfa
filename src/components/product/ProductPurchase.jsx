"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import Button from "@/components/ui/Button";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { Field, Input } from "@/components/ui/Form";
import { useCart } from "@/components/cart/CartProvider";
import { absoluteUrl } from "@/lib/seo";
import { formatPrice, stockState, whatsappLink } from "@/lib/utils";

/** Quantity, personalisation, Add to cart / Buy now / WhatsApp, plus a sticky bar on mobile. */
export default function ProductPurchase({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef(null);
  const state = stockState(product.stock);
  const soldOut = state.key === "out";
  const pers = product.personalisation;

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const validate = () => {
    if (pers?.required && !text.trim()) { setError(`Please add: ${pers.label.toLowerCase()}.`); document.getElementById("personalisation")?.focus(); return false; }
    setError(""); return true;
  };

  const add = () => {
    if (!validate()) return;
    addItem(product, qty, text);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const buyNow = () => {
    if (!validate()) return;
    addItem(product, qty, text, { openDrawer: false });
    router.push("/checkout");
  };

  const msg = `Hi! I have a question about "${product.name}" (${absoluteUrl(`/product/${product.slug}`)}).`;
  const stockColor = state.key === "in" ? "text-leaf" : state.key === "low" ? "text-rani-dark" : "text-muted";

  return (
    <div>
      <p className={`flex items-center gap-2 text-sm font-medium ${stockColor}`}>
        <span className={`h-2 w-2 rounded-full ${state.key === "in" ? "bg-leaf" : state.key === "low" ? "bg-marigold" : "bg-muted"}`} aria-hidden="true" />
        {state.label}{soldOut ? ". Message us to be told when it's back." : ""}
      </p>

      {pers && !soldOut && (
        <Field id="personalisation" label={pers.label} required={pers.required} error={error} hint={`${text.length}/${pers.maxLength || 40}. We'll check this with you on WhatsApp before we make it.`} className="mt-6">
          <Input id="personalisation" value={text} maxLength={pers.maxLength || 40} placeholder={pers.placeholder} error={error} onChange={(e) => { setText(e.target.value); setError(""); }} />
        </Field>
      )}

      <div ref={ctaRef} className="mt-6 space-y-3">
        {!soldOut && (
          <div className="flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, product.stock)} />
            <Button onClick={add} size="lg" className="min-w-[200px] flex-1">
              {added ? <><FiCheck size={20} aria-hidden="true" /> Added to cart</> : <>Add to cart<span className="ml-1 border-l border-white/40 pl-3 font-normal">{formatPrice(product.price * qty)}</span></>}
            </Button>
          </div>
        )}
        {!soldOut && <Button onClick={buyNow} variant="ink" size="lg" className="w-full">Buy now</Button>}
        <Button href={whatsappLink(msg)} external variant="outline" size="lg" className="w-full">
          <FaWhatsapp size={19} aria-hidden="true" /> {soldOut ? "Ask when it's back" : "Ask about this gift on WhatsApp"}
        </Button>
      </div>

      {showBar && !soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-4 py-3 shadow-lift lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-sm text-ink-soft">{formatPrice(product.price)}</p>
            </div>
            <Button onClick={() => { if (pers?.required && !text.trim()) { document.getElementById("personalisation")?.scrollIntoView({ behavior: "smooth", block: "center" }); validate(); } else add(); }} size="md">
              {added ? "Added" : "Add to cart"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
