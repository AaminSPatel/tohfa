import { revalidatePath } from "next/cache";
import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { parseProductInput } from "@/lib/productInput";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export const POST = withAdmin(async (request) => {
  const body = await readJson(request);
  const { errors, value } = parseProductInput(body);
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 422, { errors });
  await connectDB();
  if (await Product.exists({ slug: value.slug })) return fail("Another product already uses that slug.", 409, { errors: { slug: "This slug is taken." } });
  const doc = await Product.create(value);
  revalidatePath("/", "layout");
  return ok({ id: String(doc._id) }, { status: 201 });
});
