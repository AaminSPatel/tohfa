import OrderSuccessView from "@/components/checkout/OrderSuccessView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Order received", description: "Your order request has been received.", path: "/order-success", noIndex: true });

export default async function OrderSuccessPage({ searchParams }) {
  const { ref } = await searchParams;
  return <OrderSuccessView reference={typeof ref === "string" ? ref : ""} />;
}
