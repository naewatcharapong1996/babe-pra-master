import { StarIcon } from "../icons";

// Sample/illustrative testimonials with anonymized initials-only names.
// Replace with real, consented customer reviews before launch.
const testimonials = [
  {
    initials: "ส.ท.",
    name: "คุณสมชาย ท.",
    quote:
      "ส่งรูปไปตอนเช้า ทางร้านตอบกลับไวมาก ตีราคาให้เป็นธรรม ไม่กดราคา นัดมารับถึงบ้านและจ่ายเงินสดทันที",
  },
  {
    initials: "พ.ก.",
    name: "คุณพิมพ์ กมล",
    quote: "มีพระมรดกของคุณพ่อที่อยากปล่อยให้คนอื่นได้บูชาต่อ ทีมงานอธิบายขั้นตอนชัดเจน ไม่เร่งให้ตัดสินใจ",
  },
  {
    initials: "อ.ว.",
    name: "คุณอนุชา ว.",
    quote: "เลิกสะสมแล้วอยากปล่อยของทั้งหมดในคราวเดียว สะดวกมาก ไม่ต้องเดินทางไปที่ร้านเอง บริการประทับใจ",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-taupe/10 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            เสียงจากลูกค้า
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">
            ความไว้วางใจที่สร้างต่อกันมา
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-taupe/30 bg-bone p-6"
            >
              <div className="flex gap-0.5 text-onyx" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-onyx">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-onyx text-xs font-semibold text-bone">
                  {t.initials}
                </span>
                <span className="text-sm font-medium text-onyx">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
