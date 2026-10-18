import PolicyPage from "@/components/layout/PolicyPage";
import { policies } from "@/data/policies";
import { buildMetadata } from "@/lib/seo";

const policy = policies["shipping-returns"];
export const metadata = buildMetadata({ title: policy.title, description: policy.description, path: "/shipping-returns" });
export default function Page() { return <PolicyPage policy={policy} path="/shipping-returns" />; }
