// One-off / re-runnable seed: writes the site's current hardcoded copy into
// page_sections as the initial draft+published content, so the admin panel
// starts populated instead of blank. Safe to re-run (upsert on `key`).
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] ??= match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const PRODUCT_PHOTO_COUNT = 11;
const spotlightLabels = [
  "พระเหรียญ", "พระผง", "พระเนื้อดิน", "พระปิดตา", "พระสมเด็จ", "พระหล่อ",
  "พระกริ่ง-ชัยวัฒน์", "พระทองคำ", "รูปถ่ายเกจิ", "เหรียญคณาจารย์", "ของเก่าของโบราณ", "กระเพาะปลา",
];

const sections = {
  promo_bar: {
    message: "ส่งรูปพระมาให้เราตีราคาฟรีวันนี้ — @babebangmod",
  },

  hero: {
    slides: [
      { type: "video", mediaUrl: "/media/hero/video-1.webm", aspect: "9 / 16", eyebrow: "รับเช่าพระเครื่อง พระบูชา วัตถุมงคล", headline: "ส่งรูปพระ มาตีราคาได้เลย", sub: "ตอบไว รวดเร็ว ให้ราคาสูงสุด จ่ายเงินสดทันที", ctaLabel: "ทักไลน์ส่งรูปประเมินราคา" },
      { type: "image", mediaUrl: "/media/hero/picture-1.jpeg", aspect: "4 / 3", alt: "เลิกสะสม พระมรดกตกทอด", eyebrow: "เลิกสะสม พระมรดกตกทอด", headline: "มีพระเครื่องต้องการปล่อย?", sub: "การันตีราคาเป็นธรรม ตั้งแต่หลักร้อยถึงหลักล้าน", ctaLabel: "ทักไลน์เลย" },
      { type: "video", mediaUrl: "/media/hero/video-2.webm", aspect: "9 / 16", eyebrow: "บริการถึงที่", headline: "รับซื้อพระถึงบ้าน", sub: "สะดวก รวดเร็ว ปลอดภัย ทั่วกรุงเทพฯ และต่างจังหวัด", ctaLabel: "ทักไลน์นัดหมาย" },
      { type: "image", mediaUrl: "/media/hero/picture-2.jpeg", aspect: "4 / 3", alt: "ต้องการเงินด่วน", eyebrow: "ต้องการเงินด่วน?", headline: "จ่ายเงินสดทันที ไม่ต้องรอ", sub: "ส่งภาพพระมาให้เราประเมินราคา ตอบไวทันใจ", ctaLabel: "ทักไลน์ด่วน" },
      { type: "video", mediaUrl: "/media/hero/video-3.webm", aspect: "9 / 16", eyebrow: "รับซื้อทุกประเภท", headline: "พระเครื่อง วัตถุมงคล ของเก่าของโบราณ", sub: "พระเหรียญ พระผง พระสมเด็จ พระปิดตา พระกริ่ง และของสะสมทุกชนิด", ctaLabel: "ทักไลน์สอบถาม" },
      { type: "image", mediaUrl: "/media/hero/picture-3.jpeg", aspect: "4 / 3", alt: "ดันราคาให้สูงสุด", eyebrow: "ดันราคาให้สูงสุด", headline: "ประเมินราคาโดยทีมงานมืออาชีพ", sub: "ตรวจสอบอย่างละเอียด ตรงไปตรงมา ให้ราคาสูงสุดทุกรายการ", ctaLabel: "ทักไลน์ประเมินราคา" },
    ],
  },

  lifestyle_banner: {
    videoUrl: "/media/hero/video-5.webm",
    imageUrl: "/media/hero/picture-4.jpeg",
  },

  campaign_cta: {
    heading: "ต้องการเงินด่วน?",
    sub: "ส่งรูปพระมาให้เราประเมินราคาฟรี ไม่มีค่าใช้จ่าย ไม่มีข้อผูกมัด",
    ctaLabel: "ทักไลน์เลย",
  },

  story: {
    heading: "จุดเริ่มต้นของ เบ๊บบางมด",
    body: "เบ๊บบางมด ก่อตั้งขึ้นเพื่อเป็นที่พึ่งสำหรับผู้ที่ต้องการปล่อยพระเครื่อง พระบูชา วัตถุมงคล หรือของสะสม ไม่ว่าจะเป็นของที่เลิกสะสม เลิกเก็บ หรือพระมรดกตกทอดที่อยากส่งต่อให้ผู้อื่นได้บูชาต่อ เราให้ราคาที่เป็นธรรม ตรงไปตรงมา และจ่ายเงินสดทันทีเมื่อตกลงกันแล้ว",
    points: [
      "ตรวจสอบและตีราคาอย่างตรงไปตรงมา ไม่กดราคา",
      "จ่ายเงินสดทันทีเมื่อตกลงราคากันแล้ว",
      "บริการรับซื้อถึงที่ ทั่วกรุงเทพฯ และต่างจังหวัด",
    ],
    videoUrl: "/media/hero/video-6.webm",
    imageUrl: "/media/hero/picture-5.jpeg",
  },

  curated: {
    bundles: [
      { label: "เลิกสะสม เลิกเก็บ พระมรดกตกทอด", ctaLabel: "ทักไลน์ปรึกษาฟรี", imageUrl: "/media/hero/picture-6.jpeg", videoUrl: "/media/hero/video-7.webm" },
      { label: "ต้องการเงินด่วน ส่งรูปตีราคาได้เลย", ctaLabel: "ทักไลน์ด่วน", imageUrl: "/media/hero/picture-7.jpeg", videoUrl: null },
    ],
  },

  authenticity: {
    heading: "โปร่งใสทุกขั้นตอน ดันราคาให้สูงสุด",
    body: "ตั้งแต่หลักร้อยถึงหลักล้าน เราตีราคาตามมูลค่าจริงของแต่ละองค์ ไม่กดราคา และไม่มีขั้นตอนที่ซับซ้อน สะดวก รวดเร็ว และปลอดภัยในทุกขั้นตอน",
    steps: [
      "ส่งรูปพระมาให้เราประเมินราคาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย",
      "ตรวจสอบและตีราคาอย่างตรงไปตรงมาโดยทีมงาน",
      "จ่ายเงินสดทันทีเมื่อตกลงราคากันแล้ว",
    ],
    note: "มีข้อสงสัยเรื่องราคาหรือขั้นตอนการรับเช่า ทักไลน์สอบถามได้ทันที ทีมงานตอบไว",
    videoUrl: "/media/hero/video-4.webm",
    imageUrl: "/media/hero/picture-4.jpeg",
  },

  spotlight: {
    heading: "รายการที่รับซื้อ",
    sub: "พระเครื่อง วัตถุมงคล ของเก่าของโบราณ และของสะสมทุกชนิด",
    items: spotlightLabels.map((label, i) => ({
      label,
      photoUrl: `/media/products/product-${(i % PRODUCT_PHOTO_COUNT) + 1}.png`,
    })),
  },

  testimonials: {
    items: [
      { initials: "ส.ท.", name: "คุณสมชาย ท.", quote: "ส่งรูปไปตอนเช้า ทางร้านตอบกลับไวมาก ตีราคาให้เป็นธรรม ไม่กดราคา นัดมารับถึงบ้านและจ่ายเงินสดทันที" },
      { initials: "พ.ก.", name: "คุณพิมพ์ กมล", quote: "มีพระมรดกของคุณพ่อที่อยากปล่อยให้คนอื่นได้บูชาต่อ ทีมงานอธิบายขั้นตอนชัดเจน ไม่เร่งให้ตัดสินใจ" },
      { initials: "อ.ว.", name: "คุณอนุชา ว.", quote: "เลิกสะสมแล้วอยากปล่อยของทั้งหมดในคราวเดียว สะดวกมาก ไม่ต้องเดินทางไปที่ร้านเอง บริการประทับใจ" },
    ],
  },

  faq: {
    items: [
      { question: "ต้องส่งรูปแบบไหนให้ตีราคา", answer: "ถ่ายรูปด้านหน้าและด้านหลังขององค์พระให้เห็นรายละเอียดชัดเจน ส่งมาทางไลน์ได้เลย ทีมงานจะตอบกลับพร้อมราคาประเมินเบื้องต้นอย่างรวดเร็ว" },
      { question: "ตีราคาเป็นธรรมแค่ไหน มีขั้นต่ำหรือเปล่า", answer: "ตีราคาตามมูลค่าจริงของแต่ละองค์ ตั้งแต่หลักร้อยถึงหลักล้าน ไม่มีการกดราคา และแจ้งราคาชัดเจนก่อนตกลงทุกครั้ง" },
      { question: "รับซื้อถึงบ้านไหม พื้นที่ไหนบ้าง", answer: "รับซื้อถึงที่ทั่วกรุงเทพฯ และต่างจังหวัด สะดวก รวดเร็ว และปลอดภัย นัดหมายวันเวลาที่สะดวกได้ทางไลน์" },
      { question: "จ่ายเงินอย่างไร เร็วแค่ไหน", answer: "จ่ายเงินสดทันทีเมื่อตกลงราคากันแล้ว ไม่ต้องรอโอนหรือรอคิว" },
      { question: "รับซื้อของประเภทไหนบ้าง", answer: "รับเช่าพระเครื่อง พระบูชา วัตถุมงคล เครื่องราง เหรียญคณาจารย์นิยม รวมถึงของเก่าของโบราณและของสะสมทุกชนิด" },
    ],
  },

  cta_footer: {
    heading: "ต้องการปล่อยพระด่วน? ทักไลน์วันนี้",
    sub: "ส่งรูปพระมาให้เราประเมินราคา ตอบไว จ่ายเงินสดทันที",
  },

  site_settings: {
    brandNameTh: "เบ๊บบางมด",
    brandNameEn: "BABEBANGMOD",
    businessDescriptorTh: "รับเช่าพระเครื่อง",
    tagline: "ส่งรูปพระมาตีราคา ตอบไว ให้ราคาสูงสุด",
    description: "เบ๊บบางมด รับเช่าพระเครื่อง พระบูชา วัตถุมงคล และของสะสมทุกชนิด การันตีราคาเป็นธรรม จ่ายเงินสดทันที บริการรับซื้อถึงที่ทั่วกรุงเทพฯ และต่างจังหวัด",
    lineId: "@babebangmod",
    lineUrl: "https://lin.ee/mUBDRoY",
    phone: "062-946-2451",
    facebookUrl: "https://www.facebook.com/Babebangmod",
    facebookName: "เบ๊บบางมด-รับเช่าพระเครื่อง",
    instagramUrl: "https://instagram.com/babebangmod",
  },
};

const rows = Object.entries(sections).map(([key, content]) => ({
  key,
  draft: content,
  published: content,
}));

const { error } = await supabase.from("page_sections").upsert(rows);
if (error) throw error;
console.log(`Seeded ${rows.length} sections: ${rows.map((r) => r.key).join(", ")}`);
