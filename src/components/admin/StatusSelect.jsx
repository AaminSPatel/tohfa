"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Form";
import { labelFor } from "./ui";

/** Select that PATCHes { status } to `endpoint` as soon as it changes. */
export default function StatusSelect({ endpoint, value, options, label = "Status" }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [state, setState] = useState("idle");

  async function onChange(e) {
    const next = e.target.value, prev = status;
    setStatus(next); setState("saving");
    const res = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (!res.ok) { setStatus(prev); setState("error"); return; }
    setState("saved");
    router.refresh();
    setTimeout(() => setState("idle"), 1500);
  }
  return (
    <div>
      <label className="sr-only" htmlFor={endpoint}>{label}</label>
      <Select id={endpoint} value={status} onChange={onChange} className="h-10 min-w-[9.5rem] text-sm" disabled={state === "saving"}>
        {options.map((o) => <option key={o} value={o}>{labelFor(o)}</option>)}
      </Select>
      <p className="mt-1 h-4 text-xs" role="status">{state === "saved" ? <span className="text-leaf">Saved</span> : state === "error" ? <span className="text-rani">Couldn't save. Try again.</span> : ""}</p>
    </div>
  );
}
