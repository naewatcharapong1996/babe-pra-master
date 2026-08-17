import Image from "next/image";
import { MediaSlideshow } from "../media-slideshow";
import { cardShadowClassName, cardShadowHoverClassName } from "@/lib/card-shadow";

// cult-ui's MinimalCard identity: a soft rounded frame (outer radius 24px,
// p-2 padding) around a slightly tighter inset image (radius 20px) — using
// the same shared card shadow as the curated section so every soft card on
// the page reads as one consistent surface.
const minimalCardClassName =
  `relative flex flex-col rounded-[24px] border border-taupe/40 bg-bone p-2 text-onyx ${cardShadowClassName} ` +
  `transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-taupe/70 ${cardShadowHoverClassName}`;

export function LifestyleBanner({
  videoUrl,
  imageUrl,
  videoTitle,
  videoDescription,
  imageTitle,
  imageDescription,
}: {
  videoUrl: string;
  imageUrl: string;
  videoTitle?: string;
  videoDescription?: string;
  imageTitle?: string;
  imageDescription?: string;
}) {
  return (
    <section className="px-4 pt-16 lg:px-8">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className={minimalCardClassName}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-taupe/20">
            {/* mode="loop": plays continuously — imageUrl only ever shows as
                a decode-failure fallback, this card never alternates media. */}
            <MediaSlideshow videoSrc={videoUrl} imageSrc={imageUrl} imageAlt={videoTitle} mode="loop" />
          </div>
          {videoTitle ? (
            <h3 className="mt-3 px-1 font-display text-lg font-semibold leading-tight text-onyx">{videoTitle}</h3>
          ) : null}
          {videoDescription ? (
            <p className="px-1 pb-1 pt-1 text-sm leading-relaxed text-onyx/60">{videoDescription}</p>
          ) : null}
        </div>

        <div className={minimalCardClassName}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-taupe/20">
            <Image src={imageUrl} alt={imageTitle ?? ""} fill sizes="(min-width: 640px) 45vw, 90vw" className="object-cover" />
          </div>
          {imageTitle ? (
            <h3 className="mt-3 px-1 font-display text-lg font-semibold leading-tight text-onyx">{imageTitle}</h3>
          ) : null}
          {imageDescription ? (
            <p className="px-1 pb-1 pt-1 text-sm leading-relaxed text-onyx/60">{imageDescription}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
