import { DataTable, Date_, PageHeader } from "@/components/admin/ui";
import StatusSelect from "@/components/admin/StatusSelect";
import { listInquiries } from "@/lib/adminData";
import { INQUIRY_STATUSES } from "@/models/Inquiry";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";

export default async function AdminInquiries() {
  const rows = await listInquiries();
  return (
    <>
      <PageHeader title="Inquiries" text="Messages from the contact form." />
      <DataTable caption="Inquiries" empty="No messages yet." rows={rows} columns={[
        { key: "name", label: "Customer", render: (r) => <span className="font-medium">{r.name}</span> },
        { key: "contact", label: "Phone / email", render: (r) => <span className="text-ink-soft">{r.phone && <a href={`tel:${r.phone}`} className="block hover:underline">{r.phone}</a>}{r.email && <a href={`mailto:${r.email}`} className="block break-all hover:underline">{r.email}</a>}</span> },
        { key: "message", label: "Message", className: "max-w-md", render: (r) => <p className="whitespace-pre-line">{r.message}</p> },
        { key: "createdAt", label: "Date", render: (r) => <Date_ value={r.createdAt} /> },
        { key: "status", label: "Status", render: (r) => <StatusSelect endpoint={`/api/admin/inquiries/${r.id}`} value={r.status} options={INQUIRY_STATUSES} label={`Status for inquiry from ${r.name}`} /> },
        { key: "del", label: "", render: (r) => <DeleteRecordButton endpoint={`/api/admin/inquiries/${r.id}`} label={`the inquiry from ${r.name}`} /> },
      ]} />
    </>
  );
}
