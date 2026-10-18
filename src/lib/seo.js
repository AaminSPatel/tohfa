import { siteConfig, siteUrl } from "@/data/siteConfig";
import { formatAddress } from "./utils";

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const isRaster = (src = "") => /\.(png|jpe?g|webp)$/i.test(src);

/** Per-page metadata. Title gets the " | Brand" template from the root layout. */
export function buildMetadata({ title, description, path = "/", image, noIndex = false, absoluteTitle = false }) {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.brandName}`;
  // Social crawlers can't read SVG. Only attach an image when it's a raster file; otherwise
  // the site-wide generated card (app/opengraph-image.jsx) is used.
  const ogImages = image && isRaster(image) ? [{ url: image.startsWith("http") ? image : absoluteUrl(image), alt: title }] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title: fullTitle, description, url, siteName: siteConfig.brandName, locale: siteConfig.locale, type: "website", ...(ogImages ? { images: ogImages } : {}) },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...(ogImages ? { images: ogImages.map((i) => i.url) } : {}) },
  };
}

/* ---------------- JSON-LD builders ---------------- */
export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brandName,
  legalName: siteConfig.legalName,
  url: siteUrl,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  sameAs: Object.values(siteConfig.social).filter(Boolean),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.brandName,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/shop?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const localBusinessLd = () => {
  const c = siteConfig.contact;
  return {
    "@context": "https://schema.org",
    "@type": "GiftShop",
    name: siteConfig.brandName,
    description: siteConfig.description,
    url: siteUrl,
    telephone: c.phone,
    email: c.email,
    priceRange: "₹₹",
    address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: c.city, addressRegion: c.state, postalCode: c.pincode, addressCountry: c.countryCode },
    openingHours: siteConfig.hours.map((h) => h.schema),
    hasMap: c.googleMapsUrl,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
    areaServed: "IN",
  };
};

export const breadcrumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
});

export const itemListLd = (name, products) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/product/${p.slug}`), name: p.name })),
});

export const productLd = (p) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.shortDescription,
  sku: p.slug,
  category: p.category,
  image: (p.images || []).map((src) => (src.startsWith("http") ? src : absoluteUrl(src))),
  brand: { "@type": "Brand", name: siteConfig.brandName },
  ...(p.reviewCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount } } : {}),
  offers: {
    "@type": "Offer",
    url: absoluteUrl(`/product/${p.slug}`),
    priceCurrency: siteConfig.currency.code,
    price: p.price,
    availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: siteConfig.brandName },
  },
});

export const addressLine = formatAddress;
