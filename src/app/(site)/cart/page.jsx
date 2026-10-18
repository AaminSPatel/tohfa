import CartView from "@/components/cart/CartView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Your cart", description: "Review the gifts in your cart.", path: "/cart", noIndex: true });
export default function CartPage() { return <CartView />; }
