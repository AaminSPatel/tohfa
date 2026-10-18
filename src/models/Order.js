import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: String, phone: String, email: String, address: String, city: String, state: String, pincode: String,
    },
    items: [
      new mongoose.Schema(
        { slug: String, name: String, image: String, price: Number, qty: Number, personalisation: { type: String, default: "" } },
        { _id: false }
      ),
    ],
    giftNote: { type: String, default: "" },
    note: { type: String, default: "" },
    paymentPreference: { type: String, enum: ["cod", "upi"], default: "cod" },
    subtotal: Number,
    delivery: Number,
    total: Number,
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    stockRestored: { type: Boolean, default: false },
    consent: {
      ageConfirmed: Boolean, dataConsent: Boolean, noticeVersion: String, purpose: String, givenAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
