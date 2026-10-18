import { notFound } from "next/navigation";
import Link from "next/link";
import { FiChevronDown, FiTruck, FiRefreshCw, FiEdit3 } from "react-icons/fi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Price from "@/components/ui/Price";
import Rating from "@/components/ui/Rating";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductGrid from "@/components/product/ProductGrid";
import ReviewSection from "@/components/product/ReviewSection";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/store";
import { getReviewsForProduct } from "@/data/reviews";
import { getCategory } from "@/data/categories";
import { siteConfig } from "@/data/siteConfig";
import { breadcrumbLd, buildMetadata, productLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  try { return (await getAllProducts()).map((p) => ({ slug: p.slug })); } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Gift not found", robots: { index: false } };
  return buildMetadata({ title: p.seoTitle || p.name, description: p.seoDescription || p.shortDescription, path: `/product/${p.slug}`, image: p.images?.[0] });
}

function Accordion({ title, children, open = false }) {
  return (
    <details open={open} className="group border-b border-line py-1">
      <summary className="flex items-center justify-between py-4 font-medium">
        {title}<FiChevronDown className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-ink-soft">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const reviews = getReviewsForProduct(product.slug);
  const cat = getCategory(product.categorySlug);
  const crumbs = [
    { name: "Home", href: "/" }, { name: "Shop", href: "/shop" },
    ...(cat ? [{ name: cat.name, href: `/shop/${cat.slug}` }] : []),
    { name: product.name, href: `/product/${product.slug}` },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page pt-6 sm:pt-8"><Breadcrumbs items={crumbs} /></div>

      <section className="container-page grid gap-10 pb-16 pt-6 lg:grid-cols-12 lg:gap-14 lg:pb-24">
        <div className="lg:col-span-7"><ProductGallery images={product.images} name={product.name} /></div>

        <div className="lg:col-span-5">
          {cat && <Link href={`/shop/${cat.slug}`} className="text-sm text-muted underline-offset-4 hover:text-rani hover:underline">{cat.name}</Link>}
          <h1 className="mt-2 text-display-md">{product.name}</h1>
          <Rating value={product.rating} count={product.reviewCount} size={16} className="mt-3" />
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" className="mt-4" />
          <p className="mt-1 text-sm text-muted">Inclusive of taxes. {siteConfig.shipping.freeThreshold > product.price ? `Free delivery above ₹${siteConfig.shipping.freeThreshold}.` : "Free delivery."}</p>
          <p className="mt-5 text-lead text-ink-soft">{product.shortDescription}</p>

          <div className="mt-7"><ProductPurchase product={product} /></div>

          <ul className="mt-8 grid gap-3 border-y border-line py-5 text-sm text-ink-soft">
            <li className="flex gap-3"><FiEdit3 className="mt-0.5 shrink-0 text-rani" aria-hidden="true" />{product.personalisation ? "Personalised by us and checked with you before we make it." : "Packed with a handwritten card in your words."}</li>
            <li className="flex gap-3"><FiTruck className="mt-0.5 shrink-0 text-rani" aria-hidden="true" />{siteConfig.shipping.summary}</li>
            <li className="flex gap-3"><FiRefreshCw className="mt-0.5 shrink-0 text-rani" aria-hidden="true" />Damaged or wrong? We replace or refund within {siteConfig.returns.windowDays} days.</li>
          </ul>

          <div className="mt-6">
            <Accordion title="About this gift" open>
              <div className="prose-gift">{product.description.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}</div>
            </Accordion>
            {product.specifications?.length > 0 && (
              <Accordion title="Details and specifications">
                <dl className="divide-y divide-line">
                  {product.specifications.map((s) => (
                    <div key={s.label} className="grid grid-cols-[110px_1fr] gap-4 py-2.5"><dt className="text-muted">{s.label}</dt><dd className="text-ink">{s.value}</dd></div>
                  ))}
                </dl>
              </Accordion>
            )}
            <Accordion title="Shipping">
              <p>{siteConfig.shipping.deliveryTime}</p><p className="mt-2">{siteConfig.shipping.dispatchNote}</p>
            </Accordion>
            <Accordion title="Returns">
              <p>{siteConfig.returns.summary}</p><p className="mt-2"><Link href="/shipping-returns" className="text-rani underline underline-offset-4">Read the full policy</Link></p>
            </Accordion>
          </div>
        </div>
      </section>

      <ReviewSection product={product} reviews={reviews} />

      {related.length > 0 && (
        <section className="border-t border-line py-16 sm:py-20" aria-labelledby="related-heading">
          <div className="container-page">
            <SectionHeading id="related-heading" title="You might also give" link={{ label: "Shop all", href: "/shop" }} />
            <div className="mt-10"><ProductGrid products={related} /></div>
          </div>
        </section>
      )}
      <JsonLd data={[productLd(product), breadcrumbLd(crumbs)]} />
    </div>
  );
}
