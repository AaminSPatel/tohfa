import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary image storage. Credentials come ONLY from environment variables:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET   (or the single CLOUDINARY_URL)
 * Everything we upload lives under FOLDER, and we refuse to delete anything outside it.
 */
export const FOLDER = "tohfa/products";
export const MAX_BYTES = 4 * 1024 * 1024; // Vercel's request body limit is ~4.5 MB
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));

let configured = false;
function client() {
  if (!configured) {
    if (process.env.CLOUDINARY_URL) cloudinary.config({ secure: true }); // SDK reads CLOUDINARY_URL itself
    else cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
    configured = true;
  }
  return cloudinary;
}

const cloudName = () => process.env.CLOUDINARY_CLOUD_NAME || cloudinary.config().cloud_name;

/**
 * "https://res.cloudinary.com/<cloud>/image/upload/v123/tohfa/products/abc.jpg" -> "tohfa/products/abc"
 * Returns null for anything that isn't one of OUR Cloudinary images (local paths, other clouds, other folders).
 */
export function publicIdFromUrl(url) {
  try {
    client();
    const u = new URL(url);
    if (u.hostname !== "res.cloudinary.com") return null;
    const m = decodeURIComponent(u.pathname).match(/^\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    if (!m || m[1] !== cloudName()) return null;
    return m[2].startsWith(`${FOLDER}/`) ? m[2] : null;
  } catch {
    return null;
  }
}

/** Uploads one image buffer. Resized to max 1600x2000 and compressed automatically. */
export function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    client().uploader
      .upload_stream(
        {
          folder: FOLDER, resource_type: "image", allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
          transformation: [{ width: 1600, height: 2000, crop: "limit", quality: "auto" }],
        },
        (err, result) => (err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id }))
      )
      .end(buffer);
  });
}

/** Deletes our Cloudinary images by URL. Never throws. */
export async function deleteImageUrls(urls = []) {
  const deleted = [], failed = [];
  for (const url of urls) {
    const id = publicIdFromUrl(url);
    if (!id) continue; // local file or someone else's image: leave it alone
    try {
      const res = await client().uploader.destroy(id, { resource_type: "image", invalidate: true });
      (res.result === "ok" || res.result === "not found" ? deleted : failed).push(url);
    } catch (err) {
      console.error("[cloudinary] delete failed", id, err?.message || err);
      failed.push(url);
    }
  }
  return { deleted, failed };
}
