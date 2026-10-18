import { siteConfig } from "./siteConfig";

/**
 * Data-protection notice shown next to every form that collects personal data
 * (checkout, contact, problem report). Written for India's Digital Personal Data Protection Act, 2023 (DPDP):
 * clear notice BEFORE consent, a separate un-ticked consent box, what/why/who/how long, rights, grievance contact.
 *
 * IMPORTANT: this is a good-faith starting point, not legal advice. Have your CA or a lawyer review it,
 * and update the retention periods and the grievance officer below.
 *
 * If you change the meaning of this notice, change NOTICE_VERSION: every order/inquiry stores the version
 * the customer agreed to.
 */
export const NOTICE_VERSION = "2026-10-v1";

export const grievanceOfficer = {
  name: `${siteConfig.brandName} team`, // REPLACE with a person's name who will handle data requests
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  responseDays: 7,
};

export const retention = {
  order: "6 years (we must keep sale and tax records)",
  inquiry: "12 months, then deleted",
  support: "24 months, then deleted",
};

const common = {
  recipients: [
    "Our small team at the Ujjain studio.",
    "Our email service (so your request reaches our inbox). We never email you unless you ask us to.",
    "Our secure database host, where records are stored.",
  ],
};

export const notices = {
  order: {
    title: "How we'll use your details",
    collect: "Your name, mobile number, email (if you give it), delivery address, gift note, order notes and what you ordered.",
    why: "To confirm your order on WhatsApp or call, pack and deliver it, and fix any problem with it. We don't use it for anything else, and we don't sell it.",
    sharedWith: [...common.recipients, "The courier or delivery partner who delivers your parcel (name, phone, address only)."],
    keep: retention.order,
    hinglish: "Aapki details sirf order confirm aur delivery ke liye use hongi. Kisi ko bechi nahi jaati.",
    purposeLabel: "place this order",
  },
  inquiry: {
    title: "How we'll use your details",
    collect: "Your name, phone number and/or email, and the message you write.",
    why: "To reply to your question and help you choose a gift. Nothing else, and no marketing messages unless you ask for them.",
    sharedWith: common.recipients,
    keep: retention.inquiry,
    hinglish: "Aapka message sirf jawab dene ke liye use hoga.",
    purposeLabel: "send this message",
  },
  support: {
    title: "How we'll use your details",
    collect: "Your name, phone number and/or email, your order number if you share it, and what you tell us went wrong.",
    why: "To look into the problem and put it right (replacement, refund or a call back).",
    sharedWith: common.recipients,
    keep: retention.support,
    hinglish: "Aapki shikayat sirf problem solve karne ke liye use hogi.",
    purposeLabel: "report this problem",
  },
};
