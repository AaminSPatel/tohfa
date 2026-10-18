import Link from "next/link";
import { FiShield } from "react-icons/fi";
import { notices, grievanceOfficer } from "@/data/privacyNotice";
import { siteConfig } from "@/data/siteConfig";

/**
 * DPDP-style notice + two separate, un-ticked consent checkboxes.
 * purpose: "order" | "inquiry" | "support"
 * value: { age: boolean, data: boolean }   onChange(key, checked)   errors: { consentAge?, consentData? }
 */
export default function ConsentBlock({ purpose, prefix, value, onChange, errors = {}, compact = false }) {
  const n = notices[purpose];
  const row = (label, children) => (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="font-medium text-ink">{label}</dt>
      <dd className="text-ink-soft">{children}</dd>
    </div>
  );
  const box = "mt-0.5 h-5 w-5 shrink-0 rounded border-ink/50 accent-[rgb(var(--c-rani))]";
  return (
    <section aria-labelledby={`${prefix}-notice-h`} className="space-y-5">
      {compact ? (
        <div className="rounded border border-line bg-sand/50 p-3 text-sm text-ink-soft">
          <p className="flex gap-2"><FiShield className="mt-0.5 shrink-0 text-rani" aria-hidden="true" /><span>{n.hinglish} We keep it for {n.keep.split(",")[0].toLowerCase()}.</span></p>
          <details className="mt-2">
            <summary className="inline cursor-pointer font-medium text-rani underline underline-offset-4">{n.title}</summary>
            <div className="mt-3">
              <dl className="mt-4 space-y-3">
          {row("What we collect", n.collect)}
          {row("Why", n.why)}
          {row("Who sees it", <ul className="list-disc space-y-1 pl-4">{n.sharedWith.map((s) => <li key={s}>{s}</li>)}</ul>)}
          {row("How long we keep it", n.keep)}
          {row("Your rights", <>You can ask to see, correct or delete your data, or withdraw consent, any time. Write to {grievanceOfficer.name} at <a className="text-rani underline underline-offset-4" href={`mailto:${grievanceOfficer.email}`}>{grievanceOfficer.email}</a>. We reply within {grievanceOfficer.responseDays} days. Details in our <Link href="/privacy-policy#your-rights" className="text-rani underline underline-offset-4" target="_blank">privacy policy</Link>.</>)}
        </dl>
              <p className="mt-3 text-ink">{n.hinglish}</p>
            </div>
          </details>
        </div>
      ) : (
      <div className="rounded border border-line bg-sand/50 p-4 text-sm sm:p-5">
        <h3 id={`${prefix}-notice-h`} className="flex items-center gap-2 font-display text-lg text-ink">
          <FiShield className="text-rani" aria-hidden="true" /> {n.title}
        </h3>
        <dl className="mt-4 space-y-3">
          {row("What we collect", n.collect)}
          {row("Why", n.why)}
          {row("Who sees it", <ul className="list-disc space-y-1 pl-4">{n.sharedWith.map((s) => <li key={s}>{s}</li>)}</ul>)}
          {row("How long we keep it", n.keep)}
          {row("Your rights", <>You can ask to see, correct or delete your data, or withdraw consent, any time. Write to {grievanceOfficer.name} at <a className="text-rani underline underline-offset-4" href={`mailto:${grievanceOfficer.email}`}>{grievanceOfficer.email}</a>. We reply within {grievanceOfficer.responseDays} days. Details in our <Link href="/privacy-policy#your-rights" className="text-rani underline underline-offset-4" target="_blank">privacy policy</Link>.</>)}
        </dl>
        {n.hinglish && <p className="mt-4 border-t border-line pt-3 text-ink">{n.hinglish}</p>}
      </div>
      )}

      <fieldset className="space-y-4">
        <legend className="sr-only">Confirmations needed to {n.purposeLabel}</legend>
        <div>
          <label htmlFor={`${prefix}-consentAge`} className="flex cursor-pointer gap-3 text-[0.95rem]">
            <input id={`${prefix}-consentAge`} type="checkbox" className={box} checked={value.age} onChange={(e) => onChange("age", e.target.checked)}
              aria-invalid={errors.consentAge ? true : undefined} aria-describedby={errors.consentAge ? `${prefix}-consentAge-err` : undefined} />
            <span>I am 18 years or older. <span className="text-muted">(Under 18? Please ask a parent or guardian to do this for you.)</span></span>
          </label>
          {errors.consentAge && <p id={`${prefix}-consentAge-err`} role="alert" className="ml-8 mt-1 text-sm font-medium text-rani">{errors.consentAge}</p>}
        </div>
        <div>
          <label htmlFor={`${prefix}-consentData`} className="flex cursor-pointer gap-3 text-[0.95rem]">
            <input id={`${prefix}-consentData`} type="checkbox" className={box} checked={value.data} onChange={(e) => onChange("data", e.target.checked)}
              aria-invalid={errors.consentData ? true : undefined} aria-describedby={errors.consentData ? `${prefix}-consentData-err` : undefined} />
            <span>I have read how {siteConfig.brandName} will use my details, and I agree to it so you can {n.purposeLabel}. I can withdraw this any time.</span>
          </label>
          {errors.consentData && <p id={`${prefix}-consentData-err`} role="alert" className="ml-8 mt-1 text-sm font-medium text-rani">{errors.consentData}</p>}
        </div>
      </fieldset>
    </section>
  );
}
