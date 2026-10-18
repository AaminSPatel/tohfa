import { FaWhatsapp } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/utils";
import { hinglish } from "@/data/hinglish";

export default function FinalCta({ content }) {
  return (
    <section className="section-y" aria-labelledby="final-cta-heading">
      <div className="container-page">
        <div className="grid items-center gap-8 border-y border-ink/20 py-14 sm:py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="final-cta-heading" className="text-display-lg">{content.title}</h2>
            <p className="mt-4 max-w-xl text-lead text-ink-soft">{content.text}</p>
            {hinglish.finalCta && <p className="mt-2 max-w-xl text-ink-soft">{hinglish.finalCta}</p>}
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button href={content.primary.href} size="lg">{content.primary.label}</Button>
            <Button href={whatsappLink(content.whatsapp.message)} external variant="outline" size="lg"><FaWhatsapp size={19} aria-hidden="true" /> {content.whatsapp.label}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
