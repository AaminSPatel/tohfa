"use client";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { useCart } from "@/components/cart/CartProvider";

/** Small "add" button on product cards. Products that need personalisation go to the product page instead. */
export default function QuickAdd({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const needsInput = Boolean(product.personalisation?.required);
  if (product.stock <= 0) return null;
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsInput) router.push(`/product/${product.slug}`);
    else addItem(product, 1);
  };
  return (
    <button
      onClick={onClick}
      aria-label={needsInput ? `Personalise ${product.name}` : `Add ${product.name} to cart`}
      className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-paper text-ink shadow-soft transition-colors duration-200 hover:bg-rani hover:text-white"
    >
      <FiPlus size={20} />
    </button>
  );
}
