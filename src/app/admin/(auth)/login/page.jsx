import Link from "next/link";
import AuthForm from "@/components/admin/AuthForm";
import { DbNotice } from "@/components/admin/ui";
import { TagMark } from "@/components/ui/Logo";
import { isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/data/siteConfig";

export const metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLoginPage({ searchParams }) {
  const { next } = await searchParams;
  return (
    <div className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2.5 font-display text-2xl"><TagMark className="text-rani" />{siteConfig.brandName} admin</div>
        {isDbConfigured() ? (
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <h1 className="mb-6 text-display-md">Sign in</h1>
            <AuthForm mode="login" next={typeof next === "string" ? next : "/admin"} />
            <p className="mt-6 text-sm text-muted">First time here? <Link href="/admin/signup" className="underline underline-offset-4">Create the admin account</Link> (needs your signup code).</p>
          </div>
        ) : <DbNotice />}
      </div>
    </div>
  );
}
