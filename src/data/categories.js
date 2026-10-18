import { categoryImage } from "./images";

export const categories = [
  {
    slug: "birthday-gifts",
    name: "Birthday Gifts",
    description: "Boxes and bracelets that make the day feel like theirs.",
    intro:
      "Birthdays deserve more than a last-minute card. These are gifts that arrive wrapped, with a note in your words, ready to be opened slowly.",
    seoTitle: "Birthday Gifts Online in India",
    seoDescription:
      "Birthday gifts for her, him and friends: surprise boxes, charm bracelets and hampers. Free personalised note. Delivered across India.",
  },
  {
    slug: "anniversary-gifts",
    name: "Anniversary Gifts",
    description: "Keepsakes for the years you'd happily live twice.",
    intro: "Love letters in a box, 365 notes in a jar, a frame for the photo you never printed. Gifts for the ones who stayed.",
    seoTitle: "Anniversary Gifts for Husband, Wife and Partner",
    seoDescription:
      "Romantic anniversary gifts: wooden love boxes, note jars and personalised keepsakes, packed by hand in Ujjain and delivered across India.",
  },
  {
    slug: "personalised-gifts",
    name: "Personalised Gifts",
    description: "Names, dates and photos, made to order for one person.",
    intro: "We print, engrave and assemble each one after you order. Add a name, a date or a line only they would understand.",
    seoTitle: "Personalised Gifts with Name and Photo",
    seoDescription:
      "Custom photo frames, name puzzles and monogrammed gifts. Personalised free, made to order in Ujjain, shipped across India.",
  },
  {
    slug: "couple-gifts",
    name: "Couple Gifts",
    description: "For two people who share a kitchen, a bed and a mug.",
    intro: "Matching mugs, photo cushions and small things made for two. Gifts for new couples and old ones.",
    seoTitle: "Couple Gifts: Mugs, Cushions and Keepsakes",
    seoDescription: "Gifts for couples including name mugs and photo cushions. Personalised free and delivered across India.",
  },
  {
    slug: "kids-gifts",
    name: "Kids Gifts",
    description: "Wooden, safe and impossible to outgrow too fast.",
    intro: "Gifts with their name on them and nothing in them that needs batteries. Made from child-safe finishes.",
    seoTitle: "Gifts for Kids: Wooden Toys and Story Sets",
    seoDescription: "Personalised wooden blocks and storybook sets for kids. Child-safe finishes, delivered across India.",
  },
  {
    slug: "corporate-gifts",
    name: "Corporate Gifts",
    description: "Welcome kits and diaries your team will actually use.",
    intro: "Monogrammed diaries, welcome kits and thank-you boxes for clients and teams. Bulk orders from 10 pieces, with your logo.",
    seoTitle: "Corporate Gifts and Welcome Kits in India",
    seoDescription:
      "Premium corporate gifts: monogrammed diary sets and employee welcome kits. Bulk pricing and logo branding. Delivered across India.",
  },
  {
    slug: "home-decor",
    name: "Home & Decor",
    description: "Candles, diyas and green things for a house that feels lived in.",
    intro: "Housewarming gifts that earn a permanent spot on the shelf: hand-poured candles, brass diyas and tiny planters.",
    seoTitle: "Home Decor and Housewarming Gifts",
    seoDescription: "Scented candles, brass diyas and succulent planters. Housewarming gifts delivered across India.",
  },
  {
    slug: "special-occasions",
    name: "Special Occasions",
    description: "Diwali, Rakhi and the festivals that run on gifting.",
    intro: "Hampers and boxes for the dates your family circles on the calendar, packed to arrive on time.",
    seoTitle: "Festival Gifts: Diwali Hampers and Rakhi Boxes",
    seoDescription: "Diwali dry fruit hampers, Rakhi and mithai boxes and thank-you gifts. Order early, delivered across India.",
  },
].map((c) => ({ ...c, image: categoryImage(c.slug) }));

export const getCategory = (slug) => categories.find((c) => c.slug === slug);

export const priceRanges = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u750", label: "Under ₹750", min: 0, max: 749 },
  { id: "750-1500", label: "₹750 to ₹1,500", min: 750, max: 1500 },
  { id: "1500-2500", label: "₹1,500 to ₹2,500", min: 1500.01, max: 2500 },
  { id: "o2500", label: "Above ₹2,500", min: 2500.01, max: Infinity },
];

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "bestsellers", label: "Best sellers" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];
