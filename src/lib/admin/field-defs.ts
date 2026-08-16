import type { SectionKey } from "@/lib/content/schema";

export type FieldDef =
  | { kind: "text"; key: string; label: string; maxLength: number }
  | { kind: "textarea"; key: string; label: string; maxLength: number; rows?: number }
  | { kind: "select"; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: "media"; key: string; label: string; accept?: string; optional?: boolean }
  | { kind: "stringArray"; key: string; label: string; itemMaxLength: number }
  | { kind: "array"; key: string; label: string; itemFields: FieldDef[] };

// One declarative form definition per section — the template/CSS these feed
// into is fixed, so this list *is* the full set of things a colleague can
// change. Caps mirror the zod schema in lib/content/schema.ts.
export const SECTION_FIELDS: Record<SectionKey, FieldDef[]> = {
  promo_bar: [{ kind: "text", key: "message", label: "ข้อความ", maxLength: 80 }],

  hero: [
    {
      kind: "array",
      key: "slides",
      label: "สไลด์ (เพิ่มได้ไม่จำกัด)",
      itemFields: [
        {
          kind: "select",
          key: "type",
          label: "ประเภทสื่อ",
          options: [
            { value: "video", label: "วิดีโอ" },
            { value: "image", label: "รูปภาพ" },
          ],
        },
        { kind: "media", key: "mediaUrl", label: "ไฟล์สื่อ" },
        {
          kind: "select",
          key: "aspect",
          label: "สัดส่วน",
          options: [
            { value: "9 / 16", label: "แนวตั้ง 9:16" },
            { value: "4 / 3", label: "แนวนอน 4:3" },
            { value: "1 / 1", label: "จัตุรัส 1:1" },
            { value: "16 / 9", label: "แนวนอนกว้าง 16:9" },
          ],
        },
        { kind: "text", key: "alt", label: "คำอธิบายภาพ (alt)", maxLength: 100 },
        { kind: "text", key: "eyebrow", label: "ข้อความเล็กด้านบน", maxLength: 40 },
        { kind: "text", key: "headline", label: "หัวข้อหลัก", maxLength: 60 },
        { kind: "textarea", key: "sub", label: "คำอธิบายรอง", maxLength: 120 },
        { kind: "text", key: "ctaLabel", label: "ข้อความปุ่ม", maxLength: 30 },
      ],
    },
  ],

  lifestyle_banner: [
    { kind: "media", key: "videoUrl", label: "วิดีโอ" },
    { kind: "media", key: "imageUrl", label: "รูปภาพสำรอง (ถ้าวิดีโอเล่นไม่ได้)" },
  ],

  campaign_cta: [
    { kind: "text", key: "heading", label: "หัวข้อ", maxLength: 60 },
    { kind: "textarea", key: "sub", label: "คำอธิบาย", maxLength: 120 },
    { kind: "text", key: "ctaLabel", label: "ข้อความปุ่ม", maxLength: 30 },
  ],

  story: [
    { kind: "text", key: "heading", label: "หัวข้อ", maxLength: 60 },
    { kind: "textarea", key: "body", label: "เนื้อหา", maxLength: 600, rows: 5 },
    { kind: "stringArray", key: "points", label: "จุดเด่น (เพิ่มได้ไม่จำกัด)", itemMaxLength: 100 },
    { kind: "media", key: "videoUrl", label: "วิดีโอ" },
    { kind: "media", key: "imageUrl", label: "รูปภาพสำรอง" },
  ],

  curated: [
    {
      kind: "array",
      key: "bundles",
      label: "การ์ด (เพิ่มได้ไม่จำกัด)",
      itemFields: [
        { kind: "text", key: "label", label: "ข้อความ", maxLength: 60 },
        { kind: "text", key: "ctaLabel", label: "ข้อความปุ่ม", maxLength: 30 },
        { kind: "media", key: "imageUrl", label: "รูปภาพ" },
        { kind: "media", key: "videoUrl", label: "วิดีโอ (ไม่บังคับ)", optional: true },
      ],
    },
  ],

  authenticity: [
    { kind: "text", key: "heading", label: "หัวข้อ", maxLength: 60 },
    { kind: "textarea", key: "body", label: "เนื้อหา", maxLength: 600, rows: 5 },
    { kind: "stringArray", key: "steps", label: "ขั้นตอน (เพิ่มได้ไม่จำกัด)", itemMaxLength: 100 },
    { kind: "text", key: "note", label: "ข้อความกล่องเสริม", maxLength: 160 },
    { kind: "media", key: "videoUrl", label: "วิดีโอ" },
    { kind: "media", key: "imageUrl", label: "รูปภาพสำรอง" },
  ],

  spotlight: [
    { kind: "text", key: "heading", label: "หัวข้อ", maxLength: 60 },
    { kind: "textarea", key: "sub", label: "คำอธิบาย", maxLength: 120 },
    {
      kind: "array",
      key: "items",
      label: "รายการที่รับซื้อ (เพิ่มได้ไม่จำกัด)",
      itemFields: [
        { kind: "text", key: "label", label: "ชื่อรายการ", maxLength: 30 },
        { kind: "media", key: "photoUrl", label: "รูปภาพ" },
      ],
    },
  ],

  testimonials: [
    {
      kind: "array",
      key: "items",
      label: "รีวิว (เพิ่มได้ไม่จำกัด)",
      itemFields: [
        { kind: "text", key: "initials", label: "อักษรย่อ", maxLength: 10 },
        { kind: "text", key: "name", label: "ชื่อ", maxLength: 40 },
        { kind: "textarea", key: "quote", label: "ข้อความรีวิว", maxLength: 300 },
      ],
    },
  ],

  faq: [
    {
      kind: "array",
      key: "items",
      label: "คำถาม-คำตอบ (เพิ่มได้ไม่จำกัด)",
      itemFields: [
        { kind: "text", key: "question", label: "คำถาม", maxLength: 120 },
        { kind: "textarea", key: "answer", label: "คำตอบ", maxLength: 400 },
      ],
    },
  ],

  cta_footer: [
    { kind: "text", key: "heading", label: "หัวข้อ", maxLength: 60 },
    { kind: "textarea", key: "sub", label: "คำอธิบาย", maxLength: 120 },
  ],
};
