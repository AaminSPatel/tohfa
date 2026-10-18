import { cn, formatDate } from "@/lib/utils";

const tones = {
  pending: "bg-marigold-soft text-ink", new: "bg-marigold-soft text-ink", open: "bg-marigold-soft text-ink",
  confirmed: "bg-blush text-rani-dark", processing: "bg-blush text-rani-dark", read: "bg-blush text-rani-dark", in_progress: "bg-blush text-rani-dark",
  shipped: "bg-sand text-ink", replied: "bg-sand text-ink",
  delivered: "bg-leaf/15 text-leaf", resolved: "bg-leaf/15 text-leaf", closed: "bg-leaf/15 text-leaf",
  cancelled: "bg-ink/10 text-ink-soft", active: "bg-leaf/15 text-leaf", hidden: "bg-ink/10 text-ink-soft",
};
export const labelFor = (s) => String(s).replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

export function StatusBadge({ status }) {
  return <span className={cn("inline-block rounded px-2 py-0.5 text-xs font-medium", tones[status] || "bg-sand text-ink")}>{labelFor(status)}</span>;
}

export function PageHeader({ title, text, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-display-md">{title}</h1>{text && <p className="mt-1 text-ink-soft">{text}</p>}</div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className, title }) {
  return (
    <section className={cn("rounded-lg border border-line bg-white p-5 sm:p-6", className)}>
      {title && <h2 className="mb-4 text-display-sm">{title}</h2>}
      {children}
    </section>
  );
}

/** Generic table: columns = [{ key, label, render?(row), className? }] */
export function DataTable({ columns, rows, empty = "Nothing here yet.", caption }) {
  if (!rows.length) return <p className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center text-ink-soft">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b border-line bg-sand/50 text-muted">
          <tr>{columns.map((c) => <th key={c.key} scope="col" className={cn("px-4 py-3 font-medium", c.className)}>{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="align-top hover:bg-sand/30">
              {columns.map((c) => <td key={c.key} className={cn("px-4 py-3.5", c.className)}>{c.render ? c.render(row) : row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Date_ = ({ value }) => <span className="whitespace-nowrap text-ink-soft">{formatDate(value, true)}</span>;

export function DbNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-marigold bg-marigold-soft/60 p-6 text-sm text-ink-soft">
      <p className="font-medium text-ink">MongoDB isn't connected yet</p>
      <p className="mt-2">Add <code className="rounded bg-white px-1">MONGODB_URI</code>, <code className="rounded bg-white px-1">AUTH_SECRET</code> and <code className="rounded bg-white px-1">ADMIN_SIGNUP_CODE</code> to <code className="rounded bg-white px-1">.env.local</code>, restart the dev server and come back. See README for the steps.</p>
    </div>
  );
}
