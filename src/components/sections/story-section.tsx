import { CheckIcon } from "../icons";
import { MediaSlideshow } from "../media-slideshow";
import { siteConfig } from "@/lib/site-config";

const credibilityPoints = [
  "ตรวจสอบและตีราคาอย่างตรงไปตรงมา ไม่กดราคา",
  "จ่ายเงินสดทันทีเมื่อตกลงราคากันแล้ว",
  "บริการรับซื้อถึงที่ ทั่วกรุงเทพฯ และต่างจังหวัด",
];

export function StorySection() {
  return (
    <section id="story" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-2">
          <MediaSlideshow
            videoSrc="/media/hero/video-6.webm"
            imageSrc="/media/hero/picture-5.jpeg"
          />
        </div>

        <div className="lg:order-1">
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            เรื่องราวของเรา
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">
            จุดเริ่มต้นของ {siteConfig.brandNameTh}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-onyx/70 sm:text-lg">
            {siteConfig.brandNameTh} ก่อตั้งขึ้นเพื่อเป็นที่พึ่งสำหรับผู้ที่ต้องการปล่อยพระเครื่อง
            พระบูชา วัตถุมงคล หรือของสะสม ไม่ว่าจะเป็นของที่เลิกสะสม เลิกเก็บ
            หรือพระมรดกตกทอดที่อยากส่งต่อให้ผู้อื่นได้บูชาต่อ
            เราให้ราคาที่เป็นธรรม ตรงไปตรงมา และจ่ายเงินสดทันทีเมื่อตกลงกันแล้ว
          </p>

          <ul className="mt-8 space-y-4">
            {credibilityPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-onyx text-gold">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-onyx">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
