import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import FinalCta from "@/components/home/FinalCta";
import { aboutContent as a } from "@/data/pageContent";
import { homeContent } from "@/data/homeContent";
import { heroImages } from "@/data/images";
import { siteConfig } from "@/data/siteConfig";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About us",
  description: `The story of ${siteConfig.brandName}: a small Ujjain gifting studio that personalises, packs and delivers gifts across India.`,
  path: "/about",
});

export default function AboutPage() {
  const crumbs = [{ name: "Home", href: "/" }, { name: "About", href: "/about" }];
  return (
    <>
      <div className="container-page pt-8 sm:pt-10"><Breadcrumbs items={crumbs} /></div>
      <section className="container-page grid items-end gap-10 pb-16 pt-8 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-7">
          <h1 className="text-display-xl">{a.headline}</h1>
          <p className="mt-6 max-w-xl text-lead text-ink-soft">{a.lead}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded bg-blush lg:col-span-5">
          <Image src={heroImages.story} alt="A hamper, a framed photo and a gift box arranged together" fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 text-lead text-ink-soft lg:col-span-6 lg:col-start-2">
            {a.story.map((p, i) => <Reveal key={i}><p>{p}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-sand/60 py-16 sm:py-24" aria-labelledby="values-h">
        <div className="container-page">
          <h2 id="values-h" className="text-display-lg">How we work</h2>
          <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-3">
            {a.values.map((v) => (
              <li key={v.title} className="border-t-2 border-rani pt-4">
                <h3 className="text-display-sm">{v.title}</h3>
                <p className="mt-2 text-ink-soft">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="process-h">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <h2 id="process-h" className="text-display-lg lg:col-span-4">From your order to their doorstep</h2>
          {/* A real sequence, so numbering is meaningful here */}
          <ol className="divide-y divide-line border-y border-line lg:col-span-8">
            {a.process.map((s, i) => (
              <li key={s.title} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr]">
                <span className="font-display text-3xl text-rani" aria-hidden="true">{i + 1}</span>
                <div><h3 className="text-display-sm">{s.title}</h3><p className="mt-1 text-ink-soft">{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FinalCta content={homeContent.finalCta} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
