export const occasions = [
  { slug: "birthday", label: "Birthdays", blurb: "Gifts that arrive with a note in your words." },
  { slug: "anniversary", label: "Anniversaries", blurb: "Keepsakes for the years you'd live twice." },
  { slug: "diwali", label: "Diwali", blurb: "Hampers, diyas and sweets, packed to arrive on time." },
  { slug: "rakhi", label: "Raksha Bandhan", blurb: "For the sibling who still steals your chargers." },
  { slug: "housewarming", label: "Housewarming", blurb: "Small things that make four walls a home." },
  { slug: "thank-you", label: "Just to say thanks", blurb: "Because nobody says it enough." },
];

export const getOccasion = (slug) => occasions.find((o) => o.slug === slug);
