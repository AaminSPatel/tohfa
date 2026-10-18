import SiteShell from "@/components/layout/SiteShell";
import EmptyState from "@/components/ui/EmptyState";
import { FiSearch } from "react-icons/fi";
import { hinglish } from "@/data/hinglish";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell>
      <div className="container-page py-20">
        <EmptyState
          icon={<FiSearch size={26} />}
          title="We couldn't find that page"
          text={`The link may be old, or the gift may have sold out. ${hinglish.notFound}`}
          action={{ label: "Shop all gifts", href: "/shop" }}
          secondary={{ label: "Go home", href: "/" }}
        />
      </div>
    </SiteShell>
  );
}
