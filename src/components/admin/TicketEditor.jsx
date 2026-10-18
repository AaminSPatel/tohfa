"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Field, FormAlert, Select, Textarea } from "@/components/ui/Form";
import { labelFor } from "./ui";

export default function TicketEditor({ ticket, statuses }) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState(ticket.adminNotes || "");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/support/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, adminNotes: notes }) });
    setBusy(false);
    if (!res.ok) return setMsg({ tone: "error", text: "Couldn't save. Please try again." });
    setMsg({ tone: "success", text: "Saved." });
    router.refresh();
  }
  return (
    <div className="space-y-3">
      <Field id={`st-${ticket.id}`} label="Status"><Select id={`st-${ticket.id}`} value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 text-sm">{statuses.map((s) => <option key={s} value={s}>{labelFor(s)}</option>)}</Select></Field>
      <Field id={`nt-${ticket.id}`} label="Admin notes (private)"><Textarea id={`nt-${ticket.id}`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm" /></Field>
      <div className="flex items-center gap-3"><Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button></div>
      {msg && <FormAlert tone={msg.tone}>{msg.text}</FormAlert>}
    </div>
  );
}
