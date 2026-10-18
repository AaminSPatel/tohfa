import CheckoutView from "@/components/checkout/CheckoutView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Checkout", description: "Place your gift order.", path: "/checkout", noIndex: true });
export default function CheckoutPage() { return <CheckoutView />; }
