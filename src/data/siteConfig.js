/**
 * ONE FILE FOR THE WHOLE BUSINESS.
 * Change the brand, contact details, shipping rules, policies' key facts, SEO and
 * footer from here. Anything marked REPLACE is a placeholder you must update.
 */
export const siteConfig = {
  brandName: "Tohfa",
  legalName: "Tohfa Gifts", // REPLACE with your registered business name
  tagline: "Gifts that say what you couldn't.",
  description:
    "Personalised gifts, hand-packed hampers and little luxuries for birthdays, anniversaries, Diwali and every thank-you in between. Made in Ujjain, delivered across India.",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  language: "en-IN",
  locale: "en_IN",

  // Set image to e.g. "/images/branding/logo.png" to use your own logo. null = built-in wordmark.
  logo: { image: null, width: 140, height: 40 },
  favicon: "/icon.svg", // lives at src/app/icon.svg (replace the file to change it)

  contact: {
    phone: "+91 98765 43210", // REPLACE
    whatsapp: "919876543210", // REPLACE — country code + number, digits only
    email: "hello@tohfa.example", // REPLACE
    address: "Near Bank of India, Maksi Road, Vijayaganj Mandi",
    city: "Ujjain",
    state: "Madhya Pradesh",
    pincode: "455001",
    country: "India",
    countryCode: "IN",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Vijayaganj+Mandi+Maksi+Road+Ujjain", // swap for your Google Maps share link
  },

  social: {
    instagram: "https://www.instagram.com/", // REPLACE
    facebook: "https://www.facebook.com/", // REPLACE
    youtube: "",
    pinterest: "",
  },

  hours: [
    { label: "Monday to Saturday", value: "10:30 am to 8:30 pm", schema: "Mo-Sa 10:30-20:30" },
    { label: "Sunday", value: "11:00 am to 6:00 pm", schema: "Su 11:00-18:00" },
  ],
  responseTime: "We reply on WhatsApp within 30 minutes during shop hours.",

  currency: { code: "INR", symbol: "₹", locale: "en-IN" },

  shipping: {
    freeThreshold: 999,
    flatRate: 79,
    dispatchNote: "Ready-made gifts ship in 1 to 2 working days. Personalised gifts need 2 to 3 extra days to make.",
    deliveryTime: "3 to 6 working days across India. Same-day or next-day in Ujjain on request.",
    summary: "Free delivery above ₹999, otherwise ₹79. Delivered in 3 to 6 working days across India.",
  },

  returns: {
    windowDays: 7,
    summary:
      "Damaged or wrong item? Tell us within 7 days of delivery with a photo and we'll replace it or refund you. Personalised items can't be returned unless they arrive damaged or with a mistake on our side.",
  },

  inventory: { lowStockThreshold: 5 },

  orders: {
    prefix: "TOH",
    confirmWithin: "2 hours",
    paymentOptions: [
      { id: "cod", label: "Pay on delivery", hint: "Cash or UPI to the delivery partner." },
      { id: "upi", label: "Pay by UPI after we confirm", hint: "We'll send a UPI link on WhatsApp once your order is confirmed." },
    ],
  },

  announcement: [
    "Free delivery above ₹999",
    "Personalised free, on every gift that allows it",
    "Order for Diwali early. Personalised gifts take 3 to 5 days",
    // Hinglish line is added from src/data/hinglish.js
  ],

  navigation: {
    main: [
      { label: "Shop", href: "/shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    cta: { label: "Ask for gift ideas", whatsappMessage: "Hi Tohfa! I need help choosing a gift." },
  },

  footer: {
    blurb: "A small gifting studio in Ujjain. We personalise, pack and send things people keep.",
    help: [
      { label: "Shipping and returns", href: "/shipping-returns" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Your data rights", href: "/privacy-policy#your-rights" },
      { label: "Terms of service", href: "/terms" },
      { label: "Report a problem", href: "/contact#report-a-problem" },
    ],
    madeIn: "Made with care in Ujjain",
  },

  seo: {
    title: "Tohfa | Personalised gifts and hampers, delivered across India",
    titleTemplate: "%s | Tohfa",
    description:
      "Shop personalised photo frames, anniversary boxes, birthday hampers and Diwali gifts. Hand-packed in Ujjain, free personalisation, delivered across India.",
    keywords: [
      "personalised gifts India",
      "gift shop Ujjain",
      "gift shop Maksi Road Ujjain",
      "gifts near Vijayaganj Mandi",
      "anniversary gifts",
      "birthday gift hampers",
      "Diwali gift hampers",
      "custom photo frame",
    ],
    twitterHandle: "",
    ogImageAlt: "Tohfa gift shop",
  },
};

export const siteUrl = siteConfig.siteUrl.replace(/\/$/, "");
