import type { Metadata } from "next";
import { Kanit, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700", "800"],
});

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brandNameTh} ${siteConfig.businessDescriptorTh} — ให้ราคาสูงสุด จ่ายเงินสดทันที`,
    template: `%s | ${siteConfig.brandNameTh}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.brandNameTh,
    title: `${siteConfig.brandNameTh} ${siteConfig.businessDescriptorTh}`,
    description: siteConfig.description,
    // TODO: add a real 1200x630 OG image at /public/og-image.jpg and reference it here.
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandNameTh} ${siteConfig.businessDescriptorTh}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${plexThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
