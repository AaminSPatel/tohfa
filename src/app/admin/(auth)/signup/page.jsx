import Link from "next/link";
import AuthForm from "@/components/admin/AuthForm";
import { DbNotice } from "@/components/admin/ui";
import { TagMark } from "@/components/ui/Logo";
import { isDbConfigured } from "@/lib/db";
import { siteConfig } from "@/data/siteConfig";

export const metadata = { title: "Create admin account", robots: { index: false } };

export default function AdminSignupPage() {
  const enabled = Boolean(process.env.ADMIN_SIGNUP_CODE);
  return (
    <div className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2.5 font-display text-2xl"><TagMark className="text-rani" />{siteConfig.brandName} admin</div>
        {!isDbConfigured() ? <DbNotice /> : !enabled ? (
          <div className="rounded-lg border border-line bg-white p-6 text-ink-soft">
            <h1 className="text-display-sm text-ink">Signup is switched off</h1>
            <p className="mt-2">Set <code className="rounded bg-sand px-1">ADMIN_SIGNUP_CODE</code> in your environment variables and restart to create an admin account.</p>
            <p className="mt-4"><Link href="/admin/login" className="underline underline-offset-4">Back to sign in</Link></p>
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <h1 className="mb-6 text-display-md">Create admin account</h1>
            <AuthForm mode="signup" />
            <p className="mt-6 text-sm text-muted">Already have one? <Link href="/admin/login" className="underline underline-offset-4">Sign in</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
