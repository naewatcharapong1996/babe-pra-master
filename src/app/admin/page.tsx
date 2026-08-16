import type { Metadata } from "next";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { DashboardBody } from "@/components/admin/dashboard-body";
import { getSectionsForDashboard } from "@/lib/content/repository";

export const metadata: Metadata = { title: "แดชบอร์ด" };

export default async function AdminDashboardPage() {
  const sections = await getSectionsForDashboard();

  return (
    <div>
      <AdminTopbar title="แดชบอร์ด" />
      <DashboardBody initialSections={sections} />
    </div>
  );
}
