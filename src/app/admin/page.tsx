import type { Metadata } from "next";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PublishButton } from "@/components/admin/publish-button";
import { getSectionsForDashboard } from "@/lib/content/repository";
import { SECTION_LABELS } from "@/lib/content/schema";

export const metadata: Metadata = { title: "แดชบอร์ด" };

export default async function AdminDashboardPage() {
  const sections = await getSectionsForDashboard();
  const pendingCount = sections.filter((s) => s.pending).length;

  return (
    <div>
      <AdminTopbar title="แดชบอร์ด" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-taupe/30 bg-taupe/5 p-4">
          <div>
            <p className="text-sm font-medium text-onyx">
              {pendingCount > 0 ? `มี ${pendingCount} ส่วนที่แก้ไขแล้วแต่ยังไม่เผยแพร่` : "ทุกส่วนเผยแพร่ล่าสุดแล้ว"}
            </p>
            <p className="mt-0.5 text-xs text-onyx/50">แก้ไขได้หลายส่วนพร้อมกัน แล้วค่อยกดเผยแพร่ทีเดียว</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/preview" target="_blank" className="rounded-full border border-taupe/40 px-5 py-2 text-sm font-semibold text-onyx hover:bg-taupe/10">
              ดูตัวอย่างทั้งหน้า
            </Link>
            <PublishButton disabled={pendingCount === 0} />
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-taupe/20 rounded-xl border border-taupe/30">
          {sections.map((section) => (
            <li key={section.key}>
              <Link href={`/admin/${section.key}`} className="flex items-center justify-between px-4 py-3.5 hover:bg-taupe/5">
                <span className="text-sm font-medium text-onyx">{SECTION_LABELS[section.key]}</span>
                {section.pending ? (
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-onyx">มีการแก้ไข</span>
                ) : (
                  <span className="text-xs text-onyx/40">เผยแพร่แล้ว</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
