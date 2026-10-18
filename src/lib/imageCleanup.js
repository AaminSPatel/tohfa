import Product from "@/models/Product";
import { deleteImageUrls, isCloudinaryConfigured } from "./cloudinary";

/**
 * Deletes Cloudinary images that no product uses any more.
 * `exceptProductId`: the product being edited/deleted (its own references don't count).
 */
export async function deleteUnusedImages(urls, exceptProductId) {
  const candidates = [...new Set(urls)].filter(Boolean);
  if (!candidates.length || !isCloudinaryConfigured()) return { deleted: [], failed: [] };
  const query = { images: { $in: candidates } };
  if (exceptProductId) query._id = { $ne: exceptProductId };
  const stillUsed = new Set((await Product.find(query, "images").lean()).flatMap((p) => p.images));
  return deleteImageUrls(candidates.filter((u) => !stillUsed.has(u)));
}

export const removedImages = (before = [], after = []) => before.filter((u) => !after.includes(u));
