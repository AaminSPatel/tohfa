import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import CategoryTabs from "@/components/shop/CategoryTabs";
import ShopBrowser from "@/components/shop/ShopBrowser";
import { categories, getCategory } from "@/data/categories";
import { getAllProducts } from "@/lib/store";
import { breadcrumbLd, buildMetadata, itemListLd } from "@/lib/seo";

export const revalidate = 60;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Category not found", robots: { index: false } };
  return buildMetadata({ title: cat.seoTitle, description: cat.seoDescription, path: `/shop/${cat.slug}` });
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const products = (await getAllProducts()).filter((p) => p.categorySlug === cat.slug);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }, { name: cat.name, href: `/shop/${cat.slug}` }];

  return (
    <div className="container-page pb-20 pt-8 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-6 grid items-end gap-8 sm:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-display-lg">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-lead text-ink-soft">{cat.intro}</p>
        </div>
        <div className="relative hidden h-28 w-24 overflow-hidden rounded bg-sand sm:block">
          <Image src={cat.image} alt="" fill sizes="96px" className="object-cover" priority />
        </div>
      </div>
      <div className="mt-8"><CategoryTabs active={cat.slug} /></div>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded bg-sand/60" />}>
        <ShopBrowser products={products} categoryName={cat.name} />
      </Suspense>
      <JsonLd data={[breadcrumbLd(crumbs), itemListLd(cat.name, products)]} />
    </div>
  );
}
