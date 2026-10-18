"use client";
import { FiAlertCircle } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import { siteConfig } from "@/data/siteConfig";
import { whatsappLink } from "@/lib/utils";

export default function Error({ reset }) {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon={<FiAlertCircle size={28} />}
        title="That didn't load"
        text="Something went wrong on our side. Try again, and if it keeps happening, message us and we'll help you order."
        action={{ label: "Try again", onClick: reset }}
        secondary={{ label: `Message ${siteConfig.brandName}`, href: whatsappLink("Hi! The website isn't loading for me."), external: true }}
      />
    </div>
  );
}
