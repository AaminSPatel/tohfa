import { siteConfig } from "@/data/siteConfig";
import { calcDelivery } from "./utils";
import { getAllProducts } from "./store";
import { connectDB, isDbConfigured } from "./db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { notifyAdmin } from "./mail";
import { orderAdminEmail } from "./emailTemplates";

export class OrderError extends Error {}

function makeOrderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${siteConfig.orders.prefix}-${ymd}-${rand}`;
}

/**
 * Builds an order from slugs + quantities. Prices and stock ALWAYS come from the server's
 * product data, never from the browser. Saves to MongoDB when configured.
 */
export async function createOrder(input) {
  const catalogue = await getAllProducts();
  const lines = [];

  for (const item of input.items) {
    const p = catalogue.find((x) => x.slug === item.slug);
    if (!p) throw new OrderError("One of the items in your cart is no longer available. Please review your cart.");
    if (p.stock < item.qty) {
      throw new OrderError(p.stock > 0 ? `Only ${p.stock} of "${p.name}" left. Please reduce the quantity.` : `"${p.name}" is sold out right now.`);
    }
    if (p.personalisation?.required && !item.personalisation) {
      throw new OrderError(`Please add the personalisation for "${p.name}" (${p.personalisation.label}).`);
    }
    lines.push({
      slug: p.slug, name: p.name, image: p.images?.[0] || "", price: p.price, qty: item.qty,
      personalisation: p.personalisation ? item.personalisation.slice(0, p.personalisation.maxLength || 60) : "",
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = calcDelivery(subtotal);
  const total = subtotal + delivery;
  const orderId = makeOrderId();
  const summary = { orderId, items: lines, subtotal, delivery, total, giftNote: input.giftNote, paymentPreference: input.paymentPreference };
  const emailOrder = { ...summary, note: input.note, consent: input.consent };

  // Without a database we can still receive the order by email.
  if (!isDbConfigured()) return finish(emailOrder, input.customer, false);

  await connectDB();
  // Reserve stock atomically; roll back if any line fails.
  const reserved = [];
  let createdId;
  try {
    for (const l of lines) {
      const res = await Product.updateOne({ slug: l.slug, stock: { $gte: l.qty } }, { $inc: { stock: -l.qty } });
      if (res.modifiedCount !== 1) throw new OrderError(`"${l.name}" just sold out. Please review your cart.`);
      reserved.push(l);
    }
    const doc = await Order.create({
      orderId, customer: input.customer, items: lines, giftNote: input.giftNote, note: input.note,
      paymentPreference: input.paymentPreference, subtotal, delivery, total, status: "pending", consent: input.consent,
    });
    createdId = doc._id;
  } catch (err) {
    await Promise.all(reserved.map((l) => Product.updateOne({ slug: l.slug }, { $inc: { stock: l.qty } })));
    throw err;
  }
  return finish(emailOrder, input.customer, true, String(createdId));
}

/** Emails ONLY the admin (never the visitor). `received` = the shop really has the order (saved or emailed). */
async function finish(order, customer, saved, adminId) {
  const admin = await notifyAdmin(orderAdminEmail(order, customer, { saved, adminId }));
  const { consent, note, ...publicOrder } = order;
  return { ...publicOrder, saved, emailed: admin.ok, received: saved || admin.ok };
}

/** Called when an order moves to/from "cancelled" so stock stays accurate. */
export async function restoreStockOnce(order) {
  if (order.stockRestored) return;
  await Promise.all(order.items.map((l) => Product.updateOne({ slug: l.slug }, { $inc: { stock: l.qty } })));
  order.stockRestored = true;
}
