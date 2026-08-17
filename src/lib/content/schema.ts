import { z } from "zod";

// Every text/array cap here mirrors the length of the copy that shipped on
// launch — the admin CMS can't make a field say something the template
// wasn't designed to hold, but nothing here is more restrictive than what's
// already live.

const mediaUrl = z.string().min(1, "ต้องอัปโหลดไฟล์สื่อ");
const optionalMediaUrl = z.string().nullable().optional();

const heroSlideSchema = z.object({
  type: z.enum(["video", "image"]),
  mediaUrl,
  aspect: z.enum(["9 / 16", "4 / 3", "1 / 1", "16 / 9"]),
  alt: z.string().max(100).optional().default(""),
  eyebrow: z.string().min(1).max(40),
  headline: z.string().min(1).max(60),
  sub: z.string().min(1).max(120),
  ctaLabel: z.string().min(1).max(30),
});

export const sectionSchemas = {
  promo_bar: z.object({
    message: z.string().min(1).max(80),
  }),

  hero: z.object({
    // Unbounded on purpose: this is the "add as many slides as you want" list.
    slides: z.array(heroSlideSchema).min(1),
  }),

  lifestyle_banner: z.object({
    videoUrl: mediaUrl,
    imageUrl: mediaUrl,
    // Optional + defaulted: existing published/draft rows predate these
    // fields, and section content is parsed with a hard `.parse()` at
    // render time, so a required field here would break the live page.
    // Video and image now render as two independent cards rather than one
    // slot alternating with a fallback, so each gets its own copy.
    videoTitle: z.string().max(60).optional().default(""),
    videoDescription: z.string().max(140).optional().default(""),
    imageTitle: z.string().max(60).optional().default(""),
    imageDescription: z.string().max(140).optional().default(""),
  }),

  campaign_cta: z.object({
    heading: z.string().min(1).max(60),
    sub: z.string().min(1).max(120),
    ctaLabel: z.string().min(1).max(30),
  }),

  story: z.object({
    heading: z.string().min(1).max(60),
    body: z.string().min(1).max(600),
    points: z.array(z.string().min(1).max(100)),
    videoUrl: mediaUrl,
    imageUrl: mediaUrl,
  }),

  curated: z.object({
    bundles: z
      .array(
        z.object({
          label: z.string().min(1).max(60),
          ctaLabel: z.string().min(1).max(30),
          // Optional + defaulted: existing published/draft rows predate these
          // fields, and section content is parsed with a hard `.parse()` at
          // render time, so a required field here would break the live page.
          description: z.string().max(140).optional().default(""),
          tagLabel: z.string().max(20).optional().default(""),
          pinLabel: z.string().max(12).optional().default(""),
          footerName: z.string().max(40).optional().default(""),
          footerMeta: z.string().max(30).optional().default(""),
          imageUrl: mediaUrl,
          videoUrl: optionalMediaUrl,
        }),
      )
      .min(1),
  }),

  authenticity: z.object({
    heading: z.string().min(1).max(60),
    body: z.string().min(1).max(600),
    steps: z.array(z.string().min(1).max(100)),
    note: z.string().min(1).max(160),
    videoUrl: mediaUrl,
    imageUrl: mediaUrl,
  }),

  spotlight: z.object({
    heading: z.string().min(1).max(60),
    sub: z.string().min(1).max(120),
    // รายการที่รับซื้อ — explicitly unbounded, this is the one list allowed
    // to grow freely.
    items: z.array(
      z.object({
        label: z.string().min(1).max(30),
        photoUrl: mediaUrl,
      }),
    ),
  }),

  testimonials: z.object({
    items: z.array(
      z.object({
        initials: z.string().min(1).max(10),
        name: z.string().min(1).max(40),
        quote: z.string().min(1).max(300),
      }),
    ),
  }),

  faq: z.object({
    items: z.array(
      z.object({
        question: z.string().min(1).max(120),
        answer: z.string().min(1).max(400),
      }),
    ),
  }),

  cta_footer: z.object({
    heading: z.string().min(1).max(60),
    sub: z.string().min(1).max(120),
  }),
} as const;

export type SectionKey = keyof typeof sectionSchemas;

export const SECTION_KEYS = Object.keys(sectionSchemas) as SectionKey[];

export const SECTION_LABELS: Record<SectionKey, string> = {
  promo_bar: "แถบโปรโมชั่นด้านบน",
  hero: "ฮีโร่ / สไลด์หลัก",
  lifestyle_banner: "แบนเนอร์ไลฟ์สไตล์",
  campaign_cta: "แคมเปญ CTA",
  story: "เรื่องราวของเรา",
  curated: "ไม่ว่าจะกรณีไหน เรารับฟัง",
  authenticity: "การันตีราคาเป็นธรรม",
  spotlight: "รายการที่รับซื้อ",
  testimonials: "รีวิวลูกค้า",
  faq: "คำถามที่พบบ่อย",
  cta_footer: "CTA ท้ายเพจ",
};

export type SectionContent<K extends SectionKey> = z.infer<(typeof sectionSchemas)[K]>;
