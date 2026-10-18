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
    <section className="pb-16 pt-4 sm:pb-24 lg:pb-32" aria-labelledby="shop-heading">
      <div className="container-page">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded bg-sand sm:aspect-[16/8] lg:aspect-[21/9]">
            <Image src={shopImage} alt={content.imageAlt} fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
          </div>
          <div className="relative -mt-12 ml-4 mr-4 bg-paper p-6 shadow-lift sm:-mt-20 sm:ml-8 sm:max-w-md sm:p-8 lg:absolute lg:-bottom-12 lg:left-10 lg:mr-0 lg:mt-0 lg:max-w-[27rem]">
            <h2 id="shop-heading" className="text-display-md">{content.heading}</h2>
            <p className="mt-3 text-ink-soft">{content.text}</p>
            {content.hinglish && <p className="mt-2 text-ink">{content.hinglish}</p>}
            <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink-soft">
              <li className="flex gap-3"><FiMapPin className="mt-0.5 shrink-0 text-rani" aria-hidden="true" />{formatAddress(contact)}</li>
              <li className="flex gap-3"><FiClock className="mt-0.5 shrink-0 text-rani" aria-hidden="true" /><span>{hours.map((h) => <span key={h.label} className="block">{h.label}: {h.value}</span>)}</span></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href={contact.googleMapsUrl} external><FiNavigation aria-hidden="true" /> {content.directionsLabel}</Button>
              <Button href={telLink()} variant="outline"><FiPhone aria-hidden="true" /> {content.callLabel}</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
