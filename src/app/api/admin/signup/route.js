import crypto from "node:crypto";
import { ok, fail, readJson, clientIp, sameOrigin } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { connectDB, isDbConfigured } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { patterns } from "@/lib/validators";
import Admin from "@/models/Admin";

export const dynamic = "force-dynamic";

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/** Admin signup is only possible with the secret ADMIN_SIGNUP_CODE from your environment. */
export async function POST(request) {
  if (!sameOrigin(request)) return fail("Request blocked.", 403);
  if (!rateLimit(`signup:${clientIp(request)}`, { limit: 5, windowMs: 30 * 60_000 })) return fail("Too many attempts. Try again later.", 429);
  if (!isDbConfigured()) return fail("MongoDB isn't connected. Add MONGODB_URI to .env.local.", 503);
  if (!process.env.ADMIN_SIGNUP_CODE) return fail("Admin signup is disabled. Set ADMIN_SIGNUP_CODE in your environment to enable it.", 403);
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return fail("AUTH_SECRET is missing or too short (min 32 characters).", 503);

  const body = await readJson(request);
  const name = String(body?.name || "").trim().slice(0, 80);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!safeEqual(body?.code || "", process.env.ADMIN_SIGNUP_CODE)) return fail("That signup code isn't right.", 403);
  if (name.length < 2) return fail("Enter your name.", 422);
  if (!patterns.email.test(email)) return fail("Enter a valid email.", 422);
  if (password.length < 10) return fail("Use a password of at least 10 characters.", 422);

  try {
    await connectDB();
    if (await Admin.exists({ email })) return fail("An admin with that email already exists.", 409);
    const admin = await Admin.create({ name, email, passwordHash: await hashPassword(password) });
    await createSession(admin);
    return ok({ name: admin.name }, { status: 201 });
  } catch (e) {
    console.error("[admin signup]", e);
    return fail("Couldn't create the account. Please try again.", 500);
  }
}
