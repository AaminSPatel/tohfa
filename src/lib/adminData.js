import { connectDB } from "./db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Inquiry from "@/models/Inquiry";
import SupportTicket from "@/models/SupportTicket";
import Admin from "@/models/Admin";
import { toPlain, toPlainList } from "./serialize";
import { siteConfig } from "@/data/siteConfig";
import { isValidObjectId } from "mongoose";

/** Server-only data access for the admin panel. */
export async function adminCount() {
  await connectDB();
  return Admin.countDocuments();
}

export async function listProducts() {
  await connectDB();
  return toPlainList(await Product.find().sort({ createdAt: -1 }).lean());
}

export async function getProductById(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return toPlain(await Product.findById(id).lean());
}

export async function listOrders() {
  await connectDB();
  return toPlainList(await Order.find().sort({ createdAt: -1 }).limit(300).lean());
}

export async function getOrderById(id) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return toPlain(await Order.findById(id).lean());
}

export async function listInquiries() {
  await connectDB();
  return toPlainList(await Inquiry.find().sort({ createdAt: -1 }).limit(300).lean());
}

export async function listTickets() {
  await connectDB();
  return toPlainList(await SupportTicket.find().sort({ createdAt: -1 }).limit(300).lean());
}

export async function dashboardStats() {
  await connectDB();
  const [orders, pending, revenueAgg, newInquiries, openTickets, products, low, recent] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Inquiry.countDocuments({ status: "new" }),
    SupportTicket.countDocuments({ status: { $ne: "resolved" } }),
    Product.countDocuments(),
    Product.find({ stock: { $lte: siteConfig.inventory.lowStockThreshold } }).sort({ stock: 1 }).limit(6).lean(),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);
  return {
    orders, pending, revenue: revenueAgg[0]?.total || 0, newInquiries, openTickets, products,
    lowStock: toPlainList(low), recentOrders: toPlainList(recent),
  };
}
