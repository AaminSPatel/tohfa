import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { connectDB } from "@/lib/db";
import { parseProductInput } from "@/lib/productInput";
import Product from "@/models/Product";
import { deleteUnusedImages, removedImages } from "@/lib/imageCleanup";

export const dynamic = "force-dynamic";

export const PUT = withAdmin(async (request, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail("Product not found.", 404);
  const { errors, value } = parseProductInput(await readJson(request));
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", 422, { errors });
  await connectDB();
  if (await Product.exists({ slug: value.slug, _id: { $ne: id } })) return fail("Another product already uses that slug.", 409, { errors: { slug: "This slug is taken." } });
  const before = await Product.findById(id, "images").lean();
  if (!before) return fail("Product not found.", 404);
  await Product.findByIdAndUpdate(id, value, { new: true });
  revalidatePath("/", "layout");
  // Images that were replaced or removed are deleted from Cloudinary (never throws)
  const cleanup = await deleteUnusedImages(removedImages(before.images, value.images), id);
  return ok({ imagesDeleted: cleanup.deleted.length, imagesFailedToDelete: cleanup.failed.length });
});

export const DELETE = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  if (!isValidObjectId(id)) return fail("Product not found.", 404);
  await connectDB();
  const doc = await Product.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  const cleanup = await deleteUnusedImages(doc?.images || [], id);
  return ok({ imagesDeleted: cleanup.deleted.length });
});
