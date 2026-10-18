import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

/** items: [{ name, href }]. The last item is the current page. Pair with breadcrumbLd() for schema. */
export default function Breadcrumbs({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink">{item.name}</span>
              ) : (
                <>
                  <Link href={item.href} className="underline-offset-4 hover:text-rani hover:underline">{item.name}</Link>
                  <FiChevronRight size={14} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
