import { FiEdit3, FiPackage, FiTruck, FiHeart } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const icons = { edit: FiEdit3, package: FiPackage, truck: FiTruck, heart: FiHeart };

/** Editorial list on hairlines, deliberately not a row of cards. */
export default function WhyUs({ content }) {
  return (
    <section className="section-y" aria-labelledby="why-heading">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal><SectionHeading id="why-heading" title={content.title} /></Reveal>
        </div>
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {content.points.map((p, i) => {
            const Icon = icons[p.icon] || FiHeart;
            return (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <Icon size={26} className="text-rani" aria-hidden="true" />
                <div>
                  <h3 className="text-display-sm">{p.title}</h3>
                  <p className="mt-2 max-w-lg text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
