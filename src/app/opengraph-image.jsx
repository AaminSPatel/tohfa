import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/siteConfig";

export const alt = siteConfig.seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide share card (WhatsApp, Facebook, X). Generated from siteConfig, no asset needed.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#FAF6F3", color: "#24131E" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 52, height: 62, background: "#B4154F", borderRadius: 8 }} />
          <div style={{ fontSize: 56, fontWeight: 700 }}>{siteConfig.brandName}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>{siteConfig.tagline}</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#6B5560" }}>Personalised gifts, delivered across India</div>
        </div>
        <div style={{ height: 14, width: 220, background: "#F2B544" }} />
      </div>
    ),
    size
  );
}
