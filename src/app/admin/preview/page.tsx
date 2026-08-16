import type { Metadata } from "next";
import Link from "next/link";
import { SiteContent } from "@/components/site-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LineModalProvider } from "@/components/line-modal";
import { getAllDraftSections } from "@/lib/content/repository";

export const metadata: Metadata = { title: "ตัวอย่าง" };

export default async function AdminPreviewPage() {
  const content = await getAllDraftSections();

  return (
    <LineModalProvider>
      <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 bg-gold px-4 py-2 text-xs font-semibold text-onyx sm:text-sm">
        <span>โหมดดูตัวอย่าง — นี่คือฉบับร่างที่ยังไม่เผยแพร่ขึ้นเว็บจริง</span>
        <Link href="/admin" className="rounded-full bg-onyx px-3 py-1 text-bone">
          กลับแดชบอร์ด
        </Link>
      </div>
      <SiteHeader />
      <main className="flex-1">
        <SiteContent content={content} />
      </main>
      <SiteFooter />
    </LineModalProvider>
  );
}
