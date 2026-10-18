"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Field, FormAlert, Input } from "@/components/ui/Form";

/** mode: "login" | "signup" */
export default function AuthForm({ mode, next = "/admin" }) {
  const router = useRouter();
  const signup = mode === "signup";
  const [v, setV] = useState({ name: "", email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const bind = (k) => ({ value: v[k], onChange: (e) => setV((x) => ({ ...x, [k]: e.target.value })) });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/admin/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setError(data?.message || "Something went wrong."); setBusy(false); return; }
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch { setError("Couldn't reach the server."); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormAlert>{error}</FormAlert>
      {signup && <Field id="name" label="Your name" required><Input id="name" autoComplete="name" required {...bind("name")} /></Field>}
      <Field id="email" label="Email" required><Input id="email" type="email" autoComplete="username" required {...bind("email")} /></Field>
      <Field id="password" label="Password" required hint={signup ? "At least 10 characters." : undefined}><Input id="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 10 : undefined} {...bind("password")} hint={signup ? "x" : undefined} /></Field>
      {signup && <Field id="code" label="Signup code" required hint="The ADMIN_SIGNUP_CODE from your environment variables."><Input id="code" type="password" autoComplete="off" required {...bind("code")} hint="x" /></Field>}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Please wait…" : signup ? "Create admin account" : "Sign in"}</Button>
    </form>
  );
}
