import { revalidatePath } from "next/cache";
import { ok, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { products } from "@/data/products";

export const dynamic = "force-dynamic";

/** Imports the starter catalogue from src/data/products.js. Skips slugs that already exist. */
export const POST = withAdmin(async () => {
  await connectDB();
  const existing = new Set((await Product.find({}, "slug").lean()).map((p) => p.slug));
  const fresh = products.filter((p) => !existing.has(p.slug)).map(({ id, ...rest }) => rest);
  if (fresh.length) await Product.insertMany(fresh);
  revalidatePath("/", "layout");
  return ok({ imported: fresh.length, skipped: products.length - fresh.length });
});
