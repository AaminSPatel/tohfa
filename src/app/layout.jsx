import "./globals.css";
import { siteConfig, siteUrl } from "@/data/siteConfig";
import { fontBody, fontDisplay, fontHand } from "@/lib/fonts";
import Providers from "@/components/providers";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteConfig.seo.title, template: siteConfig.seo.titleTemplate },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  applicationName: siteConfig.brandName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", siteName: siteConfig.brandName, locale: siteConfig.locale,
    title: siteConfig.seo.title, description: siteConfig.seo.description, url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: siteConfig.seo.title, description: siteConfig.seo.description, ...(siteConfig.seo.twitterHandle ? { site: siteConfig.seo.twitterHandle } : {}) },
};

export const viewport = { themeColor: "#FAF6F3", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang={siteConfig.language.split("-")[0]} className={`${fontDisplay.variable} ${fontBody.variable} ${fontHand.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
