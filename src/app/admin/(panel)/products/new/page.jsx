import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Add a product" />
      <div className="max-w-4xl"><ProductForm cloudinaryReady={isCloudinaryConfigured()} /></div>
    </>
  );
}
