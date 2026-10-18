import Link from "next/link";
import { DataTable, Date_, PageHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { dashboardStats } from "@/lib/adminData";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const s = await dashboardStats();
  const stats = [
    { label: "Orders", value: s.orders, href: "/admin/orders" },
    { label: "Waiting to be confirmed", value: s.pending, href: "/admin/orders", hot: s.pending > 0 },
    { label: "Revenue (excl. cancelled)", value: formatPrice(s.revenue), href: "/admin/orders" },
    { label: "New inquiries", value: s.newInquiries, href: "/admin/inquiries", hot: s.newInquiries > 0 },
    { label: "Open customer problems", value: s.openTickets, href: "/admin/users-problems", hot: s.openTickets > 0 },
    { label: "Products", value: s.products, href: "/admin/products" },
  ];
  return (
    <>
      <PageHeader title="Dashboard" text="What needs you today." />
      {s.products === 0 && (
        <div className="mb-8 rounded-lg border border-marigold bg-marigold-soft/60 p-5 text-sm">
          <p className="font-medium">Your shop has no products yet.</p>
          <p className="mt-1 text-ink-soft">Import the starter catalogue from <Link href="/admin/settings" className="underline underline-offset-4">Settings</Link>, or <Link href="/admin/products/new" className="underline underline-offset-4">add your first product</Link>.</p>
        </div>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((x) => (
          <li key={x.label}>
            <Link href={x.href} className="block rounded-lg border border-line bg-white p-5 transition-colors hover:border-ink/40">
              <p className="text-sm text-muted">{x.label}</p>
              <p className={`mt-2 font-display text-3xl ${x.hot ? "text-rani" : ""}`}>{x.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 grid gap-8 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <h2 className="mb-3 text-display-sm">Recent orders</h2>
          <DataTable caption="Recent orders" empty="No orders yet. They'll appear here as soon as someone checks out." rows={s.recentOrders} columns={[
            { key: "orderId", label: "Order", render: (o) => <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-4 hover:underline">{o.orderId}</Link> },
            { key: "customer", label: "Customer", render: (o) => o.customer?.name },
            { key: "total", label: "Total", render: (o) => formatPrice(o.total) },
            { key: "status", label: "Status", render: (o) => <StatusBadge status={o.status} /> },
            { key: "createdAt", label: "Placed", render: (o) => <Date_ value={o.createdAt} /> },
          ]} />
        </div>
        <Panel title="Low or no stock" className="xl:col-span-2">
          {s.lowStock.length === 0 ? <p className="text-ink-soft">Everything is comfortably stocked.</p> : (
            <ul className="divide-y divide-line">
              {s.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <Link href={`/admin/products/${p.id}`} className="underline-offset-4 hover:underline">{p.name}</Link>
                  <span className={p.stock === 0 ? "font-medium text-rani" : "text-ink-soft"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
