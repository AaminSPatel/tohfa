"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Field, FormAlert, Input } from "@/components/ui/Form";

export function PasswordForm() {
  const [v, setV] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok) return setMsg({ tone: "error", text: data?.message || "Couldn't change the password." });
    setV({ current: "", next: "" }); setMsg({ tone: "success", text: "Password changed." });
  }
  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <Field id="cur" label="Current password"><Input id="cur" type="password" autoComplete="current-password" required value={v.current} onChange={(e) => setV({ ...v, current: e.target.value })} /></Field>
      <Field id="nxt" label="New password" hint="At least 10 characters."><Input id="nxt" type="password" autoComplete="new-password" required minLength={10} value={v.next} onChange={(e) => setV({ ...v, next: e.target.value })} hint="x" /></Field>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Change password"}</Button>
      {msg && <FormAlert tone={msg.tone}>{msg.text}</FormAlert>}
    </form>
  );
}

export function SeedButton() {
  const router = useRouter();
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function seed() {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok) return setMsg({ tone: "error", text: data?.message || "Import failed." });
    setMsg({ tone: "success", text: `Imported ${data.imported} products. ${data.skipped} already existed.` });
    router.refresh();
  }
  return (
    <div className="space-y-3">
      <Button variant="outline" onClick={seed} disabled={busy}>{busy ? "Importing…" : "Import starter products"}</Button>
      {msg && <FormAlert tone={msg.tone}>{msg.text}</FormAlert>}
    </div>
  );
}

export function TestEmailButton({ disabled }) {
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function send() {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/test-email", { method: "POST" });
    const data = await res.json().catch(() => null);
    setBusy(false);
    setMsg(res.ok ? { tone: "success", text: `Sent to ${data.to.join(", ")}. Check that inbox (and spam).` } : { tone: "error", text: data?.message || "Couldn't send." });
  }
  return (
    <div className="space-y-3">
      <Button variant="outline" onClick={send} disabled={busy || disabled}>{busy ? "Sending…" : "Send a test email"}</Button>
      {msg && <FormAlert tone={msg.tone}>{msg.text}</FormAlert>}
    </div>
  );
}
