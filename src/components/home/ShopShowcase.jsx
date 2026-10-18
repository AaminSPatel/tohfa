import Image from "next/image";
import { FiClock, FiMapPin, FiNavigation, FiPhone } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { shopImage } from "@/data/images";
import { siteConfig } from "@/data/siteConfig";
import { formatAddress, telLink } from "@/lib/utils";

/** Shop photo with an overlapping text card. Edit the words in homeContent.shop, the photo in data/images.js. */
export default function ShopShowcase({ content }) {
  const { contact, hours } = siteConfig;
  return (
    <section className="pb-12 pt-2 sm:pb-24 lg:pb-32 overflow-hidden" aria-labelledby="shop-heading">
      <div className="container-page">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded bg-sand sm:aspect-[16/8] lg:aspect-[21/9]">
            <Image src={shopImage} alt={content.imageAlt} fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
          </div>
          <div className="relative -mt-8 sm:-mt-20 mx-1 sm:mx-0 sm:ml-8 sm:max-w-md bg-paper p-5 sm:p-8 rounded-lg shadow-lift lg:absolute lg:-bottom-12 lg:left-10 lg:mr-0 lg:mt-0 lg:max-w-[27rem]">
            <h2 id="shop-heading" className="text-display-md">{content.heading}</h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-ink-soft">{content.text}</p>
            {content.hinglish && <p className="mt-2 text-sm sm:text-base text-ink">{content.hinglish}</p>}
            <ul className="mt-4 sm:mt-5 space-y-2 border-t border-line pt-3 sm:pt-4 text-xs sm:text-sm text-ink-soft">
              <li className="flex gap-2.5 sm:gap-3"><FiMapPin className="mt-0.5 shrink-0 text-rani" aria-hidden="true" /><span className="min-w-0">{formatAddress(contact)}</span></li>
              <li className="flex gap-2.5 sm:gap-3"><FiClock className="mt-0.5 shrink-0 text-rani" aria-hidden="true" /><span className="min-w-0">{hours.map((h) => <span key={h.label} className="block">{h.label}: {h.value}</span>)}</span></li>
            </ul>
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
              <Button href={contact.googleMapsUrl} external className="w-full sm:w-auto"><FiNavigation aria-hidden="true" /> {content.directionsLabel}</Button>
              <Button href={telLink()} variant="outline" className="w-full sm:w-auto"><FiPhone aria-hidden="true" /> {content.callLabel}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
