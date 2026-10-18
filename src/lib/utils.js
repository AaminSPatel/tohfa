import { siteConfig } from "@/data/siteConfig";

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export function formatPrice(amount) {
  const { code, locale } = siteConfig.currency;
  return new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(amount || 0);
}

export function discountPercent(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function calcDelivery(subtotal) {
  if (!subtotal || subtotal <= 0) return 0;
  return subtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.flatRate;
}

export function stockState(stock) {
  if (!stock || stock <= 0) return { key: "out", label: "Sold out for now" };
  if (stock <= siteConfig.inventory.lowStockThreshold) return { key: "low", label: `Only ${stock} left` };
  return { key: "in", label: "In stock" };
}

export function whatsappLink(message = "") {
  const number = String(siteConfig.contact.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export const telLink = () => `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`;

export function formatAddress(c = siteConfig.contact) {
  return [c.address, c.city, `${c.state} ${c.pincode}`].filter(Boolean).join(", ");
}

export function formatDate(value, withTime = false) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function slugify(text = "") {
  return String(text).toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const productHref = (p) => `/product/${p.slug}`;
