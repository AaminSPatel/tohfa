import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { isDbConfigured } from "./db";

export const ok = (data = {}, init) => NextResponse.json({ ok: true, ...data }, init);
export const fail = (message, status = 400, extra = {}) => NextResponse.json({ ok: false, message, ...extra }, { status });

export async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

export const clientIp = (request) => request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

/** Blocks cross-site form posts: the Origin header (when present) must match our host. */
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get("host"); } catch { return false; }
}

/** Wraps an admin API handler: origin check, session check, DB check, error handling. */
export function withAdmin(handler) {
  return async (request, ctx) => {
    if (request.method !== "GET" && !sameOrigin(request)) return fail("Request blocked.", 403);
    const session = await getSession();
    if (!session) return fail("Your session has expired. Please sign in again.", 401);
    if (!isDbConfigured()) return fail("MongoDB isn't connected yet. Add MONGODB_URI to .env.local.", 503);
    try {
      return await handler(request, ctx, session);
    } catch (err) {
      console.error("[admin api]", err);
      return fail("Something went wrong on our side. Please try again.", 500);
    }
  };
}
