import { cache } from "react";
import { products as staticProducts } from "@/data/products";
import { connectDB, isDbConfigured } from "./db";
import Product from "@/models/Product";
import { toPlain } from "./serialize";

/**
 * Public product data access. Reads MongoDB when MONGODB_URI is set, otherwise the
 * static catalogue in src/data/products.js. Components never talk to the database directly.
 */
export const getAllProducts = cache(async () => {
  if (!isDbConfigured()) return staticProducts.filter((p) => p.active !== false);
  await connectDB();
  const docs = await Product.find({ active: { $ne: false } }).sort({ createdAt: -1 }).lean();
  return docs.map(toPlain);
});

export const getProductBySlug = cache(async (slug) => {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) || null;
});

export const getProductsBySlugs = async (slugs = []) => {
  const all = await getAllProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
};

export const getBestSellers = async (limit = 8) => {
  const all = await getAllProducts();
  const picked = all.filter((p) => p.bestseller);
  return picked.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit);
};

export const getRelatedProducts = async (product, limit = 4) => {
  const all = await getAllProducts();
  const others = all.filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.categorySlug === product.categorySlug);
  const sharedOccasion = others.filter((p) => p.categorySlug !== product.categorySlug && p.occasion?.some((o) => product.occasion?.includes(o)));
  return [...same, ...sharedOccasion, ...others].filter((p, i, arr) => arr.indexOf(p) === i).slice(0, limit);
};

export const getCategoryCounts = async () => {
  const all = await getAllProducts();
  return all.reduce((acc, p) => ({ ...acc, [p.categorySlug]: (acc[p.categorySlug] || 0) + 1 }), {});
};
