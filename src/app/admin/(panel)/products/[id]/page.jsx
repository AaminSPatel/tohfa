import { notFound } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { PageHeader } from "@/components/admin/ui";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getProductById } from "@/lib/adminData";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  return (
    <>
      <PageHeader title={product.name} text={<Link href={`/product/${product.slug}`} target="_blank" className="underline underline-offset-4">View in shop</Link>} actions={<DeleteProductButton id={product.id} name={product.name} redirectTo="/admin/products" />} />
      <div className="max-w-4xl"><ProductForm product={product} cloudinaryReady={isCloudinaryConfigured()} /></div>
    </>
  );
}
