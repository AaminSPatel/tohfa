/** Copy and layout content for the home page. Edit text here, not in components. */
export const homeContent = {
  hero: {
    headline: "Gifts that say what you couldn't.",
    sub: "Personalised keepsakes, hand-packed hampers and little luxuries for the people you love. Made in Ujjain, delivered across India.",
    primaryCta: { label: "Shop gifts", href: "/shop" },
    secondaryCta: { label: "Find a gift by occasion", href: "#occasions" },
    trust: [
      { icon: "edit", title: "Personalised free", text: "Names, dates, notes" },
      { icon: "package", title: "Hand-packed", text: "In our Ujjain studio" },
      { icon: "truck", title: "Delivered across India", text: "Free above ₹999" },
    ],
    tag: {
      toPlaceholder: "Priya",
      messagePlaceholder: "Happy birthday, jaan. Open this one slowly.",
      caption: "Write your note. We'll put it on a card with your gift, free.",
    },
  },

  // Shown right after the hero. Edit the text here; change the photo in src/data/images.js (shopImage).
  shop: {
    imageAlt: "The front of our gift shop on Maksi Road, Ujjain",
    heading: "Come and see it in person",
    text: "Our little shop is near Bank of India on Maksi Road, Vijayaganj Mandi. Frames, hampers and candles are on display. Pick one up, and we'll personalise it while you sip some chai.",
    hinglish: "Dekh ke, chhu ke gift chuniye. Seedha aaiye, Bank of India ke paas.",
    directionsLabel: "Get directions",
    callLabel: "Call the shop",
  },

  categories: {
    title: "Start with who it's for",
    intro: "Eight ways into the shop, from first birthdays to the twentieth anniversary.",
  },

  bestSellers: {
    title: "The ones people keep reordering",
    intro: "Our most-gifted pieces this season.",
  },

  whyUs: {
    title: "A gift shop that cares how it arrives",
    points: [
      {
        icon: "edit",
        title: "Personalised by a person",
        text: "Every name and date is checked by hand before it's printed, so 'Aanya' never becomes 'Anya'.",
      },
      {
        icon: "package",
        title: "Packed like a present",
        text: "Tissue, twine and a handwritten card, not a brown courier box with a gift inside.",
      },
      {
        icon: "truck",
        title: "Tracked, from Ujjain to your door",
        text: "You get a tracking link on WhatsApp the day it ships. Same-day delivery within Ujjain on request.",
      },
      {
        icon: "heart",
        title: "If it's wrong, we fix it",
        text: "A smudge, a typo, a cracked corner. Send us a photo and we'll remake it or refund you.",
      },
    ],
  },

  occasions: {
    title: "Gift by occasion",
    intro: "Tell us the moment. We'll show you what fits.",
  },

  seasonal: {
    title: "The Diwali edit",
    text: "Brass diyas, dry fruit hampers and little boxes of light, packed for families who gift generously. Order by the first week of November for delivery before Diwali.",
    productSlugs: ["diwali-dry-fruit-diya-hamper", "handcrafted-brass-diya-set", "little-thank-you-box"],
    cta: { label: "Shop the Diwali edit", href: "/shop?occasion=diwali" },
  },

  reviews: { title: "What people write back to us" },

  story: {
    quote: "Nobody remembers the price. They remember how it felt to open it.",
    text: "Tohfa began on a dining table in Ujjain, with a roll of twine and a friend's birthday. We still make every gift like it's for one person, because it is.",
    cta: { label: "Read our story", href: "/about" },
  },

  finalCta: {
    title: "Still not sure what to pick?",
    text: "Tell us who it's for and your budget. We'll send three ideas on WhatsApp, usually within half an hour.",
    primary: { label: "Shop gifts", href: "/shop" },
    whatsapp: { label: "Chat on WhatsApp", message: "Hi Tohfa! Can you suggest a gift? It's for ___ and my budget is ___." },
  },
};
