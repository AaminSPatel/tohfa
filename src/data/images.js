/**
 * Central image map. No image path should be written anywhere else in the code.
 *
 * Placeholders are illustrated SVGs (npm run placeholders).
 * When you have real photos:
 *   1. put  <slug>-1.jpg, <slug>-2.jpg  in public/images/products/
 *   2. put  <category-slug>.jpg         in public/images/categories/
 *   3. change IMAGE_EXT below to "jpg" (or "webp")
 */
export const IMAGE_EXT = "svg";

export const productImages = (slug, count = 2) =>
  Array.from({ length: count }, (_, i) => `/images/products/${slug}-${i + 1}.${IMAGE_EXT}`);

export const categoryImage = (slug) => `/images/categories/${slug}.${IMAGE_EXT}`;

export const heroImages = {
  frame: `/images/hero/hero-frame.${IMAGE_EXT}`,
  box: `/images/hero/hero-box.${IMAGE_EXT}`,
  candle: `/images/hero/hero-candle.${IMAGE_EXT}`,
  seasonal: `/images/hero/seasonal.${IMAGE_EXT}`,
  story: `/images/hero/story.${IMAGE_EXT}`,
};

/**
 * The shop photo shown right after the hero. Put your own photo in public/images/shop/ and change this path,
 * e.g. "/images/shop/shop-front.jpg". Landscape (16:9 or wider), at least 1600px wide looks best.
 */
export const shopImage = "/images/shop/shop-front.svg";

/** Fallback when a product has no image */
export const FALLBACK_PRODUCT_IMAGE = `/images/categories/birthday-gifts.${IMAGE_EXT}`;
