import { siteConfig } from "./siteConfig";
import { NOTICE_VERSION, grievanceOfficer, notices, retention } from "./privacyNotice";

const { shipping, returns, contact, legalName } = siteConfig;

/**
 * Policy page content. Plain structure so you can edit text without touching components.
 * IMPORTANT: have these reviewed for your business before launch. They are a starting point, not legal advice.
 */
export const policies = {
  "shipping-returns": {
    title: "Shipping and returns",
    description: "How long delivery takes, what it costs and what to do if something goes wrong.",
    updated: "October 2026",
    sections: [
      { heading: "Delivery", body: [shipping.summary, shipping.deliveryTime, shipping.dispatchNote] },
      {
        heading: "Delivery charges",
        body: [`Orders above ₹${shipping.freeThreshold.toLocaleString("en-IN")} ship free. Below that, delivery is a flat ₹${shipping.flatRate}.`],
      },
      {
        heading: "Tracking",
        body: ["Once your order ships we send the tracking link on WhatsApp and email."],
      },
      {
        heading: "Returns and replacements",
        body: [
          returns.summary,
          `To raise a request, contact us within ${returns.windowDays} days of delivery on WhatsApp (${contact.phone}) or at ${contact.email} with your order number and a photo.`,
        ],
      },
      {
        heading: "Cancellations",
        body: [
          "You can cancel before we start making or packing your order. Message us as soon as possible. Once a personalised item is in production it can't be cancelled.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy policy",
    description: `How ${legalName} collects, uses and protects your personal information under India's DPDP Act, 2023.`,
    updated: "October 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          `${legalName} (${contact.address}, ${contact.city}, ${contact.state} ${contact.pincode}) decides why and how your personal data is used. Under India's Digital Personal Data Protection Act, 2023 that makes us the "Data Fiduciary". You are the "Data Principal".`,
          "We don't ask you to create an account, and we only ask for consent before you send us your details.",
        ],
      },
      {
        heading: "What we collect, and why",
        body: [
          `When you order: ${notices.order.collect} ${notices.order.why}`,
          `When you message us: ${notices.inquiry.collect} ${notices.inquiry.why}`,
          `When you report a problem: ${notices.support.collect} ${notices.support.why}`,
          "We don't collect your details for advertising, and we don't sell or rent them.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Only the people who need it to serve you: our team, the courier who delivers your parcel (name, phone and address), our email service, and the secure host of our database and website. They may only use it for the job we give them.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [`Orders: ${retention.order}. Contact messages: ${retention.inquiry}. Problem reports: ${retention.support}.`],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask us, at any time, to: show you the personal data we hold about you; correct anything that is wrong or out of date; delete your data (except records we are legally required to keep, such as tax records of a sale); withdraw your consent; and nominate someone to exercise these rights for you if you cannot.",
          `To do any of these, email ${grievanceOfficer.email} or call ${grievanceOfficer.phone}. We reply within ${grievanceOfficer.responseDays} days.`,
          "Withdrawing consent won't affect anything we did lawfully before you withdrew it. If we can't complete an order without your details, we'll tell you.",
        ],
      },
      {
        heading: "Children",
        body: ["Our shop is for adults. Please don't place an order or send us a message if you are under 18. Ask a parent or guardian to do it. We don't knowingly collect children's data. If you think we have, tell us and we'll delete it."],
      },
      {
        heading: "Grievance officer",
        body: [
          `If you have a complaint about how we handle your data, contact ${grievanceOfficer.name}, ${grievanceOfficer.email}, ${grievanceOfficer.phone}. We'll acknowledge it and respond within ${grievanceOfficer.responseDays} days. If you're not satisfied, you can complain to the Data Protection Board of India.`,
        ],
      },
      {
        heading: "Security",
        body: ["Your details are stored in a password-protected database and are only visible to our admin team. Email and website traffic use encryption. No system is perfectly safe, and if we ever discover a breach affecting you, we'll tell you."],
      },
      {
        heading: "Cart data on your device",
        body: ["Your cart and gift note are saved in your browser (local storage) so they're still there when you come back. Clear your browser data to remove them. We don't use advertising or tracking cookies."],
      },
      { heading: "Changes", body: [`If we change this policy in a way that matters, we'll update the date above and, where needed, ask for your consent again. Current notice version: ${NOTICE_VERSION}.`] },
    ],
  },
  terms: {
    title: "Terms of service",
    description: `The terms for ordering from ${legalName}.`,
    updated: "October 2026",
    sections: [
      {
        heading: "Orders",
        body: [
          "When you submit an order you're making a request to buy. We confirm each order on WhatsApp, and it is accepted only once confirmed. We may decline an order if an item is unavailable or details are unclear.",
        ],
      },
      {
        heading: "Prices and payment",
        body: ["Prices are in Indian rupees and include applicable taxes unless stated. You can pay on delivery or by UPI after we confirm your order."],
      },
      {
        heading: "Personalised items",
        body: [
          "Please check names, dates and spellings before confirming. We proof personalised gifts with you where possible, but we aren't responsible for errors in the information you give us.",
        ],
      },
      {
        heading: "Product photos",
        body: ["Handmade items vary slightly in colour and finish. Photos are representative."],
      },
      {
        heading: "Contact",
        body: [`${legalName}, ${contact.address}, ${contact.city}, ${contact.state} ${contact.pincode}. ${contact.email}`],
      },
    ],
  },
};
