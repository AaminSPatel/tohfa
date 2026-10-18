import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Button from "@/components/ui/Button";
import { InquiryForm, SupportForm } from "@/components/layout/ContactForms";
import { contactContent as c } from "@/data/pageContent";
import { siteConfig } from "@/data/siteConfig";
import { hinglish } from "@/data/hinglish";
import { breadcrumbLd, buildMetadata, localBusinessLd } from "@/lib/seo";
import { formatAddress, telLink, whatsappLink } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Contact us",
  description: `Message ${siteConfig.brandName} on WhatsApp, call us or visit our studio in ${siteConfig.contact.city}. Report a problem with an order.`,
  path: "/contact",
});

export default function ContactPage() {
  const { contact, hours } = siteConfig;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }];
  return (
    <div className="container-page pb-24 pt-8 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 max-w-2xl">
        <h1 className="text-display-xl">{c.headline}</h1>
        <p className="mt-5 text-lead text-ink-soft">{c.lead}</p>
        {hinglish.contactLead && <p className="mt-2 text-ink-soft">{hinglish.contactLead}</p>}
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Button href={whatsappLink("Hi! I'd like some help with a gift.")} external size="lg" className="w-full sm:w-auto"><FaWhatsapp size={19} aria-hidden="true" /> Chat on WhatsApp</Button>
          <p className="mt-3 text-sm text-muted">{siteConfig.responseTime}</p>
          <address className="mt-10 space-y-6 not-italic">
            <p className="flex gap-4"><FiMapPin className="mt-1 shrink-0 text-rani" aria-hidden="true" /><span><span className="block font-medium">Studio</span><a href={contact.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-ink-soft underline-offset-4 hover:underline">{formatAddress(contact)}</a></span></p>
            <p className="flex gap-4"><FiPhone className="mt-1 shrink-0 text-rani" aria-hidden="true" /><span><span className="block font-medium">Phone</span><a href={telLink()} className="text-ink-soft hover:underline">{contact.phone}</a></span></p>
            <p className="flex gap-4"><FiMail className="mt-1 shrink-0 text-rani" aria-hidden="true" /><span><span className="block font-medium">Email</span><a href={`mailto:${contact.email}`} className="break-all text-ink-soft hover:underline">{contact.email}</a></span></p>
            <div className="flex gap-4"><FiClock className="mt-1 shrink-0 text-rani" aria-hidden="true" /><div><span className="block font-medium">Studio hours</span><ul className="text-ink-soft">{hours.map((h) => <li key={h.label}>{h.label}: {h.value}</li>)}</ul></div></div>
          </address>
        </div>

        <div className="space-y-16 lg:col-span-7">
          <section aria-labelledby="enquiry-h">
            <h2 id="enquiry-h" className="text-display-md">{c.enquiryTitle}</h2>
            <div className="mt-6"><InquiryForm /></div>
          </section>
          <section id="report-a-problem" className="scroll-mt-28 border-t border-line pt-12" aria-labelledby="problem-h">
            <h2 id="problem-h" className="text-display-md">{c.problemTitle}</h2>
            <p className="mt-2 max-w-lg text-ink-soft">{c.problemLead}</p>
            <div className="mt-6"><SupportForm /></div>
          </section>
        </div>
      </div>
      <JsonLd data={[breadcrumbLd(crumbs), localBusinessLd()]} />
    </div>
  );
}
