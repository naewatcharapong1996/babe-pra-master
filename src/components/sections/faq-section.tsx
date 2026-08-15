import { faqItems } from "@/lib/faq-data";
import { ChevronDownIcon } from "../icons";

export function FaqSection() {
  return (
    <section id="faq" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            คำถามที่พบบ่อย
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">
            ข้อสงสัยก่อนตัดสินใจ
          </h2>
        </div>

        <div className="mt-12 divide-y divide-taupe/30 rounded-3xl border border-taupe/30 bg-taupe/10">
          {faqItems.map((item) => (
            <details key={item.question} className="group p-6 open:bg-bone">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-onyx marker:content-none">
                {item.question}
                <ChevronDownIcon className="h-5 w-5 flex-none text-onyx/60 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-onyx/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
