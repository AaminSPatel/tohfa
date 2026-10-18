"use client";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function AdminHeader({ name, email }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <div className="flex items-center justify-end gap-4 border-b border-line bg-white px-5 py-3 sm:px-8">
      <p className="text-right text-sm leading-tight"><span className="block font-medium">{name}</span><span className="text-muted">{email}</span></p>
      <button onClick={logout} className="inline-flex h-10 items-center gap-2 rounded border border-ink/25 px-3 text-sm hover:bg-ink hover:text-paper"><FiLogOut aria-hidden="true" /> Sign out</button>
    </div>
  );
}
