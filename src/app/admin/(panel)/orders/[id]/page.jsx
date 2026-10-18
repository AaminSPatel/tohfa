import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { PageHeader, Panel } from "@/components/admin/ui";
import StatusSelect from "@/components/admin/StatusSelect";
import { getOrderById } from "@/lib/adminData";
import { ORDER_STATUSES } from "@/models/Order";
import { siteConfig } from "@/data/siteConfig";
import { formatDate, formatPrice, whatsappLink } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default async function AdminOrderDetail({ params }) {
  const { id } = await params;
  const o = await getOrderById(id);
  if (!o) notFound();
  const c = o.customer;
  const wa = `91${c.phone}`;
  const msg = `Hi ${c.name.split(" ")[0]}, this is ${siteConfig.brandName}. Confirming your order ${o.orderId} of ${formatPrice(o.total)}.`;

  return (
    <>
      <PageHeader title={`Order ${o.orderId}`} text={`Placed ${formatDate(o.createdAt, true)}`} actions={<Link href="/admin/orders" className="text-sm underline underline-offset-4">All orders</Link>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Items">
            <ul className="divide-y divide-line">
              {o.items.map((i) => (
                <li key={`${i.slug}-${i.personalisation}`} className="flex gap-4 py-4">
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-sand"><Image src={i.image || FALLBACK_PRODUCT_IMAGE} alt="" fill sizes="64px" className="object-cover" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-muted">{formatPrice(i.price)} x {i.qty}</p>
                    {i.personalisation && <p className="mt-1 rounded bg-marigold-soft px-2 py-1 text-sm">Personalisation: <strong className="font-medium">{i.personalisation}</strong></p>}
                  </div>
                  <p className="font-medium">{formatPrice(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{o.delivery ? formatPrice(o.delivery) : "Free"}</dd></div>
              <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd>{formatPrice(o.total)}</dd></div>
            </dl>
          </Panel>
          {(o.giftNote || o.note) && (
            <Panel title="Notes from the customer">
              {o.giftNote && <p><span className="text-sm text-muted">Gift card message</span><br />{o.giftNote}</p>}
              {o.note && <p className="mt-3"><span className="text-sm text-muted">Other note</span><br />{o.note}</p>}
            </Panel>
          )}
        </div>
        <div className="space-y-6">
          <Panel title="Status"><StatusSelect endpoint={`/api/admin/orders/${o.id}`} value={o.status} options={ORDER_STATUSES} />
            <p className="mt-2 text-xs text-muted">Cancelling an order puts its items back in stock.</p></Panel>
          <Panel title="Customer">
            <p className="font-medium">{c.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{c.phone}<br />{c.email}</p>
            <p className="mt-3 text-sm text-ink-soft">{c.address}<br />{c.city}, {c.state} {c.pincode}</p>
            <p className="mt-3 text-sm"><span className="text-muted">Payment:</span> {o.paymentPreference === "upi" ? "UPI after confirmation" : "Pay on delivery"}</p>
            {o.consent?.givenAt && <p className="mt-3 text-xs text-muted">Consent recorded {formatDate(o.consent.givenAt, true)} (notice {o.consent.noticeVersion}). Age 18+ confirmed.</p>}
            <Button href={whatsappLink(msg).replace(/wa\.me\/\d+/, `wa.me/${wa}`)} external variant="outline" size="sm" className="mt-4"><FaWhatsapp aria-hidden="true" /> Message customer</Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
