import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/data/categories";

// Editorial, asymmetric placement (desktop). Mobile is a simple 2-column grid.
const layout = [
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-4 aspect-[4/5] md:mt-16",
  "md:col-span-3 aspect-[3/4]",
  "md:col-span-3 aspect-[3/4]",
  "md:col-span-4 aspect-[4/5] md:mt-10",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-6 aspect-[4/3]",
  "md:col-span-6 aspect-[4/3]",
];

export default function CategoryShowcase({ content, counts }) {
  return (
    <section className="section-y overflow-hidden" aria-labelledby="categories-heading">
      <div className="container-page">
        <Reveal><SectionHeading id="categories-heading" title={content.title} intro={content.intro} link={{ label: "See every gift", href: "/shop" }} /></Reveal>
        <ul className="mt-8 sm:mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10 md:grid-cols-12 md:gap-x-7 md:gap-y-12">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={(i % 3) * 0.06} className={`col-span-1 ${layout[i]?.split(" ")[0] || "md:col-span-4"}`}>
              <Link href={`/shop/${c.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded bg-sand ${layout[i]?.split(" ").slice(1).join(" ") || "aspect-[4/5]"}`}>
                  <Image src={c.image} alt={`${c.name}`} fill sizes="(min-width:768px) 40vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
                  <h3 className="font-display text-base sm:text-display-sm transition-colors group-hover:text-rani leading-tight">{c.name}</h3>
                  {counts?.[c.slug] > 0 && <span className="shrink-0 text-xs sm:text-sm text-muted">{counts[c.slug]} gifts</span>}
                </div>
                <p className="mt-1 hidden max-w-xs text-sm text-ink-soft sm:block">{c.description}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
