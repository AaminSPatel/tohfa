import { ok, fail, readJson, withAdmin } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export const dynamic = "force-dynamic";

export const POST = withAdmin(async (request, _ctx, session) => {
  const body = await readJson(request);
  const current = String(body?.current || ""), next = String(body?.next || "");
  if (next.length < 10) return fail("Use a new password of at least 10 characters.", 422);
  await connectDB();
  const admin = await Admin.findById(session.sub);
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) return fail("Your current password isn't right.", 403);
  admin.passwordHash = await hashPassword(next);
  await admin.save();
  return ok();
});
