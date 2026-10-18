import ProductCard from "./ProductCard";
import { StaggerGrid } from "@/components/ui/Reveal";

export default function ProductGrid({ products, className = "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4", priorityCount = 0 }) {
  return (
    <StaggerGrid className={className}>
      {products.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < priorityCount} />)}
    </StaggerGrid>
  );
}
