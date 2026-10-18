import { FaWhatsapp } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/utils";
import { hinglish } from "@/data/hinglish";

export default function FinalCta({ content }) {
  return (
    <section className="section-y overflow-hidden" aria-labelledby="final-cta-heading">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 border-y border-ink/20 py-10 sm:py-16 lg:grid-cols-12 w-full">
          <div className="w-full min-w-0 lg:col-span-7">
            <h2 id="final-cta-heading" className="text-display-lg break-words">{content.title}</h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-base sm:text-lead text-ink-soft">{content.text}</p>
            {hinglish.finalCta && <p className="mt-2 max-w-xl text-sm sm:text-base text-ink-soft">{hinglish.finalCta}</p>}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto lg:col-span-5 lg:justify-end">
            <Button href={content.primary.href} size="lg" className="w-full sm:w-auto">{content.primary.label}</Button>
            <Button href={whatsappLink(content.whatsapp.message)} external variant="outline" size="lg" className="w-full sm:w-auto"><FaWhatsapp size={19} aria-hidden="true" /> {content.whatsapp.label}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
