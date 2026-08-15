import { LineButton } from "../line-modal";

export function CampaignCta() {
  return (
    <section className="px-4 pt-8 text-center lg:px-8">
      <h2 className="font-display text-3xl font-extrabold tracking-tight text-onyx lg:text-4xl">
        ต้องการเงินด่วน?
      </h2>
      <p className="mx-auto mt-3 max-w-md text-onyx/70">
        ส่งรูปพระมาให้เราประเมินราคาฟรี ไม่มีค่าใช้จ่าย ไม่มีข้อผูกมัด
      </p>
      <LineButton className="mt-5 inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark">
        ทักไลน์เลย
      </LineButton>
    </section>
  );
}
