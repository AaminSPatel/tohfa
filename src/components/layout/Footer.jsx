import Link from "next/link";
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP, FaWhatsapp } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import { siteConfig } from "@/data/siteConfig";
import { hinglish } from "@/data/hinglish";
import { categories } from "@/data/categories";
import { formatAddress, telLink, whatsappLink } from "@/lib/utils";

const socials = [
  { key: "instagram", icon: FaInstagram, label: "Instagram" },
  { key: "facebook", icon: FaFacebookF, label: "Facebook" },
  { key: "youtube", icon: FaYoutube, label: "YouTube" },
  { key: "pinterest", icon: FaPinterestP, label: "Pinterest" },
];

export default function Footer() {
  const { contact, footer, social, hours } = siteConfig;
  const h = "mb-4 font-display text-lg text-paper";
  const link = "text-paper/70 transition-colors hover:text-marigold";
  return (
    <footer className="bg-ink text-paper">
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-paper/70">{footer.blurb}</p>
          {hinglish.footer && <p className="mt-2 max-w-xs text-paper/70">{hinglish.footer}</p>}
          <ul className="mt-6 flex gap-2">
            {socials.filter((s) => social[s.key]).map(({ key, icon: Icon, label }) => (
              <li key={key}>
                <a href={social[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-paper/25 transition-colors hover:border-marigold hover:text-marigold">
                  <Icon size={16} />
                </a>
              </li>
            ))}
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-paper/25 transition-colors hover:border-marigold hover:text-marigold"><FaWhatsapp size={17} /></a>
            </li>
          </ul>
        </div>

        <nav aria-label="Shop categories" className="lg:col-span-3">
          <h2 className={h}>Shop</h2>
          <ul className="space-y-2.5">
            {categories.map((c) => <li key={c.slug}><Link href={`/shop/${c.slug}`} className={link}>{c.name}</Link></li>)}
          </ul>
        </nav>

        <nav aria-label="Help" className="lg:col-span-2">
          <h2 className={h}>Help</h2>
          <ul className="space-y-2.5">
            <li><Link href="/about" className={link}>About us</Link></li>
            <li><Link href="/contact" className={link}>Contact</Link></li>
            {footer.help.map((l) => <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>)}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={h}>Visit or write to us</h2>
          <address className="space-y-3 not-italic text-paper/70">
            <p className="flex gap-3"><FiMapPin className="mt-1 shrink-0 text-marigold" aria-hidden="true" /><a href={contact.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-marigold">{formatAddress(contact)}</a></p>
            <p className="flex gap-3"><FiPhone className="mt-1 shrink-0 text-marigold" aria-hidden="true" /><a href={telLink()} className="hover:text-marigold">{contact.phone}</a></p>
            <p className="flex gap-3"><FiMail className="mt-1 shrink-0 text-marigold" aria-hidden="true" /><a href={`mailto:${contact.email}`} className="break-all hover:text-marigold">{contact.email}</a></p>
            <div className="flex gap-3"><FiClock className="mt-1 shrink-0 text-marigold" aria-hidden="true" />
              <ul>{hours.map((x) => <li key={x.label}>{x.label}: {x.value}</li>)}</ul>
            </div>
          </address>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-paper/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p>{footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
