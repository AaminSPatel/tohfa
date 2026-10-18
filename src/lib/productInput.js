import { clean, cleanMultiline } from "./validators";
import { slugify } from "./utils";
import { getCategory } from "@/data/categories";

const num = (v, fallback = 0) => (Number.isFinite(Number(v)) && v !== "" && v !== null ? Number(v) : fallback);
const okImage = (src) => src.startsWith("/") || /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com)\//.test(src);
const list = (v) => (Array.isArray(v) ? v : String(v || "").split(/[\n,]/)).map((s) => String(s).trim()).filter(Boolean);

/** Validates + normalises product data coming from the admin form. */
export function parseProductInput(body = {}) {
  const errors = {};
  const name = clean(body.name, 140);
  const slug = slugify(body.slug || name);
  const price = num(body.price, NaN);
  if (name.length < 3) errors.name = "Enter a product name.";
  if (!slug) errors.slug = "Slug can't be empty.";
  if (!Number.isFinite(price) || price < 0) errors.price = "Enter a valid price.";
  const compare = body.compareAtPrice === "" || body.compareAtPrice == null ? null : num(body.compareAtPrice, null);
  if (compare !== null && compare < price) errors.compareAtPrice = "Compare-at price should be higher than the price.";
  const images = list(body.images).slice(0, 10);
  if (images.some((u) => !okImage(u))) errors.images = "Images must be a /local/path or an https://res.cloudinary.com link.";
  const cat = getCategory(body.categorySlug);
  if (!cat) errors.categorySlug = "Choose a category.";

  const persOn = Boolean(body.personalisation?.enabled);
  const personalisation = persOn
    ? {
        label: clean(body.personalisation.label, 80) || "Personalisation",
        placeholder: clean(body.personalisation.placeholder, 80),
        maxLength: Math.min(120, Math.max(1, Math.floor(num(body.personalisation.maxLength, 40)))),
        required: Boolean(body.personalisation.required),
      }
    : null;

  return {
    errors,
    value: {
      slug, name,
      shortDescription: clean(body.shortDescription, 220),
      description: cleanMultiline(body.description, 4000),
      price, compareAtPrice: compare,
      images,
      category: cat?.name || "", categorySlug: cat?.slug || "",
      tags: list(body.tags).slice(0, 20),
      stock: Math.max(0, Math.floor(num(body.stock, 0))),
      featured: Boolean(body.featured), bestseller: Boolean(body.bestseller), active: body.active !== false,
      rating: Math.min(5, Math.max(0, num(body.rating, 0))),
      reviewCount: Math.max(0, Math.floor(num(body.reviewCount, 0))),
      occasion: list(body.occasion),
      specifications: (Array.isArray(body.specifications) ? body.specifications : [])
        .map((s) => ({ label: clean(s?.label, 60), value: clean(s?.value, 200) })).filter((s) => s.label && s.value).slice(0, 20),
      personalisation,
      seoTitle: clean(body.seoTitle, 70), seoDescription: clean(body.seoDescription, 170),
    },
  };
}
