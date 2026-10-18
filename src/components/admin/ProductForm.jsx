"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { Checkbox, Field, FormAlert, Input, Select, Textarea } from "@/components/ui/Form";
import { Panel } from "./ui";
import ProductImages from "./ProductImages";
import { categories } from "@/data/categories";
import { occasions } from "@/data/occasions";
import { slugify } from "@/lib/utils";

const blank = {
  name: "", slug: "", shortDescription: "", description: "", price: "", compareAtPrice: "", stock: 0, categorySlug: categories[0].slug,
  images: [], tags: "", occasion: [], featured: false, bestseller: false, active: true, rating: 0, reviewCount: 0,
  personalisation: { enabled: false, label: "", placeholder: "", maxLength: 40, required: true },
  specifications: [{ label: "", value: "" }], seoTitle: "", seoDescription: "",
};

function fromProduct(p) {
  return {
    ...blank, ...p,
    compareAtPrice: p.compareAtPrice ?? "",
    images: p.images || [],
    tags: (p.tags || []).join(", "),
    occasion: p.occasion || [],
    personalisation: p.personalisation ? { enabled: true, ...p.personalisation } : blank.personalisation,
    specifications: p.specifications?.length ? p.specifications : blank.specifications,
  };
}

export default function ProductForm({ product, cloudinaryReady = false }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [v, setV] = useState(editing ? fromProduct(product) : blank);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const sessionUploads = useRef(new Set()); // uploaded in this session, not saved yet

  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })); };
  const bind = (k) => ({ value: v[k] ?? "", error: errors[k], onChange: (e) => set(k, e.target.value) });
  const pers = (k, val) => setV((s) => ({ ...s, personalisation: { ...s.personalisation, [k]: val } }));
  const setSpec = (i, k, val) => setV((s) => ({ ...s, specifications: s.specifications.map((x, j) => (j === i ? { ...x, [k]: val } : x)) }));

  async function cancel() {
    // photos uploaded in this session but never saved would be orphaned on Cloudinary: delete them
    await Promise.all([...sessionUploads.current].map((url) => fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }).catch(() => {})));
    router.push("/admin/products");
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = await fetch(editing ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v),
    });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok || !data?.ok) {
      if (data?.errors) { setErrors(data.errors); document.getElementById(Object.keys(data.errors)[0])?.focus(); }
      return setMsg({ tone: "error", text: data?.message || "Couldn't save the product." });
    }
    sessionUploads.current.clear(); // everything is saved now
    if (editing) {
      const n = data.imagesDeleted || 0;
      setMsg({ tone: "success", text: `Saved. The shop will update within a minute.${n ? ` ${n} old photo${n > 1 ? "s were" : " was"} deleted from Cloudinary.` : ""}${data.imagesFailedToDelete ? " Some old photos couldn't be deleted from Cloudinary; remove them from your Cloudinary dashboard." : ""}` });
      router.refresh();
    } else router.push("/admin/products");
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormAlert tone={msg?.tone}>{msg?.text}</FormAlert>

      <Panel title="Basics">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Product name" required error={errors.name} className="sm:col-span-2">
            <Input id="name" value={v.name} error={errors.name} onChange={(e) => { set("name", e.target.value); if (!slugTouched) setV((s) => ({ ...s, name: e.target.value, slug: slugify(e.target.value) })); }} />
          </Field>
          <Field id="slug" label="URL slug" required error={errors.slug} hint={`/product/${v.slug || "your-slug"}`}><Input id="slug" {...bind("slug")} hint="x" onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></Field>
          <Field id="categorySlug" label="Category" required error={errors.categorySlug}>
            <Select id="categorySlug" {...bind("categorySlug")}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</Select>
          </Field>
          <Field id="shortDescription" label="Short description" className="sm:col-span-2" hint="Shown on cards and under the title."><Textarea id="shortDescription" rows={2} maxLength={220} {...bind("shortDescription")} hint="x" /></Field>
          <Field id="description" label="Full description" className="sm:col-span-2" hint="Separate paragraphs with a blank line."><Textarea id="description" rows={7} {...bind("description")} hint="x" /></Field>
        </div>
      </Panel>

      <Panel title="Price and stock">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="price" label="Price (₹)" required error={errors.price}><Input id="price" type="number" min="0" step="1" inputMode="numeric" {...bind("price")} /></Field>
          <Field id="compareAtPrice" label="Compare-at price (₹)" error={errors.compareAtPrice} hint="Crossed-out price. Optional."><Input id="compareAtPrice" type="number" min="0" step="1" {...bind("compareAtPrice")} hint="x" /></Field>
          <Field id="stock" label="Stock"><Input id="stock" type="number" min="0" step="1" {...bind("stock")} /></Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <Checkbox id="featured" label="Featured" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} />
          <Checkbox id="bestseller" label="Bestseller" checked={v.bestseller} onChange={(e) => set("bestseller", e.target.checked)} />
          <Checkbox id="active" label="Visible in shop" checked={v.active} onChange={(e) => set("active", e.target.checked)} />
        </div>
      </Panel>

      <Panel title="Photos">
        <ProductImages images={v.images} onChange={(imgs) => set("images", imgs)} ready={cloudinaryReady} sessionUploads={sessionUploads} />
      </Panel>

      <Panel title="Discovery">
        <Field id="tags" label="Tags" hint="Comma separated. Used by shop search."><Input id="tags" {...bind("tags")} hint="x" /></Field>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium">Occasions</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {occasions.map((o) => (
              <Checkbox key={o.slug} id={`occ-${o.slug}`} label={o.label} checked={v.occasion.includes(o.slug)}
                onChange={(e) => set("occasion", e.target.checked ? [...v.occasion, o.slug] : v.occasion.filter((x) => x !== o.slug))} />
            ))}
          </div>
        </fieldset>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id="rating" label="Rating (0 to 5)"><Input id="rating" type="number" min="0" max="5" step="0.1" {...bind("rating")} /></Field>
          <Field id="reviewCount" label="Review count"><Input id="reviewCount" type="number" min="0" {...bind("reviewCount")} /></Field>
        </div>
      </Panel>

      <Panel title="Personalisation">
        <Checkbox id="pers-on" label="This gift can be personalised (shows a text box on the product page)" checked={v.personalisation.enabled} onChange={(e) => pers("enabled", e.target.checked)} />
        {v.personalisation.enabled && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id="pers-label" label="Label"><Input id="pers-label" value={v.personalisation.label} onChange={(e) => pers("label", e.target.value)} placeholder="Name to engrave" /></Field>
            <Field id="pers-ph" label="Example text"><Input id="pers-ph" value={v.personalisation.placeholder} onChange={(e) => pers("placeholder", e.target.value)} placeholder="Aman + Riya" /></Field>
            <Field id="pers-max" label="Max characters"><Input id="pers-max" type="number" min="1" max="120" value={v.personalisation.maxLength} onChange={(e) => pers("maxLength", e.target.value)} /></Field>
            <div className="self-end pb-3"><Checkbox id="pers-req" label="Customer must fill this in" checked={v.personalisation.required} onChange={(e) => pers("required", e.target.checked)} /></div>
          </div>
        )}
      </Panel>

      <Panel title="Specifications">
        <div className="space-y-3">
          {v.specifications.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-center gap-3">
              <Input aria-label={`Specification ${i + 1} name`} placeholder="Size" value={s.label} onChange={(e) => setSpec(i, "label", e.target.value)} />
              <Input aria-label={`Specification ${i + 1} value`} placeholder="8 x 10 in" value={s.value} onChange={(e) => setSpec(i, "value", e.target.value)} />
              <button type="button" aria-label={`Remove specification ${i + 1}`} onClick={() => setV((x) => ({ ...x, specifications: x.specifications.filter((_, j) => j !== i) }))} className="grid h-10 w-10 place-items-center rounded hover:bg-ink/5"><FiX /></button>
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => setV((x) => ({ ...x, specifications: [...x.specifications, { label: "", value: "" }] }))}><FiPlus aria-hidden="true" /> Add a row</Button>
      </Panel>

      <Panel title="Search engine listing">
        <div className="space-y-5">
          <Field id="seoTitle" label="SEO title" hint={`${(v.seoTitle || "").length}/70. Leave blank to use the product name.`}><Input id="seoTitle" maxLength={70} {...bind("seoTitle")} hint="x" /></Field>
          <Field id="seoDescription" label="SEO description" hint={`${(v.seoDescription || "").length}/170. Leave blank to use the short description.`}><Textarea id="seoDescription" rows={2} maxLength={170} {...bind("seoDescription")} hint="x" /></Field>
        </div>
      </Panel>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-end gap-3 border-t border-line bg-sand/90 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8">
        <Button type="button" variant="ghost" onClick={cancel}>Cancel</Button>
        <Button type="submit" size="lg" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create product"}</Button>
      </div>
    </form>
  );
}
