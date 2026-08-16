import Image from "next/image";
import { LineButton } from "../line-modal";
import { MediaSlideshow } from "../media-slideshow";

type Bundle = {
  label: string;
  ctaLabel: string;
  imageUrl: string;
  videoUrl?: string | null;
};

export function CuratedSection({ bundles }: { bundles: Bundle[] }) {
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
            {bundle.videoUrl ? (
              <MediaSlideshow videoSrc={bundle.videoUrl} imageSrc={bundle.imageUrl} imageAlt={bundle.label} />
            ) : (
              <Image
                src={bundle.imageUrl}
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
              {bundle.ctaLabel}
            </span>
          </LineButton>
        ))}
      </div>
    </section>
  );
}
