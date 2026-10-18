import { siteConfig, siteUrl } from "@/data/siteConfig";
import { formatDate, formatPrice } from "./utils";

/**
 * Admin-only emails (we never email visitors). Built with tables and inline styles because that is what
 * Gmail, Outlook and phone mail apps render reliably.
 */

/** Escape anything a customer typed before putting it in HTML. */
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl = (v) => esc(v).replace(/\n/g, "<br>");

const C = { ink: "#24131E", soft: "#4A3641", muted: "#6B5560", rani: "#B4154F", raniDark: "#8E0F3D", blush: "#F5E2E1", gold: "#FBE9C2", marigold: "#F2B544", line: "#E7DCD4", bg: "#F3EDE8", leaf: "#2F7D4F" };
const FONT = "Arial,Helvetica,sans-serif";

/* ---------------------------- building blocks ---------------------------- */
const button = (href, label, primary = false) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:6px;font:bold 15px ${FONT};text-decoration:none;${primary ? `background:${C.rani};color:#ffffff;border:1px solid ${C.rani};` : `background:#ffffff;color:${C.ink};border:1px solid ${C.ink};`}">${esc(label)}</a>`;

const section = (title, inner) => `
  <tr><td style="padding:24px 28px 0;">
    <div style="font:bold 12px ${FONT};letter-spacing:1px;text-transform:uppercase;color:${C.muted};padding-bottom:8px;border-bottom:1px solid ${C.line};">${esc(title)}</div>
    <div style="padding-top:14px;font:15px/1.6 ${FONT};color:${C.ink};">${inner}</div>
  </td></tr>`;

const stat = (label, value, w, last) => `
  <td width="${w}" valign="top" style="width:${w};padding:0 ${last ? 0 : 8}px 0 0;">
    <div style="background:${C.blush};border-radius:8px;padding:12px 14px;">
      <div style="font:12px ${FONT};color:${C.muted};">${esc(label)}</div>
      <div style="font:bold 17px ${FONT};color:${C.ink};padding-top:3px;">${value}</div>
    </div>
  </td>`;

const stats = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;"><tr>${items.map(([l, v], i) => stat(l, v, `${Math.floor(100 / items.length)}%`, i === items.length - 1)).join("")}</tr></table>`;

const quote = (text, color = C.marigold) => `<div style="background:#FAF6F3;border-left:4px solid ${color};border-radius:0 6px 6px 0;padding:12px 16px;font:15px/1.6 ${FONT};color:${C.ink};">${nl(text)}</div>`;

function layout({ label, labelColor = C.raniDark, preheader, title, subtitle, body, footer }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:${C.bg};"><tr><td align="center" style="text-align:center;padding:20px 10px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
      <tr><td style="background:${C.rani};padding:16px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;"><tr>
          <td style="font:bold 20px ${FONT};color:#ffffff;">${esc(siteConfig.brandName)}</td>
          <td align="right" style="text-align:right;"><span style="display:inline-block;background:#ffffff;color:${labelColor};font:bold 11px ${FONT};letter-spacing:1px;text-transform:uppercase;padding:5px 10px;border-radius:20px;">${esc(label)}</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:28px 28px 4px;">
        <div style="font:bold 24px/1.25 ${FONT};color:${C.ink};">${title}</div>
        <div style="font:14px/1.5 ${FONT};color:${C.muted};padding-top:6px;">${subtitle}</div>
      </td></tr>
      ${body}
      <tr><td style="padding:28px;"><div style="border-top:1px solid ${C.line};padding-top:16px;font:12px/1.6 ${FONT};color:${C.muted};">${footer}</div></td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

const waLink = (phone, text) => `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
const consentLine = (c) => (c?.givenAt ? `Customer consent recorded on ${esc(formatDate(c.givenAt, true))} (privacy notice ${esc(c.noticeVersion)}), and they confirmed they are 18 or older.` : "");
const payLabel = (id) => siteConfig.orders.paymentOptions.find((o) => o.id === id)?.label || id;
const notSavedNote = `<tr><td style="padding:16px 28px 0;"><div style="background:${C.gold};border-radius:8px;padding:12px 16px;font:14px/1.5 ${FONT};color:${C.ink};"><b>Heads up:</b> this was not saved in your database (MongoDB isn't connected), so this email is your only copy. Please keep it.</div></td></tr>`;
const phonePretty = (p) => (p && p.length === 10 ? `${p.slice(0, 5)} ${p.slice(5)}` : p);

/* -------------------------------- Orders -------------------------------- */
export function orderAdminEmail(order, customer, { saved, adminId }) {
  const first = customer.name.split(" ")[0];
  const qty = order.items.reduce((s, i) => s + i.qty, 0);
  const subject = `New order ${formatPrice(order.total)} from ${customer.name} (${order.orderId})`;

  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${C.line};font:15px/1.5 ${FONT};color:${C.ink};">
        <b>${esc(i.name)}</b>
        ${i.personalisation ? `<div style="margin-top:6px;"><span style="display:inline-block;background:${C.gold};border-radius:4px;padding:4px 8px;font:13px ${FONT};color:${C.ink};">Write / print: <b>${esc(i.personalisation)}</b></span></div>` : ""}
      </td>
      <td align="center" width="50" style="text-align:center;width:50px;padding:12px 8px;border-bottom:1px solid ${C.line};font:15px ${FONT};color:${C.soft};white-space:nowrap;">x ${i.qty}</td>
      <td align="right" width="90" style="text-align:right;width:90px;padding:12px 0;border-bottom:1px solid ${C.line};font:15px ${FONT};color:${C.ink};white-space:nowrap;">${formatPrice(i.price * i.qty)}</td>
    </tr>`).join("");

  const totals = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin-top:10px;font:15px ${FONT};color:${C.soft};">
      <tr><td style="padding:3px 0;">Subtotal</td><td align="right" style="text-align:right;">${formatPrice(order.subtotal)}</td></tr>
      <tr><td style="padding:3px 0;">Delivery</td><td align="right" style="text-align:right;">${order.delivery ? formatPrice(order.delivery) : "Free"}</td></tr>
      <tr><td style="padding:8px 0 0;font:bold 18px ${FONT};color:${C.ink};">Total</td><td align="right" style="text-align:right;padding:8px 0 0;font:bold 18px ${FONT};color:${C.rani};">${formatPrice(order.total)}</td></tr>
    </table>`;

  const body = `
    ${saved ? "" : notSavedNote}
    <tr><td style="padding:18px 28px 0;">${stats([["Order total", formatPrice(order.total)], ["Items", `${qty}`], ["Payment", esc(payLabel(order.paymentPreference))]])}</td></tr>
    <tr><td style="padding:20px 28px 0;">
      ${button(`tel:+91${customer.phone}`, `Call ${phonePretty(customer.phone)}`)}
      ${button(waLink(customer.phone, `Hi ${first}, this is ${siteConfig.brandName}. We've received your order ${order.orderId} of ${formatPrice(order.total)}. Confirming the details now.`), "Confirm on WhatsApp", true)}
      ${adminId ? button(`${siteUrl}/admin/orders/${adminId}`, "Open in admin") : ""}
    </td></tr>
    ${section("What to pack", `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">${rows}</table>${totals}`)}
    ${section("Deliver to", `<b>${esc(customer.name)}</b><br>${nl(customer.address)}<br>${esc(customer.city)}, ${esc(customer.state)} ${esc(customer.pincode)}<br><span style="color:${C.muted};">Phone ${esc(phonePretty(customer.phone))}${customer.email ? ` &nbsp;|&nbsp; <a href="mailto:${esc(customer.email)}" style="color:${C.rani};">${esc(customer.email)}</a>` : ""}</span>`)}
    ${order.giftNote ? section("Message for the gift card", quote(order.giftNote)) : ""}
    ${order.note ? section("Note from the customer", quote(order.note, C.line)) : ""}`;

  const html = layout({
    label: "New order", preheader: `${formatPrice(order.total)}, ${qty} item${qty > 1 ? "s" : ""}, ${customer.city}. ${order.items[0].name}${order.items.length > 1 ? " and more" : ""}`,
    title: `New order from ${esc(customer.name)}`, subtitle: `Order <b style="color:${C.ink};">${esc(order.orderId)}</b> &nbsp;|&nbsp; ${esc(formatDate(new Date(), true))}`,
    body, footer: `${consentLine(order.consent)}<br>Sent to you automatically by your ${esc(siteConfig.brandName)} website. Customers are never emailed.`,
  });

  const text = [
    `NEW ORDER ${order.orderId}  (${formatPrice(order.total)})`, "",
    "WHAT TO PACK",
    ...order.items.map((i) => `- ${i.name} x ${i.qty} = ${formatPrice(i.price * i.qty)}${i.personalisation ? `\n    Write/print: ${i.personalisation}` : ""}`),
    `Subtotal ${formatPrice(order.subtotal)} | Delivery ${order.delivery ? formatPrice(order.delivery) : "Free"} | TOTAL ${formatPrice(order.total)}`, "",
    "DELIVER TO", customer.name, customer.address, `${customer.city}, ${customer.state} ${customer.pincode}`, `Phone: ${customer.phone}${customer.email ? `  Email: ${customer.email}` : ""}`, "",
    `Payment: ${payLabel(order.paymentPreference)}`,
    order.giftNote ? `Gift card message: ${order.giftNote}` : "", order.note ? `Customer note: ${order.note}` : "",
    "", `Confirm on WhatsApp: ${waLink(customer.phone, `Hi ${first}, this is ${siteConfig.brandName}. We've received your order ${order.orderId}.`)}`,
    adminId ? `Open in admin: ${siteUrl}/admin/orders/${adminId}` : "(Not saved in a database. Keep this email.)",
  ].filter((l) => l !== "").join("\n");

  return { subject, html, text, replyTo: customer.email || undefined };
}

/* ------------------------------- Inquiries ------------------------------- */
export function inquiryAdminEmail(i, { saved }) {
  const first = i.name.split(" ")[0];
  const from = i.source === "popup" ? "Home page pop-up" : "Contact page";
  const subject = `New inquiry from ${i.name}${i.phone ? ` (${phonePretty(i.phone)})` : ""}`;
  const body = `
    ${saved ? "" : notSavedNote}
    <tr><td style="padding:18px 28px 0;">
      ${i.phone ? button(`tel:+91${i.phone}`, `Call ${phonePretty(i.phone)}`) : ""}
      ${i.phone ? button(waLink(i.phone, `Hi ${first}, this is ${siteConfig.brandName}. Thanks for your message! `), "Reply on WhatsApp", true) : ""}
      ${i.email ? button(`mailto:${i.email}`, "Reply by email") : ""}
      ${saved ? button(`${siteUrl}/admin/inquiries`, "Open in admin") : ""}
    </td></tr>
    ${section("Their message", quote(i.message))}
    ${section("Who", `<b>${esc(i.name)}</b><br>${i.phone ? `Phone: ${esc(phonePretty(i.phone))}<br>` : ""}${i.email ? `Email: <a href="mailto:${esc(i.email)}" style="color:${C.rani};">${esc(i.email)}</a><br>` : ""}<span style="color:${C.muted};">Sent from: ${esc(from)}</span>`)}`;
  const html = layout({
    label: "Inquiry", preheader: i.message.slice(0, 110), title: `${esc(i.name)} sent an inquiry`, subtitle: esc(formatDate(new Date(), true)),
    body, footer: `${consentLine(i.consent)}<br>Sent to you automatically by your ${esc(siteConfig.brandName)} website.`,
  });
  const text = `NEW INQUIRY (${from})\n\n${i.name}\n${i.phone ? `Phone: ${i.phone}\n` : ""}${i.email ? `Email: ${i.email}\n` : ""}\n${i.message}\n${i.phone ? `\nWhatsApp: ${waLink(i.phone, `Hi ${first}, this is ${siteConfig.brandName}.`)}` : ""}`;
  return { subject, html, text, replyTo: i.email || undefined };
}

/* ----------------------------- Customer problems ----------------------------- */
export function supportAdminEmail(t, { saved }) {
  const first = t.name.split(" ")[0];
  const subject = `Problem reported by ${t.name}: ${t.subject}`;
  const body = `
    ${saved ? "" : notSavedNote}
    <tr><td style="padding:18px 28px 0;">
      ${t.phone ? button(`tel:+91${t.phone}`, `Call ${phonePretty(t.phone)}`) : ""}
      ${t.phone ? button(waLink(t.phone, `Hi ${first}, this is ${siteConfig.brandName}. Sorry about the trouble with ${t.orderId ? `order ${t.orderId}` : "your order"}. Let's sort it out.`), "Reply on WhatsApp", true) : ""}
      ${t.email ? button(`mailto:${t.email}`, "Reply by email") : ""}
      ${saved ? button(`${siteUrl}/admin/users-problems`, "Open in admin") : ""}
    </td></tr>
    ${section("What went wrong", `<div style="font:bold 16px ${FONT};padding-bottom:10px;">${esc(t.subject)}</div>${quote(t.description, C.rani)}`)}
    ${section("Who", `<b>${esc(t.name)}</b><br>${t.phone ? `Phone: ${esc(phonePretty(t.phone))}<br>` : ""}${t.email ? `Email: ${esc(t.email)}<br>` : ""}${t.orderId ? `Order number: <b>${esc(t.orderId)}</b>` : `<span style="color:${C.muted};">No order number given</span>`}`)}`;
  const html = layout({
    label: "Problem", labelColor: C.rani, preheader: `${t.subject}. ${t.description.slice(0, 90)}`, title: `${esc(t.name)} reported a problem`, subtitle: esc(formatDate(new Date(), true)),
    body, footer: `${consentLine(t.consent)}<br>Sent to you automatically by your ${esc(siteConfig.brandName)} website.`,
  });
  const text = `CUSTOMER PROBLEM\n\n${t.subject}\n\n${t.description}\n\n${t.name} ${t.phone || ""} ${t.email || ""}${t.orderId ? `\nOrder: ${t.orderId}` : ""}`;
  return { subject, html, text, replyTo: t.email || undefined };
}

export const testEmail = () => ({
  subject: `Test email from ${siteConfig.brandName}: it works`,
  html: layout({
    label: "Test", preheader: "Your email setup is working.", title: "Your email is working", subtitle: esc(formatDate(new Date(), true)),
    body: `<tr><td style="padding:18px 28px 0;font:15px/1.6 ${FONT};color:${C.ink};">New orders, inquiries and customer problems will arrive in this inbox, each with one-tap Call and WhatsApp buttons.</td></tr>`,
    footer: `Sent from the ${esc(siteConfig.brandName)} admin settings page.`,
  }),
  text: "Your email is working. New orders, inquiries and customer problems will arrive in this inbox.",
});
