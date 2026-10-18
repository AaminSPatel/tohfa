"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPackage, FiShoppingBag, FiMessageSquare, FiAlertCircle, FiSettings, FiMenu, FiX, FiExternalLink } from "react-icons/fi";
import { TagMark } from "@/components/ui/Logo";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { href: "/admin/products", label: "Products", icon: FiPackage },
  { href: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: FiMessageSquare },
  { href: "/admin/users-problems", label: "Customer problems", icon: FiAlertCircle },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
      {nav.map(({ href, label, icon: Icon, exact }) => {
        const on = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={on ? "page" : undefined}
            className={cn("flex items-center gap-3 rounded px-3 py-2.5 text-[0.95rem] transition-colors", on ? "bg-paper text-ink" : "text-paper/75 hover:bg-paper/10 hover:text-paper")}>
            <Icon size={18} aria-hidden="true" />{label}
          </Link>
        );
      })}
      <Link href="/" target="_blank" className="mt-4 flex items-center gap-3 rounded px-3 py-2.5 text-sm text-paper/60 hover:text-paper"><FiExternalLink size={16} aria-hidden="true" />View storefront</Link>
    </nav>
  );
  return (
    <>
      <div className="flex items-center justify-between bg-ink px-4 py-3 text-paper lg:hidden">
        <span className="flex items-center gap-2 font-display text-lg"><TagMark className="h-5 w-4 text-marigold" />{siteConfig.brandName} admin</span>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle admin menu" className="grid h-10 w-10 place-items-center">{open ? <FiX size={22} /> : <FiMenu size={22} />}</button>
      </div>
      {open && <div className="bg-ink text-paper lg:hidden">{links}</div>}
      <aside className="hidden w-64 shrink-0 bg-ink text-paper lg:block">
        <div className="sticky top-0">
          <div className="flex items-center gap-2.5 px-6 py-6 font-display text-xl"><TagMark className="h-6 w-5 text-marigold" />{siteConfig.brandName}<span className="ml-1 text-xs text-paper/50">admin</span></div>
          {links}
        </div>
      </aside>
    </>
  );
}
