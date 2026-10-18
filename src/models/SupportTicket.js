import mongoose from "mongoose";

export const TICKET_STATUSES = ["open", "in_progress", "resolved"];

const SupportTicketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    orderId: { type: String, default: "" },
    description: { type: String, required: true },
    status: { type: String, enum: TICKET_STATUSES, default: "open", index: true },
    adminNotes: { type: String, default: "" },
    consent: {
      ageConfirmed: Boolean, dataConsent: Boolean, noticeVersion: String, purpose: String, givenAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
