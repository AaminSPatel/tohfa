import { isValidObjectId } from "mongoose";
import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { restoreStockOnce } from "@/lib/orders";
import Order, { ORDER_STATUSES } from "@/models/Order";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export const PATCH = withAdmin(async (request, { params }) => {
  const { id } = await params;
  const { status } = (await readJson(request)) || {};
  if (!isValidObjectId(id)) return fail("Order not found.", 404);
  if (!ORDER_STATUSES.includes(status)) return fail("Choose a valid status.", 422);
  await connectDB();
  const order = await Order.findById(id);
  if (!order) return fail("Order not found.", 404);
  if (status === "cancelled" && order.status !== "cancelled") await restoreStockOnce(order);
  order.status = status;
  await order.save();
  if (status === "cancelled") revalidatePath("/", "layout");
  return ok({ status });
});
