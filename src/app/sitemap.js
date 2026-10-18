import { siteUrl } from "@/data/siteConfig";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/store";

export default async function sitemap() {
  const now = new Date();
  const statics = ["", "/shop", "/about", "/contact", "/shipping-returns", "/privacy-policy", "/terms"].map((p) => ({
    url: `${siteUrl}${p}`, lastModified: now, changeFrequency: p === "" || p === "/shop" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/shop" ? 0.9 : 0.5,
  }));
  const cats = categories.map((c) => ({ url: `${siteUrl}/shop/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }));
  let prods = [];
  try {
    prods = (await getAllProducts()).map((p) => ({ url: `${siteUrl}/product/${p.slug}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : now, changeFrequency: "weekly", priority: 0.7 }));
  } catch (e) {
    console.error("[sitemap] could not load products", e);
  }
  return [...statics, ...cats, ...prods];
}
