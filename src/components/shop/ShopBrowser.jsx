"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import ProductCard from "@/components/product/ProductCard";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Checkbox, Select } from "@/components/ui/Form";
import { priceRanges, sortOptions } from "@/data/categories";
import { occasions, getOccasion } from "@/data/occasions";
import { whatsappLink } from "@/lib/utils";

const PAGE = 9;

function Filters({ state, set, reset, hasFilters }) {
  const legend = "mb-3 font-display text-lg";
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className={legend}>Price</legend>
        <div className="space-y-2.5">
          {priceRanges.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="radio" name="price" checked={state.price === r.id} onChange={() => set({ price: r.id })} className="h-4 w-4 accent-[rgb(var(--c-rani))]" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={legend}>Occasion</legend>
        <div className="space-y-2.5">
          {occasions.map((o) => (
            <Checkbox key={o.slug} id={`occ-${o.slug}`} label={o.label} checked={state.occasion === o.slug} onChange={(e) => set({ occasion: e.target.checked ? o.slug : "" })} />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={legend}>Availability</legend>
        <Checkbox id="in-stock" label="In stock only" checked={state.inStock} onChange={(e) => set({ inStock: e.target.checked })} />
      </fieldset>
      {hasFilters && <button onClick={reset} className="text-sm font-medium text-rani underline underline-offset-4">Clear all filters</button>}
    </div>
  );
}

export default function ShopBrowser({ products, categoryName }) {
  const params = useSearchParams();
  const [state, setState] = useState({
    q: params.get("q") || "",
    sort: sortOptions.some((s) => s.id === params.get("sort")) ? params.get("sort") : "featured",
    price: priceRanges.some((r) => r.id === params.get("price")) ? params.get("price") : "all",
    occasion: getOccasion(params.get("occasion") || "") ? params.get("occasion") : "",
    inStock: params.get("stock") === "1",
  });
  const [visible, setVisible] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  const set = (patch) => { setState((s) => ({ ...s, ...patch })); setVisible(PAGE); };
  const reset = () => { setState({ q: "", sort: "featured", price: "all", occasion: "", inStock: false }); setVisible(PAGE); };

  // Keep the URL shareable without triggering navigation
  useEffect(() => {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.sort !== "featured") p.set("sort", state.sort);
    if (state.price !== "all") p.set("price", state.price);
    if (state.occasion) p.set("occasion", state.occasion);
    if (state.inStock) p.set("stock", "1");
    const qs = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [state]);

  const results = useMemo(() => {
    const range = priceRanges.find((r) => r.id === state.price) || priceRanges[0];
    const q = state.q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (p.price < range.min || p.price > range.max) return false;
      if (state.occasion && !p.occasion?.includes(state.occasion)) return false;
      if (state.inStock && p.stock <= 0) return false;
      if (q) {
        const hay = `${p.name} ${p.shortDescription} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const by = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller),
      bestsellers: (a, b) => Number(b.bestseller) - Number(a.bestseller) || b.reviewCount - a.reviewCount,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    }[state.sort];
    list = [...list].sort(by);
    // sold-out items sink to the bottom unless sorting by price
    return state.sort.startsWith("price") ? list : [...list.filter((p) => p.stock > 0), ...list.filter((p) => p.stock <= 0)];
  }, [products, state]);

  const hasFilters = state.q || state.price !== "all" || state.occasion || state.inStock;
  const shown = results.slice(0, visible);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-28"><Filters state={state} set={set} reset={reset} hasFilters={hasFilters} /></div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <label htmlFor="shop-search" className="sr-only">Search gifts</label>
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input id="shop-search" type="search" value={state.q} onChange={(e) => set({ q: e.target.value })} placeholder={categoryName ? `Search ${categoryName.toLowerCase()}` : "Search gifts, e.g. frame, candle, hamper"}
              className="h-12 w-full rounded border border-ink/25 bg-white pl-10 pr-3 text-base placeholder:text-muted/70 hover:border-ink/50 focus:border-rani focus:outline-none focus:ring-2 focus:ring-rani/25" />
          </div>
          <Button variant="outline" onClick={() => setSheet(true)} className="lg:hidden"><FiSliders aria-hidden="true" /> Filters{hasFilters ? " (on)" : ""}</Button>
          <div className="w-full sm:w-52">
            <label htmlFor="shop-sort" className="sr-only">Sort by</label>
            <Select id="shop-sort" value={state.sort} onChange={(e) => set({ sort: e.target.value })}>
              {sortOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft" aria-live="polite">
          <span>{results.length} {results.length === 1 ? "gift" : "gifts"}</span>
          {state.occasion && <button onClick={() => set({ occasion: "" })} className="inline-flex items-center gap-1 underline underline-offset-4">{getOccasion(state.occasion).label} <FiX aria-label="Remove occasion filter" /></button>}
          {state.price !== "all" && <button onClick={() => set({ price: "all" })} className="inline-flex items-center gap-1 underline underline-offset-4">{priceRanges.find((r) => r.id === state.price)?.label} <FiX aria-label="Remove price filter" /></button>}
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={26} />}
            title={products.length === 0 ? "No gifts here yet" : "Nothing matches that"}
            text={products.length === 0 ? "We're restocking this shelf. Message us and we'll find you something." : "Try a different word, or clear a filter. Or tell us who it's for and we'll suggest something."}
            action={hasFilters ? { label: "Clear filters", onClick: reset } : { label: "Browse all gifts", href: "/shop" }}
            secondary={{ label: "Ask on WhatsApp", href: whatsappLink("Hi! I couldn't find a gift on the website. Can you help?"), external: true }}
          />
        ) : (
          <>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
              {shown.map((p, i) => <li key={p.slug}><ProductCard product={p} priority={i < 3} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" /></li>)}
            </ul>
            <div className="mt-14 text-center">
              <p className="text-sm text-muted">Showing {shown.length} of {results.length}</p>
              {visible < results.length && <Button variant="outline" size="lg" className="mt-4" onClick={() => setVisible((v) => v + PAGE)}>Show more gifts</Button>}
            </div>
          </>
        )}
      </div>

      <Drawer open={sheet} onClose={() => setSheet(false)} title="Filters" side="bottom"
        footer={<Button onClick={() => setSheet(false)} className="w-full" size="lg">Show {results.length} {results.length === 1 ? "gift" : "gifts"}</Button>}>
        <div className="px-5 py-6"><Filters state={state} set={set} reset={reset} hasFilters={hasFilters} /></div>
      </Drawer>
    </div>
  );
}
