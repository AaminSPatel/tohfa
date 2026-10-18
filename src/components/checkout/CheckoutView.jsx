"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Field, FormAlert, Honeypot, Input, Textarea } from "@/components/ui/Form";
import { OrderTotals } from "@/components/cart/CartView";
import { useCart } from "@/components/cart/CartProvider";
import { GIFT_NOTE_KEY } from "@/components/home/GiftTag";
import { siteConfig } from "@/data/siteConfig";
import ConsentBlock from "@/components/ui/ConsentBlock";
import { hinglish } from "@/data/hinglish";
import { validateConsent, validateCustomer } from "@/lib/validators";
import { cn, formatPrice } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export const LAST_ORDER_KEY = "tohfa.lastOrder";
const empty = { name: "", phone: "", email: "", address: "", city: siteConfig.contact.city, state: siteConfig.contact.state, pincode: "" };

export default function CheckoutView() {
  const router = useRouter();
  const { items, hydrated, subtotal, delivery, total, clear } = useCart();
  const [form, setForm] = useState(empty);
  const [giftNote, setGiftNote] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState(siteConfig.orders.paymentOptions[0].id);
  const [trap, setTrap] = useState("");
  const [consent, setConsent] = useState({ age: false, data: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  // Pre-fill the gift note from the hero gift tag
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GIFT_NOTE_KEY) || "null");
      if (saved && (saved.to || saved.msg)) setGiftNote([saved.to && `To ${saved.to}`, saved.msg].filter(Boolean).join(": "));
    } catch { /* ignore */ }
  }, []);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); };

  async function submit(e) {
    e.preventDefault();
    setFormError("");
    const { errors: customerErrs } = validateCustomer(form);
    const errs = { ...customerErrs, ...validateConsent(consent) };
    if (Object.keys(errs).length) {
      setErrors(errs);
      setFormError("Please fix the highlighted fields.");
      const first = Object.keys(errs)[0];
      document.getElementById(first.startsWith("consent") ? `checkout-${first}` : first)?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form, giftNote, note, paymentPreference: payment, website: trap, consent,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, personalisation: i.personalisation })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        if (data?.errors) setErrors(data.errors);
        setFormError(data?.message || "We couldn't place your order. Please try again.");
        setBusy(false);
        return;
      }
      try { sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ order: data, customer: form })); } catch { /* ignore */ }
      clear();
      router.push(`/order-success?ref=${encodeURIComponent(data.orderId)}`);
    } catch {
      setFormError("Couldn't reach our server. Check your connection and try again.");
      setBusy(false);
    }
  }

  if (!hydrated) return <div className="container-page py-16"><div className="h-64 animate-pulse rounded bg-sand/60" role="status" aria-label="Loading checkout" /></div>;
  if (items.length === 0) {
    return <div className="container-page py-12"><EmptyState icon={<FiShoppingBag size={26} />} title="Nothing to check out yet" text="Add a gift to your cart and we'll bring you right back here." action={{ label: "Browse gifts", href: "/shop" }} /></div>;
  }

  return (
    <div className="container-page pb-20 pt-8 sm:pt-12">
      <h1 className="text-display-lg">Checkout</h1>
      <p className="mt-2 text-ink-soft">No account needed. This is an order request: we confirm it on WhatsApp within {siteConfig.orders.confirmWithin}.</p>
      {hinglish.checkoutIntro && <p className="mt-1 text-ink-soft">{hinglish.checkoutIntro}</p>}

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative space-y-10 lg:col-span-7">
          <Honeypot value={trap} onChange={(e) => setTrap(e.target.value)} />
          <FormAlert>{formError}</FormAlert>

          <fieldset className="space-y-5">
            <legend className="mb-1 text-display-sm">Who's receiving it?</legend>
            <Field id="name" label="Full name" required error={errors.name}><Input id="name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="Mobile number" required error={errors.phone} hint="We'll message you here on WhatsApp."><Input id="phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={set("phone")} error={errors.phone} hint="x" /></Field>
              <Field id="email" label="Email (optional)" error={errors.email}><Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} /></Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-1 text-display-sm">Delivery address</legend>
            <Field id="address" label="House no., street, landmark" required error={errors.address}><Textarea id="address" rows={3} autoComplete="street-address" value={form.address} onChange={set("address")} error={errors.address} /></Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="city" label="City" required error={errors.city}><Input id="city" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors.city} /></Field>
              <Field id="state" label="State" required error={errors.state}><Input id="state" autoComplete="address-level1" value={form.state} onChange={set("state")} error={errors.state} /></Field>
              <Field id="pincode" label="Pincode" required error={errors.pincode}><Input id="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pincode} onChange={set("pincode")} error={errors.pincode} /></Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-1 text-display-sm">Make it personal</legend>
            <Field id="giftNote" label="Gift note (we'll write it on a card, free)" hint={`${giftNote.length}/240`}><Textarea id="giftNote" rows={3} maxLength={240} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} placeholder="Happy birthday, jaan. Open this one slowly." hint="x" /></Field>
            <Field id="note" label="Anything else we should know? (optional)"><Textarea id="note" rows={2} maxLength={400} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Delivery time, a surprise, gate instructions" /></Field>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-display-sm">How would you like to pay?</legend>
            <div className="space-y-3">
              {siteConfig.orders.paymentOptions.map((o) => (
                <label key={o.id} className={cn("flex cursor-pointer gap-3 rounded border p-4 transition-colors", payment === o.id ? "border-rani bg-rani/5" : "border-ink/20 hover:border-ink/50")}>
                  <input type="radio" name="payment" value={o.id} checked={payment === o.id} onChange={() => setPayment(o.id)} className="mt-1 h-4 w-4 accent-[rgb(var(--c-rani))]" />
                  <span><span className="block font-medium">{o.label}</span><span className="text-sm text-ink-soft">{o.hint}</span></span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">You won't be charged online. Payment is collected only after you confirm with us.</p>
          </fieldset>

          <ConsentBlock purpose="order" prefix="checkout" value={consent} errors={errors}
            onChange={(k, v) => { setConsent((c) => ({ ...c, [k]: v })); setErrors((e) => ({ ...e, [k === "age" ? "consentAge" : "consentData"]: undefined })); }} />
        </div>

        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="rounded bg-blush/60 p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-display-sm">Your order</h2>
            <ul className="mt-5 divide-y divide-ink/10">
              {items.map((i) => (
                <li key={i.lineId} className="flex gap-3 py-3.5">
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-sand"><Image src={i.image || FALLBACK_PRODUCT_IMAGE} alt="" fill sizes="56px" className="object-cover" /></span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-medium leading-snug">{i.name}</span>
                    <span className="text-muted">Qty {i.qty}{i.personalisation ? `, "${i.personalisation}"` : ""}</span>
                  </span>
                  <span className="text-sm font-medium">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-ink/10 pt-5"><OrderTotals subtotal={subtotal} delivery={delivery} total={total} /></div>
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>{busy ? "Placing your order…" : `Place order, ${formatPrice(total)}`}</Button>
            <p className="mt-3 text-center text-sm text-muted">By placing this order you also accept our <a href="/terms" className="underline">terms</a>.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
