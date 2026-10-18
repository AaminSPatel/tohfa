"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DeleteProductButton({ id, name, redirectTo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function del() {
    setBusy(true); setError("");
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) { setBusy(false); setError("Couldn't delete. Please try again."); return; }
    setOpen(false);
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-rani hover:underline" aria-label={`Delete ${name}`}><FiTrash2 aria-hidden="true" /> Delete</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete this product?"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Keep it</Button><Button onClick={del} disabled={busy}>{busy ? "Deleting…" : "Delete product"}</Button></>}>
        <p><strong className="font-medium text-ink">{name}</strong> will be removed from the shop for good. Existing orders keep their copy of the details. To hide it temporarily, untick "Visible in shop" instead.</p>
        {error && <p role="alert" className="mt-3 text-rani">{error}</p>}
      </Modal>
    </>
  );
}
