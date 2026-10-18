/**
 * Tiny in-memory rate limiter. Good enough for a single server or to blunt basic abuse.
 * On serverless (Vercel) each instance has its own memory, so for strict limits swap
 * this for Upstash Redis / Vercel KV.
 */
const buckets = (globalThis._rateBuckets ||= new Map());

export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  if (buckets.size > 5000) buckets.clear();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
