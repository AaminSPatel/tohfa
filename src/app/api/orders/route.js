import { ok, fail, readJson, clientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rateLimit";
import { validateOrderInput } from "@/lib/validators";
import { createOrder, OrderError } from "@/lib/orders";
import { NOTICE_VERSION } from "@/data/privacyNotice";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!rateLimit(`order:${clientIp(request)}`, { limit: 6, windowMs: 10 * 60_000 })) {
    return fail("Too many attempts. Please wait a few minutes and try again.", 429);
  }
  const body = await readJson(request);
  if (!body) return fail("That request didn't look right. Please refresh and try again.");
  if (body.website) return ok({ orderId: "TOH-000000-0000", saved: false, received: false, items: [], subtotal: 0, delivery: 0, total: 0 }); // honeypot

  const { errors, value } = validateOrderInput(body);
  if (Object.keys(errors).length) return fail("Please check the highlighted fields.", 422, { errors });

  try {
    const consent = { ageConfirmed: true, dataConsent: true, noticeVersion: NOTICE_VERSION, purpose: "order", givenAt: new Date().toISOString() };
    return ok(await createOrder({ ...value, consent }), { status: 201 });
  } catch (err) {
    if (err instanceof OrderError) return fail(err.message, 409);
    console.error("[orders]", err);
    return fail("We couldn't place your order. Please try again, or message us on WhatsApp.", 500);
  }
}
