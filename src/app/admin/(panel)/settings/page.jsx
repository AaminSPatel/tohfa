import { PageHeader, Panel } from "@/components/admin/ui";
import { PasswordForm, SeedButton, TestEmailButton } from "@/components/admin/SettingsForms";
import { requireAdmin } from "@/lib/auth";
import { isMailConfigured, adminRecipients } from "@/lib/mail";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { StatusBadge } from "@/components/admin/ui";

export default async function AdminSettings() {
  const session = await requireAdmin();
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-4xl gap-6">
        <Panel title="Business information">
          <p className="text-ink-soft">Your name, phone, address, hours, shipping rules and SEO defaults live in one file: <code className="rounded bg-sand px-1">src/data/siteConfig.js</code>. Edit it, commit, and redeploy. We keep it in code so it's version-controlled and fast.</p>
        </Panel>
        <Panel title="Starter products">
          <p className="mb-4 text-ink-soft">Copies the sample catalogue from <code className="rounded bg-sand px-1">src/data/products.js</code> into your database. Products that already exist are skipped, so it's safe to run twice.</p>
          <SeedButton />
        </Panel>
        <Panel title={`Password for ${session.email}`}><PasswordForm /></Panel>
        <Panel title="Email notifications">
          <p className="mb-4 text-ink-soft">New orders, contact inquiries and customer problems are emailed to <strong className="font-medium text-ink">{adminRecipients().join(", ")}</strong>. Customers are never emailed. Set this up with the SMTP_* values in your environment.</p>
          <p className="mb-4">Status: {isMailConfigured() ? <StatusBadge status="active" /> : <span className="text-rani">Not set up yet</span>}</p>
          <TestEmailButton disabled={!isMailConfigured()} />
        </Panel>
        <Panel title="Photo uploads (Cloudinary)">
          <p className="text-ink-soft">Upload photos from the product form. Replaced or removed photos are deleted from Cloudinary automatically when you save.</p>
          <p className="mt-3">Status: {isCloudinaryConfigured() ? <StatusBadge status="active" /> : <span className="text-rani">Not set up yet. Add the CLOUDINARY_* values to your environment.</span>}</p>
        </Panel>
      </div>
    </>
  );
}
