import PolicyPage from "@/components/layout/PolicyPage";
import { policies } from "@/data/policies";
import { buildMetadata } from "@/lib/seo";

const policy = policies["privacy-policy"];
export const metadata = buildMetadata({ title: policy.title, description: policy.description, path: "/privacy-policy" });
export default function Page() { return <PolicyPage policy={policy} path="/privacy-policy" />; }
