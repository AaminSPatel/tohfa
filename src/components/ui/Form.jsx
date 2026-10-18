import { cn } from "@/lib/utils";

const control =
  "w-full rounded border border-ink/25 bg-white px-3.5 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink/50 focus:border-rani focus:outline-none focus:ring-2 focus:ring-rani/25 disabled:bg-sand/50";

/** Label + control + hint/error, wired together for screen readers. */
export function Field({ label, id, error, hint, required, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-rani" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-rani">{error}</p>}
    </div>
  );
}

const aria = (id, error, hint) => ({
  id,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

export function Input({ id, error, hint, className, ...props }) {
  return <input {...aria(id, error, hint)} className={cn(control, "h-12", error && "border-rani", className)} {...props} />;
}

export function Textarea({ id, error, hint, className, rows = 4, ...props }) {
  return <textarea {...aria(id, error, hint)} rows={rows} className={cn(control, "py-3", error && "border-rani", className)} {...props} />;
}

export function Select({ id, error, hint, className, children, ...props }) {
  return (
    <select {...aria(id, error, hint)} className={cn(control, "h-12 pr-8", error && "border-rani", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ id, label, className, ...props }) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2.5 text-sm text-ink", className)}>
      <input id={id} type="checkbox" className="h-4 w-4 rounded border-ink/40 accent-[rgb(var(--c-rani))]" {...props} />
      {label}
    </label>
  );
}

/** Honeypot: hidden from people and screen readers, bots fill it in. */
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={value} onChange={onChange} /></label>
    </div>
  );
}

export function FormAlert({ tone = "error", children }) {
  if (!children) return null;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded border px-4 py-3 text-sm", tone === "error" ? "border-rani/30 bg-rani/5 text-rani-dark" : "border-leaf/30 bg-leaf/10 text-ink")}>
      {children}
    </div>
  );
}
