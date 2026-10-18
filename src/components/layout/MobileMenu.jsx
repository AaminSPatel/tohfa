"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/siteConfig";
import { categories } from "@/data/categories";
import { whatsappLink, telLink } from "@/lib/utils";

export default function MobileMenu({ open, onClose }) {
  const { main, cta } = siteConfig.navigation;
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left"
      footer={
        <div className="space-y-3">
          <Button href={whatsappLink(cta.whatsappMessage)} external className="w-full" variant="primary"><FaWhatsapp size={18} aria-hidden="true" /> {cta.label}</Button>
          <p className="text-center text-sm text-muted">Or call <a href={telLink()} className="underline underline-offset-4">{siteConfig.contact.phone}</a></p>
        </div>
      }>
      <nav aria-label="Mobile" className="px-5 py-4">
        <ul className="divide-y divide-line">
          {main.map((l) => (
            <li key={l.href}><Link href={l.href} onClick={onClose} className="block py-4 font-display text-[1.6rem]">{l.label}</Link></li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-medium text-muted">Shop by category</p>
        <ul className="mt-2">
          {categories.map((c) => (
            <li key={c.slug}><Link href={`/shop/${c.slug}`} onClick={onClose} className="block py-2.5 text-ink-soft hover:text-rani">{c.name}</Link></li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
