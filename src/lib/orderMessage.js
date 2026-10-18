import { formatPrice, whatsappLink } from "./utils";
import { siteConfig } from "@/data/siteConfig";

/** Pre-filled WhatsApp message for an order (also the fallback when no database is connected). */
export function orderWhatsAppLink(order, customer) {
  const lines = [
    `Hi ${siteConfig.brandName}! I'd like to place an order.`,
    order.orderId ? `Order ref: ${order.orderId}` : "",
    "",
    ...order.items.map((i) => `• ${i.name} x ${i.qty} (${formatPrice(i.price * i.qty)})${i.personalisation ? ` — "${i.personalisation}"` : ""}`),
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${order.delivery ? formatPrice(order.delivery) : "Free"}`,
    `Total: ${formatPrice(order.total)}`,
    order.giftNote ? `Gift note: ${order.giftNote}` : "",
    customer?.name ? `\nName: ${customer.name}` : "",
    customer?.address ? `Address: ${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}` : "",
  ].filter((l) => l !== "");
  return whatsappLink(lines.join("\n"));
}
