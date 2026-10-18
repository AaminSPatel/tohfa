import mongoose from "mongoose";

export const INQUIRY_STATUSES = ["new", "read", "replied", "closed"];

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    message: { type: String, required: true },
    source: { type: String, enum: ["contact", "popup"], default: "contact" },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new", index: true },
    consent: {
      ageConfirmed: Boolean, dataConsent: Boolean, noticeVersion: String, purpose: String, givenAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
