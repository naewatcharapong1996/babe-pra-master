import { LineIcon, PhoneIcon } from "../icons";
import { LineButton } from "../line-modal";
import { siteConfig } from "@/lib/site-config";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-onyx py-20 text-center text-bone sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.25),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          ต้องการปล่อยพระด่วน? ทักไลน์วันนี้
        </h2>
        <p className="mt-4 text-bone/70">
          ส่งรูปพระมาให้เราประเมินราคา ตอบไว จ่ายเงินสดทันที
        </p>
        <LineButton className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-crimson px-8 py-4 text-base font-semibold text-bone transition-colors hover:bg-crimson-dark">
          <LineIcon className="h-5 w-5" />
          ทักไลน์ {siteConfig.lineId}
        </LineButton>
        <a
          href={siteConfig.phoneHref}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-bone/70 hover:text-gold"
        >
          <PhoneIcon className="h-4 w-4" />
          หรือโทร {siteConfig.phone}
        </a>
      </div>
    </section>
  );
}
