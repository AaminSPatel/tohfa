"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { OrderTotals } from "@/components/cart/CartView";
import { LAST_ORDER_KEY } from "./CheckoutView";
import { siteConfig } from "@/data/siteConfig";
import { hinglish } from "@/data/hinglish";
import { orderWhatsAppLink } from "@/lib/orderMessage";
import { formatPrice, whatsappLink } from "@/lib/utils";

export default function OrderSuccessView({ reference }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || "null");
      setData(saved?.order?.orderId === reference ? saved : null);
    } catch { setData(null); }
  }, [reference]);

  if (data === undefined) return <div className="container-page py-16"><div className="h-48 animate-pulse rounded bg-sand/60" role="status" aria-label="Loading" /></div>;

  if (!data) {
    return (
      <div className="container-page py-12">
        <EmptyState icon={<FiCheck size={28} />} title={reference ? `Order ${reference}` : "No recent order found"}
          text={reference ? `We have your order request. If you need anything, message us with this reference.` : "If you just placed an order, check your WhatsApp for our confirmation."}
          action={{ label: "Keep browsing", href: "/shop" }}
          secondary={{ label: "Message us", href: whatsappLink(reference ? `Hi! About my order ${reference}.` : "Hi! I placed an order."), external: true }} />
      </div>
    );
  }

  const { order, customer } = data;
  return (
    <div className="container-page pb-20 pt-10 sm:pt-16">
      <div className="mx-auto max-w-2xl">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-leaf text-white"><FiCheck size={28} /></div>
        <h1 className="mt-6 text-display-lg">{order.received ? "Order request received." : "One last step."}</h1>
        <p className="mt-3 text-lead text-ink-soft">
          {order.received
            ? `Thank you, ${customer.name.split(" ")[0]}. We'll confirm your order on WhatsApp within ${siteConfig.orders.confirmWithin}, and share a preview if anything is personalised.`
            : "Your order is ready but it hasn't reached us yet. Send it on WhatsApp so we can confirm it."}
        </p>
        {order.received && hinglish.orderSuccess && <p className="mt-2 text-ink-soft">{hinglish.orderSuccess} Hum WhatsApp par confirm karenge.</p>}
        <p className="mt-5 inline-block rounded border border-line bg-sand/60 px-4 py-2 text-sm">Order reference: <strong className="font-medium tracking-wide">{order.orderId}</strong></p>

        {!order.received && (
          <div className="mt-6 rounded border border-marigold bg-marigold-soft/60 p-5 text-sm text-ink-soft">
            We couldn't deliver this order to our system just now, so please send it on WhatsApp. Tap the button below. Everything is pre-filled.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={orderWhatsAppLink(order, customer)} external size="lg" variant={order.received ? "outline" : "primary"}>
            <FaWhatsapp size={19} aria-hidden="true" /> {order.received ? "Message us about this order" : "Send order on WhatsApp"}
          </Button>
          <Button href="/shop" size="lg" variant={order.received ? "primary" : "outline"}>Keep browsing</Button>
        </div>

        <section className="mt-12 border-t border-line pt-8" aria-labelledby="summary-h">
          <h2 id="summary-h" className="text-display-sm">What you ordered</h2>
          <ul className="mt-4 divide-y divide-line">
            {order.items.map((i) => (
              <li key={`${i.slug}-${i.personalisation}`} className="flex justify-between gap-4 py-3">
                <span>{i.name} <span className="text-muted">x {i.qty}</span>{i.personalisation && <span className="block text-sm text-muted">Personalised: {i.personalisation}</span>}</span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5"><OrderTotals subtotal={order.subtotal} delivery={order.delivery} total={order.total} /></div>
          <p className="mt-6 text-sm text-muted">Delivering to {customer.name}, {customer.address}, {customer.city}, {customer.state} {customer.pincode}. Payment: {siteConfig.orders.paymentOptions.find((o) => o.id === order.paymentPreference)?.label}.</p>
        </section>
      </div>
    </div>
  );
}
