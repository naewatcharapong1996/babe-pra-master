"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Spinner, toast } from "@heroui/react";
import { ChevronRightIcon } from "@/components/icons";
import { publishAllAction } from "@/app/admin/actions";
import { useAdminStore } from "@/lib/admin/store";
import { SECTION_LABELS, type SectionKey } from "@/lib/content/schema";
import type { AdminSectionRow } from "@/lib/content/repository";

export function DashboardBody({ initialSections }: { initialSections: AdminSectionRow[] }) {
  const hydrate = useAdminStore((s) => s.hydrate);
  const markAllPublished = useAdminStore((s) => s.markAllPublished);
  const storeSections = useAdminStore((s) => s.sections);
  const [publishing, setPublishing] = useState(false);

  // Seed the store from the server-rendered snapshot on every mount (route
  // entry). Rows already read from the store (see `pending` below) fall
  // back to this same prop until the effect runs, so there's no flash.
  useEffect(() => {
    hydrate(initialSections);
  }, [initialSections, hydrate]);

  const merged = initialSections.map((row) => ({
    ...row,
    pending: storeSections[row.key]?.pending ?? row.pending,
  }));
  const pendingCount = merged.filter((s) => s.pending).length;

  async function handlePublish() {
    if (!confirm("เผยแพร่การเปลี่ยนแปลงทั้งหมดขึ้นเว็บจริงตอนนี้เลยหรือไม่?")) return;
    setPublishing(true);
    try {
      const result = await publishAllAction();
      markAllPublished();
      toast.success(`เผยแพร่สำเร็จ (${result.published} ส่วน)`);
    } catch {
      toast.danger("เผยแพร่ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-taupe/30 bg-taupe/5 p-4">
        <div>
          <p className="text-sm font-medium text-onyx">
            {pendingCount > 0 ? `มี ${pendingCount} ส่วนที่แก้ไขแล้วแต่ยังไม่เผยแพร่` : "ทุกส่วนเผยแพร่ล่าสุดแล้ว"}
          </p>
          <p className="mt-0.5 text-xs text-onyx/50">แก้ไขได้หลายส่วนพร้อมกัน แล้วค่อยกดเผยแพร่ทีเดียว</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/media"
            className="rounded-full border border-taupe/40 px-5 py-2 text-sm font-semibold text-onyx hover:bg-taupe/10"
          >
            คลังสื่อ
          </Link>
          <Link
            href="/admin/preview"
            target="_blank"
            className="rounded-full border border-taupe/40 px-5 py-2 text-sm font-semibold text-onyx hover:bg-taupe/10"
          >
            ดูตัวอย่างทั้งหน้า
          </Link>
          <Button
            variant="danger"
            size="md"
            isDisabled={pendingCount === 0 || publishing}
            onPress={handlePublish}
            className="gap-2"
          >
            {publishing && <Spinner size="sm" color="current" />}
            {publishing ? "กำลังเผยแพร่..." : "เผยแพร่ขึ้นเว็บจริง"}
          </Button>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-taupe/20 rounded-xl border border-taupe/30">
        {merged.map((section) => (
          <li key={section.key}>
            <Link
              href={`/admin/${section.key}`}
              className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-taupe/5"
            >
              <span className="text-sm font-medium text-onyx">{SECTION_LABELS[section.key as SectionKey]}</span>
              <span className="flex items-center gap-2">
                {section.pending ? (
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-onyx">มีการแก้ไข</span>
                ) : (
                  <span className="text-xs text-onyx/40">เผยแพร่แล้ว</span>
                )}
                <ChevronRightIcon className="h-4 w-4 text-onyx/30" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
