import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { slugify } from "@/lib/utils";

export default function PolicyPage({ policy, path }) {
  const crumbs = [{ name: "Home", href: "/" }, { name: policy.title, href: path }];
  return (
    <div className="container-page pb-24 pt-8 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      <div className="mx-auto mt-8 max-w-2xl">
        <h1 className="text-display-lg">{policy.title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {policy.updated}</p>
        <div className="prose-gift mt-8">
          {policy.sections.map((s) => (
            <section key={s.heading} id={slugify(s.heading)} className="scroll-mt-28">
              <h2>{s.heading}</h2>
              {s.body.map((para, i) => <p key={i}>{para}</p>)}
            </section>
          ))}
        </div>
      </div>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </div>
  );
}
