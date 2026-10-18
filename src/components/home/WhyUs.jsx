import { FiEdit3, FiPackage, FiTruck, FiHeart } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const icons = { edit: FiEdit3, package: FiPackage, truck: FiTruck, heart: FiHeart };

/** Editorial list on hairlines, deliberately not a row of cards. */
export default function WhyUs({ content }) {
  return (
    <section className="section-y overflow-hidden" aria-labelledby="why-heading">
      <div className="container-page grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 w-full">
        <div className="w-full min-w-0 lg:col-span-5">
          <Reveal><SectionHeading id="why-heading" title={content.title} /></Reveal>
        </div>
        <ul className="divide-y divide-line border-y border-line w-full min-w-0 lg:col-span-7">
          {content.points.map((p, i) => {
            const Icon = icons[p.icon] || FiHeart;
            return (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr] gap-3 sm:gap-6 py-5 sm:py-7">
                <Icon size={24} className="mt-0.5 text-rani" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="font-display text-base sm:text-display-sm">{p.title}</h3>
                  <p className="mt-1.5 sm:mt-2 max-w-lg text-sm sm:text-base text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
