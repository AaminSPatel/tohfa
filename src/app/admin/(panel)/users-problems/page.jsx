import { DataTable, Date_, PageHeader } from "@/components/admin/ui";
import TicketEditor from "@/components/admin/TicketEditor";
import { listTickets } from "@/lib/adminData";
import { TICKET_STATUSES } from "@/models/SupportTicket";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";

export default async function AdminProblems() {
  const rows = await listTickets();
  return (
    <>
      <PageHeader title="Customer problems" text="Reports and complaints from the contact page." />
      <DataTable caption="Customer problems" empty="No reports. Hopefully that stays true." rows={rows} columns={[
        { key: "subject", label: "Problem", className: "max-w-sm", render: (r) => <div><p className="font-medium">{r.subject}</p><p className="mt-1 whitespace-pre-line text-ink-soft">{r.description}</p>{r.orderId && <p className="mt-2 text-xs text-muted">Order: {r.orderId}</p>}</div> },
        { key: "customer", label: "Customer", render: (r) => <span>{r.name}<span className="block text-ink-soft">{r.phone}</span><span className="block break-all text-ink-soft">{r.email}</span></span> },
        { key: "createdAt", label: "Date", render: (r) => <Date_ value={r.createdAt} /> },
        { key: "edit", label: "Status and notes", className: "min-w-[240px]", render: (r) => <div><TicketEditor ticket={r} statuses={TICKET_STATUSES} /><div className="mt-3"><DeleteRecordButton endpoint={`/api/admin/support/${r.id}`} label={`the report from ${r.name}`} /></div></div> },
      ]} />
    </>
  );
}
