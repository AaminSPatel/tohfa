import { ok, fail, withAdmin, readJson } from "@/lib/api";
import { ALLOWED_TYPES, MAX_BYTES, deleteImageUrls, isCloudinaryConfigured, publicIdFromUrl, uploadImage } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST multipart/form-data with one or more "files". Returns { urls: [...] } */
export const POST = withAdmin(async (request) => {
  if (!isCloudinaryConfigured()) return fail("Cloudinary isn't set up. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment.", 503);
  let form;
  try { form = await request.formData(); } catch { return fail("That upload didn't look right.", 400); }
  const files = form.getAll("files").filter((f) => typeof f === "object" && f.size > 0).slice(0, 6);
  if (!files.length) return fail("Choose at least one image.", 422);

  for (const f of files) {
    if (!ALLOWED_TYPES.includes(f.type)) return fail(`"${f.name}" isn't a JPG, PNG, WebP or AVIF image.`, 422);
    if (f.size > MAX_BYTES) return fail(`"${f.name}" is bigger than ${MAX_BYTES / 1024 / 1024} MB. Please shrink it and try again.`, 422);
  }
  const urls = [];
  try {
    for (const f of files) urls.push((await uploadImage(Buffer.from(await f.arrayBuffer()))).url);
  } catch (err) {
    console.error("[upload]", err?.message || err);
    await deleteImageUrls(urls); // don't leave half a batch behind
    return fail("Cloudinary rejected the upload. Check your credentials and try again.", 502);
  }
  return ok({ urls }, { status: 201 });
});

/** DELETE { url }: removes an image that was uploaded but never saved to a product. */
export const DELETE = withAdmin(async (request) => {
  const { url } = (await readJson(request)) || {};
  if (!publicIdFromUrl(url)) return fail("That isn't one of your uploaded images.", 422);
  await connectDB();
  if (await Product.exists({ images: url })) return ok({ kept: true }); // still used by a product
  const res = await deleteImageUrls([url]);
  return ok({ deleted: res.deleted.length });
});
