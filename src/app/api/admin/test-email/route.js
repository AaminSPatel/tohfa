import { ok, fail, withAdmin } from "@/lib/api";
import { adminRecipients, isMailConfigured, notifyAdmin } from "@/lib/mail";
import { testEmail } from "@/lib/emailTemplates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withAdmin(async () => {
  if (!isMailConfigured()) return fail("Email isn't set up. Add SMTP_HOST, SMTP_USER and SMTP_PASS to your environment.", 503);
  const res = await notifyAdmin(testEmail());
  if (!res.ok) return fail(`The email server said: ${res.error}`, 502);
  return ok({ to: adminRecipients() });
});
