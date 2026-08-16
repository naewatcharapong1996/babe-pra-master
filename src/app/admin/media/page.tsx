import type { Metadata } from "next";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { MediaLibraryBody } from "@/components/admin/media-library-body";
import { listMediaAssets } from "@/lib/content/media-repository";

export const metadata: Metadata = { title: "คลังสื่อ" };

export default async function AdminMediaPage() {
  const assets = await listMediaAssets();

  return (
    <div>
      <AdminTopbar title="คลังสื่อ" backHref="/admin" />
      <MediaLibraryBody initialAssets={assets} />
    </div>
  );
}
