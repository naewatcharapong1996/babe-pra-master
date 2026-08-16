import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | แอดมิน", default: "แอดมิน" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
