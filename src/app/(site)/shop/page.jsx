import { Suspense } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ShopBrowser from "@/components/shop/ShopBrowser";
import { hinglish } from "@/data/hinglish";
import { getAllProducts } from "@/lib/store";
import { breadcrumbLd, buildMetadata, itemListLd } from "@/lib/seo";

export const revalidate = 60;
export const metadata = buildMetadata({
  title: "Shop Personalised Gifts and Hampers",
  description: "Browse personalised photo frames, anniversary boxes, birthday hampers, Diwali gifts and more. Free personalisation, delivered across India.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getAllProducts();
  const crumbs = [{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }];
  return (
    <div className="container-page pb-20 pt-8 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-5 text-display-lg">All gifts</h1>
      <p className="mt-3 max-w-xl text-lead text-ink-soft">Every piece is packed by hand in Ujjain. Most can be personalised for free.</p>
      {hinglish.shopIntro && <p className="mt-1 max-w-xl text-ink-soft">{hinglish.shopIntro}</p>}
      <div className="mt-8"><CategoryTabs active={null} /></div>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded bg-sand/60" />}>
        <ShopBrowser products={products} />
      </Suspense>
      <JsonLd data={[breadcrumbLd(crumbs), itemListLd("All gifts", products.slice(0, 20))]} />
    </div>
  );
}
