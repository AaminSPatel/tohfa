import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { heroImages, FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default function SeasonalCollection({ content, products }) {
  return (
    <section
      className="section-y w-full max-w-full overflow-hidden"
      aria-labelledby="seasonal-heading"
    >
      <div className="container-page mx-auto grid w-full min-w-0 max-w-full grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Diwali Image */}
        <Reveal className="w-full min-w-0 lg:col-span-6">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-full overflow-hidden rounded-lg bg-marigold-soft sm:aspect-[5/4] lg:aspect-[4/4.4] lg:max-w-none">
            <Image
              src={heroImages.seasonal}
              alt="Brass diyas glowing among marigold petals"
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Diwali Edit Content */}
        <div className="w-full min-w-0 max-w-full lg:col-span-6">
          <h2
            id="seasonal-heading"
            className="break-words text-display-lg [overflow-wrap:anywhere]"
          >
            {content.title}
          </h2>

          <p className="mt-3 max-w-full break-words text-base text-ink-soft sm:mt-4 sm:text-lead">
            {content.text}
          </p>

          <ul className="mt-5 w-full min-w-0 max-w-full divide-y divide-line overflow-hidden border-y border-line sm:mt-8">
            {products.map((p) => (
              <li key={p.slug} className="min-w-0">
                <Link
                  href={`/product/${p.slug}`}
                  className="group flex min-w-0 items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4"
                >
                  {/* Product Image */}
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-sand sm:h-20 sm:w-16">
                    <Image
                      src={p.images?.[0] || FALLBACK_PRODUCT_IMAGE}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 64px, 48px"
                      className="object-cover"
                    />
                  </span>

                  {/* Product Details */}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium group-hover:text-rani sm:text-base">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted sm:text-sm">
                      {p.shortDescription}
                    </span>
                  </span>

                  {/* Price */}
                  <span className="shrink-0 text-right text-sm sm:text-base">
                    <Price price={p.price} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 w-full sm:mt-8 sm:w-auto">
            <Button
              href={content.cta.href}
              size="lg"
              className="w-full sm:w-auto"
            >
              {content.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
