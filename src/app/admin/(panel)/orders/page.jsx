import Link from "next/link";
import { DataTable, Date_, PageHeader } from "@/components/admin/ui";
import StatusSelect from "@/components/admin/StatusSelect";
import { listOrders } from "@/lib/adminData";
import { ORDER_STATUSES } from "@/models/Order";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <>
      <PageHeader title="Orders" text="Most recent first. Change the status right here." />
      <DataTable caption="Orders" empty="No orders yet." rows={orders} columns={[
        { key: "orderId", label: "Order", render: (o) => <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-4 hover:underline">{o.orderId}</Link> },
        { key: "customer", label: "Customer", render: (o) => <span>{o.customer?.name}<span className="block text-xs text-muted">{o.customer?.phone}, {o.customer?.city}</span></span> },
        { key: "items", label: "Items", render: (o) => o.items.reduce((s, i) => s + i.qty, 0) },
        { key: "total", label: "Total", render: (o) => formatPrice(o.total) },
        { key: "pay", label: "Payment", render: (o) => (o.paymentPreference === "upi" ? "UPI" : "On delivery") },
        { key: "createdAt", label: "Placed", render: (o) => <Date_ value={o.createdAt} /> },
        { key: "status", label: "Status", render: (o) => <StatusSelect endpoint={`/api/admin/orders/${o.id}`} value={o.status} options={ORDER_STATUSES} label={`Status for order ${o.orderId}`} /> },
      ]} />
    </>
  );
}
