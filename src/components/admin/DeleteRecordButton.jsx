"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

/** Permanently deletes an inquiry or problem report (e.g. when a customer asks for their data to be erased). */
export default function DeleteRecordButton({ endpoint, label }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function del() {
    setBusy(true); setError("");
    const res = await fetch(endpoint, { method: "DELETE" });
    if (!res.ok) { setBusy(false); setError("Couldn't delete. Please try again."); return; }
    setOpen(false); setBusy(false); router.refresh();
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-rani hover:underline" aria-label={`Delete ${label}`}><FiTrash2 aria-hidden="true" /> Delete</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete this record?"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Keep it</Button><Button onClick={del} disabled={busy}>{busy ? "Deleting…" : "Delete for good"}</Button></>}>
        <p>This permanently erases {label} and the customer's details in it. You can't undo this.</p>
        {error && <p role="alert" className="mt-3 text-rani">{error}</p>}
      </Modal>
    </>
  );
}
