import ProductCard from "@/components/product/ProductCard";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ShopShowcase from "@/components/home/ShopShowcase";
import InquiryPopup from "@/components/home/InquiryPopup";
import BestSellers from "@/components/home/BestSellers";
import WhyUs from "@/components/home/WhyUs";
import OccasionList from "@/components/home/OccasionList";
import SeasonalCollection from "@/components/home/SeasonalCollection";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import StorySection from "@/components/home/StorySection";
import FinalCta from "@/components/home/FinalCta";
import JsonLd from "@/components/ui/JsonLd";
import { homeContent as c } from "@/data/homeContent";
import { occasions } from "@/data/occasions";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/data/siteConfig";
import { getAllProducts, getBestSellers, getCategoryCounts, getProductsBySlugs } from "@/lib/store";
import { buildMetadata, itemListLd, localBusinessLd } from "@/lib/seo";

export const revalidate = 60;
export const metadata = buildMetadata({ title: siteConfig.seo.title, description: siteConfig.seo.description, path: "/", absoluteTitle: true });

export default async function HomePage() {
  const [all, best, counts, seasonal] = await Promise.all([
    getAllProducts(), getBestSellers(8), getCategoryCounts(), getProductsBySlugs(c.seasonal.productSlugs),
  ]);

  const occasionItems = occasions.map((o) => {
    const matches = all.filter((p) => p.occasion?.includes(o.slug));
    return { ...o, count: matches.length, image: (matches.find((p) => p.stock > 0) || matches[0])?.images?.[0] };
  }).filter((o) => o.count > 0);

  const total = all.reduce((s, p) => s + p.reviewCount, 0);
  const average = total ? all.reduce((s, p) => s + p.rating * p.reviewCount, 0) / total : 0;

  return (
    <>
      <Hero content={c.hero} />
      <ShopShowcase content={c.shop} />
      <CategoryShowcase content={c.categories} counts={counts} />
      {best.length > 0 && (
        <BestSellers content={c.bestSellers}>
          {best.map((p) => <ProductCard key={p.slug} product={p} sizes="(min-width:1024px) 24vw, 68vw" />)}
        </BestSellers>
      )}
      <WhyUs content={c.whyUs} />
      <OccasionList content={c.occasions} items={occasionItems} />
      {seasonal.length > 0 && <SeasonalCollection content={c.seasonal} products={seasonal} />}
      <ReviewsCarousel title={c.reviews.title} reviews={reviews} average={average || 4.8} total={total || 1000} />
      <StorySection content={c.story} />
      <FinalCta content={c.finalCta} />
      <InquiryPopup />
      <JsonLd data={[localBusinessLd(), itemListLd("Best selling gifts", best)]} />
    </>
  );
}
