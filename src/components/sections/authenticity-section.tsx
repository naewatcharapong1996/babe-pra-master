import { CheckIcon, ShieldIcon } from "../icons";
import { MediaSlideshow } from "../media-slideshow";

const steps = [
  "ส่งรูปพระมาให้เราประเมินราคาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย",
  "ตรวจสอบและตีราคาอย่างตรงไปตรงมาโดยทีมงาน",
  "จ่ายเงินสดทันทีเมื่อตกลงราคากันแล้ว",
];

export function AuthenticitySection() {
  return (
    <section id="authenticity" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            การันตีราคาเป็นธรรม
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">
            โปร่งใสทุกขั้นตอน ดันราคาให้สูงสุด
          </h2>
          <p className="mt-6 text-base leading-relaxed text-onyx/70 sm:text-lg">
            ตั้งแต่หลักร้อยถึงหลักล้าน เราตีราคาตามมูลค่าจริงของแต่ละองค์
            ไม่กดราคา และไม่มีขั้นตอนที่ซับซ้อน สะดวก รวดเร็ว และปลอดภัยในทุกขั้นตอน
          </p>

          <ul className="mt-8 space-y-4">
            {steps.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-onyx text-gold">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-onyx">{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-taupe/30 bg-taupe/10 p-4">
            <ShieldIcon className="h-8 w-8 flex-none text-crimson" />
            <p className="text-sm text-onyx/70">
              มีข้อสงสัยเรื่องราคาหรือขั้นตอนการรับเช่า ทักไลน์สอบถามได้ทันที ทีมงานตอบไว
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <MediaSlideshow
              videoSrc="/media/hero/video-4.webm"
              imageSrc="/media/hero/picture-4.jpeg"
              mode="loop"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden h-24 w-24 items-center justify-center rounded-2xl border border-taupe/30 bg-bone shadow-lg sm:flex">
            <CheckIcon className="h-10 w-10 text-crimson" />
          </div>
        </div>
      </div>
    </section>
  );
}
