import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { DataTable, PageHeader, StatusBadge } from "@/components/admin/ui";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { listProducts } from "@/lib/adminData";
import { formatPrice } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/images";

export default async function AdminProducts() {
  const products = await listProducts();
  return (
    <>
      <PageHeader title="Products" text={`${products.length} in your shop`} actions={<Button href="/admin/products/new"><FiPlus aria-hidden="true" /> Add product</Button>} />
      <DataTable caption="Products" empty="No products yet. Add one, or import the starter catalogue from Settings." rows={products} columns={[
        { key: "name", label: "Product", render: (p) => (
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-sand"><Image src={p.images?.[0] || FALLBACK_PRODUCT_IMAGE} alt="" fill sizes="44px" className="object-cover" /></span>
            <span><Link href={`/admin/products/${p.id}`} className="font-medium underline-offset-4 hover:underline">{p.name}</Link><span className="block text-xs text-muted">/{p.slug}</span></span>
          </div>) },
        { key: "category", label: "Category" },
        { key: "price", label: "Price", render: (p) => formatPrice(p.price) },
        { key: "stock", label: "Stock", render: (p) => <span className={p.stock === 0 ? "font-medium text-rani" : ""}>{p.stock}</span> },
        { key: "flags", label: "Flags", render: (p) => <span className="text-ink-soft">{[p.featured && "Featured", p.bestseller && "Bestseller"].filter(Boolean).join(", ") || "None"}</span> },
        { key: "active", label: "Shop", render: (p) => <StatusBadge status={p.active === false ? "hidden" : "active"} /> },
        { key: "actions", label: "", render: (p) => <div className="flex items-center gap-4"><Link href={`/admin/products/${p.id}`} className="text-sm underline-offset-4 hover:underline">Edit</Link><DeleteProductButton id={p.id} name={p.name} /></div> },
      ]} />
    </>
  );
}
