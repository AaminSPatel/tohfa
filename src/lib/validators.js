/** Shared by client forms and API routes. Pure functions, no imports. */
export const patterns = {
  phone: /^(?:\+?91[\s-]?)?[6-9]\d{9}$/,
  pincode: /^[1-9]\d{5}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const clean = (v, max = 200) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
export const cleanMultiline = (v, max = 1000) => (typeof v === "string" ? v.replace(/\r/g, "").trim().slice(0, max) : "");

export function normalisePhone(v) {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** consent = { age: true, data: true }, both must be explicitly ticked (never pre-ticked). */
export function validateConsent(consent) {
  const errors = {};
  if (consent?.age !== true) errors.consentAge = "Please confirm you are 18 or older.";
  if (consent?.data !== true) errors.consentData = "We need your permission to use your details for this.";
  return errors;
}

export function validateCustomer(input = {}) {
  const errors = {};
  const value = {
    name: clean(input.name, 80),
    phone: normalisePhone(input.phone),
    email: clean(input.email, 120).toLowerCase(),
    address: cleanMultiline(input.address, 300),
    city: clean(input.city, 60),
    state: clean(input.state, 60),
    pincode: clean(input.pincode, 6),
  };
  if (value.name.length < 2) errors.name = "Please enter your full name.";
  if (!patterns.phone.test(value.phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (value.email && !patterns.email.test(value.email)) errors.email = "That email doesn't look right. You can also leave it empty.";
  if (value.address.length < 8) errors.address = "Add your house number, street and landmark.";
  if (value.city.length < 2) errors.city = "Enter your city.";
  if (value.state.length < 2) errors.state = "Enter your state.";
  if (!patterns.pincode.test(value.pincode)) errors.pincode = "Enter a 6-digit pincode.";
  return { errors, value };
}

export function validateOrderInput(body = {}) {
  const { errors, value: customer } = validateCustomer(body.customer);
  const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  const cleanItems = items
    .map((i) => ({
      slug: clean(i?.slug, 120),
      qty: Math.floor(Number(i?.qty)),
      personalisation: clean(i?.personalisation, 80),
    }))
    .filter((i) => i.slug && i.qty > 0 && i.qty <= 20);
  const out = {};
  if (!cleanItems.length) out.items = "Your cart is empty.";
  Object.assign(out, validateConsent(body.consent));
  const paymentPreference = ["cod", "upi"].includes(body.paymentPreference) ? body.paymentPreference : "cod";
  return {
    errors: { ...errors, ...out },
    value: {
      customer,
      items: cleanItems,
      giftNote: cleanMultiline(body.giftNote, 240),
      note: cleanMultiline(body.note, 400),
      paymentPreference,
    },
  };
}

export function validateInquiry(body = {}) {
  const errors = {};
  const value = {
    name: clean(body.name, 80),
    phone: normalisePhone(body.phone),
    email: clean(body.email, 120).toLowerCase(),
    message: cleanMultiline(body.message, 1500),
    source: body.source === "popup" ? "popup" : "contact",
  };
  if (value.name.length < 2) errors.name = "Please tell us your name.";
  if (!patterns.phone.test(value.phone) && !patterns.email.test(value.email)) {
    errors.phone = "Add a phone number or an email so we can reply.";
  }
  if (value.phone && !patterns.phone.test(value.phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (value.email && !patterns.email.test(value.email)) errors.email = "That email doesn't look right.";
  if (value.message.length < 10) errors.message = "Write a few words so we know how to help.";
  Object.assign(errors, validateConsent(body.consent));
  return { errors, value };
}

export function validateSupport(body = {}) {
  const errors = {};
  const value = {
    subject: clean(body.subject, 120),
    name: clean(body.name, 80),
    phone: normalisePhone(body.phone),
    email: clean(body.email, 120).toLowerCase(),
    orderId: clean(body.orderId, 40).toUpperCase(),
    description: cleanMultiline(body.description, 2000),
  };
  if (value.subject.length < 4) errors.subject = "Give the problem a short title.";
  if (value.name.length < 2) errors.name = "Please tell us your name.";
  if (!patterns.phone.test(value.phone) && !patterns.email.test(value.email)) errors.phone = "Add a phone number or an email so we can reach you.";
  if (value.phone && !patterns.phone.test(value.phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (value.email && !patterns.email.test(value.email)) errors.email = "That email doesn't look right.";
  if (value.description.length < 15) errors.description = "Tell us a bit more about what went wrong.";
  Object.assign(errors, validateConsent(body.consent));
  return { errors, value };
}
