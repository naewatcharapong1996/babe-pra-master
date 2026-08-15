// Placeholder brand data for the initial build. Every value here is safe to
// ship structurally, but the ones marked TODO are specific real-world facts
// (temple, monk, contact handles) that must come from the actual brand owner
// before this site goes live — do not invent these.

export const siteConfig = {
  brandNameTh: "เบ๊บบางมด",
  brandNameEn: "BABEBANGMOD",
  businessDescriptorTh: "รับเช่าพระเครื่อง",
  tagline: "ส่งรูปพระมาตีราคา ตอบไว ให้ราคาสูงสุด",
  description:
    "เบ๊บบางมด รับเช่าพระเครื่อง พระบูชา วัตถุมงคล และของสะสมทุกชนิด การันตีราคาเป็นธรรม จ่ายเงินสดทันที บริการรับซื้อถึงที่ทั่วกรุงเทพฯ และต่างจังหวัด",
  // TODO: replace with the real production domain before launch.
  url: "https://example.com",
  locale: "th_TH",
  lineId: "@babebangmod",
  lineUrl: "https://lin.ee/mUBDRoY",
  phone: "062-946-2451",
  get phoneHref() {
    return `tel:${this.phone.replace(/-/g, "")}`;
  },
  social: {
    facebook: "https://www.facebook.com/Babebangmod",
    facebookName: "เบ๊บบางมด-รับเช่าพระเครื่อง",
    // TODO: replace with a real, live Instagram profile URL (or remove if unused).
    instagram: "https://instagram.com/babebangmod",
  },
  // TODO: replace with a real, monitored contact address.
  contactEmail: "hello@example.com",
} as const;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "#story", label: "เรื่องราว" },
  { href: "#authenticity", label: "การันตีราคา" },
  { href: "#testimonials", label: "รีวิว" },
  { href: "#faq", label: "คำถามที่พบบ่อย" },
];
