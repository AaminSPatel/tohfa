import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { heroImages, FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default function SeasonalCollection({ content, products }) {
  return (
    <section className="section-y overflow-hidden" aria-labelledby="seasonal-heading">
      <div className="container-page">
        <div className="mx-auto max-w-md sm:max-w-xl md:max-w-none grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-10 lg:gap-16">
          {/* Diwali Image */}
          <Reveal className="w-full md:col-span-5 lg:col-span-6">
            <div className="relative mx-auto aspect-[16/10] sm:aspect-[4/3] md:aspect-[4/4.4] w-full max-w-sm sm:max-w-md md:max-w-none overflow-hidden rounded-xl bg-marigold-soft shadow-soft">
              <Image
                src={heroImages.seasonal}
                alt="Brass diyas glowing among marigold petals"
                fill
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 42vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Diwali Edit Content */}
          <div className="w-full md:col-span-7 lg:col-span-6">
            <h2 id="seasonal-heading" className="text-display-lg">
              {content.title}
            </h2>

            <p className="mt-3 max-w-lg text-base sm:text-lead text-ink-soft">
              {content.text}
            </p>

            <ul className="mt-6 sm:mt-8 divide-y divide-line border-y border-line">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/product/${p.slug}`}
                    className="group flex items-center justify-between gap-3 sm:gap-4 py-3 sm:py-3.5"
                  >
                    {/* Product Image */}
                    <span className="relative h-14 w-12 sm:h-16 sm:w-14 shrink-0 overflow-hidden rounded bg-sand">
                      <Image
                        src={p.images?.[0] || FALLBACK_PRODUCT_IMAGE}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 56px, 48px"
                        className="object-cover"
                      />
                    </span>

                    {/* Product Details */}
                    <span className="min-w-0 flex-1 pr-2">
                      <span className="block truncate text-sm sm:text-base font-medium group-hover:text-rani">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs sm:text-sm text-muted">
                        {p.shortDescription}
                      </span>
                    </span>

                    {/* Price */}
                    <Price price={p.price} className="shrink-0 text-right text-sm sm:text-base" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 sm:mt-8">
              <Button
                href={content.cta.href}
                size="lg"
                className="w-full sm:w-auto max-w-xs"
              >
                {content.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
