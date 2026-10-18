import { ok, fail, readJson, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { validateSupport } from "@/lib/validators";
import { connectDB, isDbConfigured } from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";

import { NOTICE_VERSION } from "@/data/privacyNotice";
import { notifyAdmin, isMailConfigured } from "@/lib/mail";
import { supportAdminEmail } from "@/lib/emailTemplates";

export const dynamic = "force-dynamic";

const stampConsent = () => ({ ageConfirmed: true, dataConsent: true, noticeVersion: NOTICE_VERSION, purpose: "support", givenAt: new Date() });


export async function POST(request) {
  if (!rateLimit(`sup:${clientIp(request)}`, { limit: 4, windowMs: 10 * 60_000 })) return fail("Too many reports. Please try again in a few minutes.", 429);
  const body = await readJson(request);
  if (!body) return fail("That request didn't look right.");
  if (body.website) return ok({ saved: true });
  const { errors, value } = validateSupport(body);
  if (Object.keys(errors).length) return fail("Please check the highlighted fields.", 422, { errors });
  if (!isDbConfigured() && !isMailConfigured()) {
    return fail("This form is offline right now. Please message us on WhatsApp.", 503, { offline: true });
  }
  const record = { ...value, consent: stampConsent() };
  let saved = false;
  if (isDbConfigured()) {
    try {
      await connectDB();
      await SupportTicket.create(record);
      saved = true;
    } catch (e) {
      console.error("[support] save failed", e);
    }
  }
  const emailed = (await notifyAdmin(supportAdminEmail(record, { saved }))).ok;
  if (!saved && !emailed) return fail("We couldn't send that. Please try WhatsApp.", 500);
  return ok({ saved, emailed }, { status: 201 });
}
