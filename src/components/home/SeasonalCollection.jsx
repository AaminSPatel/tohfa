import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { heroImages } from "@/data/images";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default function SeasonalCollection({ content, products }) {
  return (
    <section className="section-y" aria-labelledby="seasonal-heading">
      <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[5/4] overflow-hidden rounded bg-marigold-soft lg:aspect-[4/4.4]">
            <Image src={heroImages.seasonal} alt="Brass diyas glowing among marigold petals" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <h2 id="seasonal-heading" className="text-display-lg">{content.title}</h2>
          <p className="mt-4 max-w-lg text-lead text-ink-soft">{content.text}</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="group flex items-center gap-4 py-4">
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-sand">
                    <Image src={p.images?.[0] || FALLBACK_PRODUCT_IMAGE} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium group-hover:text-rani">{p.name}</span>
                    <span className="block truncate text-sm text-muted">{p.shortDescription}</span>
                  </span>
                  <Price price={p.price} />
                </Link>
              </li>
            ))}
          </ul>
          <Button href={content.cta.href} size="lg" className="mt-8">{content.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
