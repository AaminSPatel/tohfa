import { ok, fail, readJson, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { validateInquiry } from "@/lib/validators";
import { connectDB, isDbConfigured } from "@/lib/db";
import Inquiry from "@/models/Inquiry";

import { NOTICE_VERSION } from "@/data/privacyNotice";
import { notifyAdmin, isMailConfigured } from "@/lib/mail";
import { inquiryAdminEmail } from "@/lib/emailTemplates";

export const dynamic = "force-dynamic";

const stampConsent = () => ({ ageConfirmed: true, dataConsent: true, noticeVersion: NOTICE_VERSION, purpose: "inquiry", givenAt: new Date() });


export async function POST(request) {
  if (!rateLimit(`inq:${clientIp(request)}`, { limit: 5, windowMs: 10 * 60_000 })) return fail("Too many messages. Please try again in a few minutes.", 429);
  const body = await readJson(request);
  if (!body) return fail("That request didn't look right.");
  if (body.website) return ok({ saved: true }); // honeypot
  const { errors, value } = validateInquiry(body);
  if (Object.keys(errors).length) return fail("Please check the highlighted fields.", 422, { errors });
  if (!isDbConfigured() && !isMailConfigured()) {
    return fail("This form is offline right now. Please message us on WhatsApp.", 503, { offline: true });
  }
  const record = { ...value, consent: stampConsent() };
  let saved = false;
  if (isDbConfigured()) {
    try {
      await connectDB();
      await Inquiry.create(record);
      saved = true;
    } catch (e) {
      console.error("[inquiries] save failed", e);
    }
  }
  const emailed = (await notifyAdmin(inquiryAdminEmail(record, { saved }))).ok;
  if (!saved && !emailed) return fail("We couldn't send that. Please try WhatsApp.", 500);
  return ok({ saved, emailed }, { status: 201 });
}
