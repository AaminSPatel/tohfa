import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import JsonLd from "@/components/ui/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

/** Storefront chrome: announcement bar, header, footer, cart drawer and site-wide structured data. */
export default function SiteShell({ children }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <CartDrawer />
      <JsonLd data={[organizationLd(), websiteLd()]} />
    </>
  );
}
