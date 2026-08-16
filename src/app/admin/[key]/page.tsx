import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { SectionForm } from "@/components/admin/section-form";
import { SECTION_FIELDS } from "@/lib/admin/field-defs";
import { getSectionDraft } from "@/lib/content/repository";
import { SECTION_KEYS, SECTION_LABELS, type SectionKey } from "@/lib/content/schema";

function isSectionKey(key: string): key is SectionKey {
  return (SECTION_KEYS as string[]).includes(key);
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  return { title: isSectionKey(key) ? SECTION_LABELS[key] : "ไม่พบส่วนนี้" };
}

export default async function AdminSectionEditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isSectionKey(key)) notFound();

  const draft = await getSectionDraft(key);

  return (
    <div>
      <AdminTopbar title={SECTION_LABELS[key]} backHref="/admin" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <SectionForm sectionKey={key} fields={SECTION_FIELDS[key]} initialValue={draft} />
      </div>
    </div>
  );
}
