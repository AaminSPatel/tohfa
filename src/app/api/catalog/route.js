import { ok, fail } from "@/lib/api";
import { getProductsBySlugs } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Minimal live data for cart reconciliation: price, stock, availability. */
export async function GET(request) {
  const slugs = (new URL(request.url).searchParams.get("slugs") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30);
  if (!slugs.length) return ok({ products: [] });
  try {
    const products = await getProductsBySlugs(slugs);
    return ok({ products: products.map((p) => ({ slug: p.slug, name: p.name, price: p.price, stock: p.stock })) });
  } catch (e) {
    console.error("[catalog]", e);
    return fail("Couldn't load products.", 500);
  }
}
