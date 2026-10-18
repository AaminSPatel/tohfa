"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiMenu, FiShoppingBag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/components/cart/CartProvider";
import { siteConfig } from "@/data/siteConfig";
import { categories } from "@/data/categories";
import { cn, whatsappLink } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef(null);
  const { main, cta } = siteConfig.navigation;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setCatsOpen(false); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!catsOpen) return;
    const onDown = (e) => { if (!catsRef.current?.contains(e.target)) setCatsOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setCatsOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [catsOpen]);

  const linkCls = (href) => cn("relative py-2 text-[0.95rem] transition-colors hover:text-rani", pathname === href || (href !== "/" && pathname.startsWith(href)) ? "text-rani" : "text-ink");

  return (
    <header className={cn("sticky top-0 z-40 bg-paper transition-shadow duration-300", scrolled && "shadow-[0_1px_0_rgb(var(--c-line))]")}>
      <div className="container-page flex h-[68px] items-center gap-6">
        <button className="-ml-2 grid h-11 w-11 place-items-center rounded hover:bg-ink/5 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><FiMenu size={22} /></button>
        <Logo className="max-lg:mr-auto max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" />

        <nav aria-label="Main" className="ml-8 hidden items-center gap-8 lg:flex">
          <Link href={main[0].href} className={linkCls(main[0].href)}>{main[0].label}</Link>
          <div className="relative" ref={catsRef} onMouseEnter={() => setCatsOpen(true)} onMouseLeave={() => setCatsOpen(false)}>
            <button className="flex items-center gap-1 py-2 text-[0.95rem] transition-colors hover:text-rani" aria-expanded={catsOpen} aria-controls="categories-menu" onClick={() => setCatsOpen((v) => !v)}>
              Categories <FiChevronDown size={15} className={cn("transition-transform duration-200", catsOpen && "rotate-180")} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {catsOpen && (
                <motion.div
                  key="cats" id="categories-menu"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-2"
                >
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-line bg-paper p-4 shadow-lift">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/shop/${c.slug}`} className="block rounded px-3 py-2.5 transition-colors hover:bg-blush">
                          <span className="block font-medium">{c.name}</span>
                          <span className="block text-sm text-muted">{c.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {main.slice(1).map((l) => <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>)}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button href={whatsappLink(cta.whatsappMessage)} external variant="outline" size="sm" className="hidden xl:inline-flex">
            <FaWhatsapp size={16} aria-hidden="true" /> {cta.label}
          </Button>
          <button onClick={openDrawer} className="relative grid h-11 w-11 place-items-center rounded hover:bg-ink/5" aria-label={`Open cart, ${hydrated ? count : 0} items`}>
            <FiShoppingBag size={22} />
            {hydrated && count > 0 && (
              <motion.span key={count} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rani px-1 text-[11px] font-semibold text-white">
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
