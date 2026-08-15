import Image from "next/image";
import { LineButton } from "../line-modal";
import { MediaSlideshow } from "../media-slideshow";

const bundles = [
  {
    label: "เลิกสะสม เลิกเก็บ พระมรดกตกทอด",
    cta: "ทักไลน์ปรึกษาฟรี",
    image: "/media/hero/picture-6.jpeg",
    video: "/media/hero/video-7.webm",
  },
  {
    label: "ต้องการเงินด่วน ส่งรูปตีราคาได้เลย",
    cta: "ทักไลน์ด่วน",
    image: "/media/hero/picture-7.jpeg",
    video: undefined,
  },
];

export function CuratedSection() {
  return (
    <section className="px-4 pt-8 lg:px-8">
      <h2 className="mb-4 font-display text-xl font-bold text-onyx">
        ไม่ว่าจะกรณีไหน เรารับฟัง
      </h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {bundles.map((bundle) => (
          <LineButton
            key={bundle.label}
            className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl p-3"
          >
            {bundle.video ? (
              <MediaSlideshow videoSrc={bundle.video} imageSrc={bundle.image} imageAlt={bundle.label} />
            ) : (
              <Image
                src={bundle.image}
                alt={bundle.label}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 to-transparent"
            />
            <span className="relative inline-flex items-center rounded-full bg-bone px-3 py-1.5 text-xs font-semibold text-onyx transition-colors group-hover:bg-crimson group-hover:text-bone">
              {bundle.cta}
            </span>
          </LineButton>
        ))}
      </div>
    </section>
  );
}
