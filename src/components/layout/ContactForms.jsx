"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { Field, FormAlert, Honeypot, Input, Textarea } from "@/components/ui/Form";
import ConsentBlock from "@/components/ui/ConsentBlock";
import { validateInquiry, validateSupport } from "@/lib/validators";
import { whatsappLink } from "@/lib/utils";

/**
 * Shared submit logic. `prefix` namespaces the consent checkbox ids; `fieldPrefix` namespaces the field ids,
 * so the same form can live on the contact page and in the home-page pop-up without clashing.
 */
function useSubmit({ endpoint, validate, initial, prefix, fieldPrefix = "", extra = {} }) {
  const [values, setValues] = useState(initial);
  const [trap, setTrap] = useState("");
  const [consent, setConsent] = useState({ age: false, data: false });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ busy: false, done: false, error: "" });

  const bind = (k) => ({ value: values[k], error: errors[k], onChange: (e) => { setValues((v) => ({ ...v, [k]: e.target.value })); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); } });

  async function onSubmit(e) {
    e.preventDefault();
    // Validate WITH the consent, exactly like the server does
    const errs = validate({ ...values, consent: { age: consent.age, data: consent.data } }).errors;
    if (Object.keys(errs).length) {
      setErrors(errs);
      setState((s) => ({ ...s, error: "Please fix the highlighted fields." }));
      const first = Object.keys(errs)[0];
      document.getElementById(first.startsWith("consent") ? `${prefix}-${first}` : `${fieldPrefix}${first}`)?.focus();
      return;
    }
    setState({ busy: true, done: false, error: "" });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, ...extra, website: trap, consent }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        if (data?.errors) setErrors(data.errors);
        setState({ busy: false, done: false, error: data?.message || "Something went wrong. Please try again." });
        return;
      }
      setValues(initial); setErrors({}); setConsent({ age: false, data: false });
      setState({ busy: false, done: true, error: "" });
    } catch {
      setState({ busy: false, done: false, error: "Couldn't reach our server. Check your connection and try again." });
    }
  }
  const consentProps = {
    prefix, value: consent, errors,
    onChange: (k, v) => { setConsent((c) => ({ ...c, [k]: v })); setErrors((e) => ({ ...e, [k === "age" ? "consentAge" : "consentData"]: undefined })); },
  };
  return { bind, trap, setTrap, onSubmit, state, consentProps };
}

/** compact = the short version used in the home-page pop-up */
export function InquiryForm({ compact = false, source = "contact", onSuccess }) {
  const p = compact ? "pop-" : "";
  const f = useSubmit({
    endpoint: "/api/inquiries", validate: validateInquiry, initial: { name: "", phone: "", email: "", message: "" },
    prefix: compact ? "popup" : "inquiry", fieldPrefix: p, extra: { source },
  });
  useEffect(() => { if (f.state.done) onSuccess?.(); }, [f.state.done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (f.state.done) return <FormAlert tone="success">Thank you! We've got your message and will reply soon, usually on WhatsApp. Shukriya!</FormAlert>;
  return (
    <form onSubmit={f.onSubmit} noValidate className={compact ? "relative space-y-4" : "relative space-y-5"}>
      <Honeypot value={f.trap} onChange={(e) => f.setTrap(e.target.value)} />
      <FormAlert>{f.state.error}</FormAlert>
      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "space-y-5"}>
        <Field id={`${p}name`} label="Your name" required error={f.bind("name").error}><Input id={`${p}name`} autoComplete="name" {...f.bind("name")} /></Field>
        <Field id={`${p}phone`} label="Mobile number" required={compact} error={f.bind("phone").error}><Input id={`${p}phone`} type="tel" inputMode="numeric" autoComplete="tel" {...f.bind("phone")} /></Field>
      </div>
      {!compact && (
        <Field id="email" label="Email (optional)" error={f.bind("email").error}><Input id="email" type="email" autoComplete="email" {...f.bind("email")} /></Field>
      )}
      <Field id={`${p}message`} label={compact ? "What are you looking for?" : "How can we help?"} required error={f.bind("message").error}>
        <Textarea id={`${p}message`} rows={compact ? 3 : 5} placeholder={compact ? "E.g. anniversary gift under ₹1500" : "Who is the gift for, what's the occasion, and what's your budget?"} {...f.bind("message")} />
      </Field>
      <ConsentBlock purpose="inquiry" compact={compact} {...f.consentProps} />
      <Button type="submit" size="lg" className={compact ? "w-full" : ""} disabled={f.state.busy}>{f.state.busy ? "Sending…" : "Send message"}</Button>
      {!compact && (
        <p className="text-sm text-muted">Prefer to chat? <a className="underline underline-offset-4" href={whatsappLink("Hi! I have a question.")} target="_blank" rel="noopener noreferrer"><FaWhatsapp className="inline" aria-hidden="true" /> Message us on WhatsApp</a>.</p>
      )}
    </form>
  );
}

export function SupportForm() {
  const f = useSubmit({
    endpoint: "/api/support", validate: validateSupport, prefix: "support", fieldPrefix: "s-",
    initial: { subject: "", name: "", phone: "", email: "", orderId: "", description: "" },
  });
  if (f.state.done) return <FormAlert tone="success">Thank you for telling us. Your report is with our team and we'll contact you soon to put it right.</FormAlert>;
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative space-y-5">
      <Honeypot value={f.trap} onChange={(e) => f.setTrap(e.target.value)} />
      <FormAlert>{f.state.error}</FormAlert>
      <Field id="s-subject" label="What went wrong?" required error={f.bind("subject").error}><Input id="s-subject" placeholder="e.g. Name misspelled on the frame" {...f.bind("subject")} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="s-name" label="Your name" required error={f.bind("name").error}><Input id="s-name" autoComplete="name" {...f.bind("name")} /></Field>
        <Field id="s-orderId" label="Order number (if you have it)"><Input id="s-orderId" placeholder="TOH-261015-AB12" {...f.bind("orderId")} /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="s-phone" label="Mobile number" error={f.bind("phone").error}><Input id="s-phone" type="tel" inputMode="numeric" autoComplete="tel" {...f.bind("phone")} /></Field>
        <Field id="s-email" label="Email" error={f.bind("email").error}><Input id="s-email" type="email" autoComplete="email" {...f.bind("email")} /></Field>
      </div>
      <Field id="s-description" label="Tell us what happened" required error={f.bind("description").error}><Textarea id="s-description" rows={5} {...f.bind("description")} /></Field>
      <ConsentBlock purpose="support" {...f.consentProps} />
      <Button type="submit" size="lg" variant="ink" disabled={f.state.busy}>{f.state.busy ? "Sending…" : "Report this problem"}</Button>
    </form>
  );
}
