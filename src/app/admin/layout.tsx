import type { Metadata } from "next";
import { ToastProvider } from "@heroui/react";

export const metadata: Metadata = {
  title: { template: "%s | แอดมิน", default: "แอดมิน" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider placement="top" />
    </>
  );
}
