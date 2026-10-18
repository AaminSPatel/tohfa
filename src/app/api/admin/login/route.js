import { ok, fail, readJson, clientIp, sameOrigin } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { connectDB, isDbConfigured } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";

export const dynamic = "force-dynamic";

// Unknown emails still pay the bcrypt cost, so response time doesn't reveal which emails exist.
let dummy;
const dummyHash = () => (dummy ||= bcrypt.hashSync("not-a-real-password", 12));

export async function POST(request) {
  if (!sameOrigin(request)) return fail("Request blocked.", 403);
  if (!rateLimit(`login:${clientIp(request)}`, { limit: 8, windowMs: 15 * 60_000 })) return fail("Too many sign-in attempts. Try again in 15 minutes.", 429);
  if (!isDbConfigured()) return fail("MongoDB isn't connected. Add MONGODB_URI to .env.local.", 503);
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return fail("AUTH_SECRET is missing or too short (min 32 characters).", 503);

  const body = await readJson(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (!email || !password) return fail("Enter your email and password.", 422);

  try {
    await connectDB();
    const admin = await Admin.findOne({ email });
    const valid = await verifyPassword(password, admin?.passwordHash || dummyHash());
    if (!admin || !valid) return fail("That email and password don't match.", 401);
    admin.lastLoginAt = new Date();
    await admin.save();
    await createSession(admin);
    return ok({ name: admin.name });
  } catch (e) {
    console.error("[admin login]", e);
    return fail("Couldn't sign you in. Please try again.", 500);
  }
}
