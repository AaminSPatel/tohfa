import nodemailer from "nodemailer";
import { siteConfig } from "@/data/siteConfig";

/**
 * Email via SMTP (Nodemailer). Credentials come ONLY from environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, ADMIN_NOTIFY_EMAIL
 * Every function here is safe to call: nothing throws, so an email problem can never lose an order.
 */
export const isMailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const adminRecipients = () =>
  (process.env.ADMIN_NOTIFY_EMAIL || siteConfig.contact.email).split(",").map((s) => s.trim()).filter(Boolean);

let transporter;
function getTransport() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    });
  }
  return transporter;
}

const from = () => process.env.MAIL_FROM || `"${siteConfig.brandName}" <${process.env.SMTP_USER}>`;

/** @returns {Promise<{ok: boolean, error?: string}>} */
export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!isMailConfigured()) return { ok: false, error: "SMTP is not configured" };
  try {
    await getTransport().sendMail({ from: from(), to, subject, text, html, ...(replyTo ? { replyTo } : {}) });
    return { ok: true };
  } catch (err) {
    console.error("[mail] send failed:", err?.message || err);
    transporter = undefined; // rebuild the connection next time
    return { ok: false, error: err?.message || "Send failed" };
  }
}

export const notifyAdmin = (mail) => sendMail({ ...mail, to: adminRecipients() });
