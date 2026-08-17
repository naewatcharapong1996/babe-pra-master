import Image from "next/image";
import { LineButton } from "../line-modal";
import { MediaSlideshow } from "../media-slideshow";
import { cardShadowClassName, cardShadowHoverClassName } from "@/lib/card-shadow";

type Bundle = {
  label: string;
  ctaLabel: string;
  description?: string;
  tagLabel?: string;
  pinLabel?: string;
  footerName?: string;
  footerMeta?: string;
  imageUrl: string;
  videoUrl?: string | null;
};

// overflow-hidden must NOT live on this shadowed element — overflow clips an
// element's own outer box-shadow, which was cutting the shadow off flush
// against the rounded edge (worst at the bottom). It's applied one level
// down instead, on a plain wrapper with no shadow of its own.
const cutoutCardSurfaceClassName =
  `group/cutout relative flex flex-col self-start rounded-[28px] border border-taupe/40 bg-bone text-onyx ${cardShadowClassName} ` +
  `transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-taupe/70 ${cardShadowHoverClassName}`;

// Concave corner mask (cult-ui's "cutout card" motif): placed in mirrored
// pairs around a badge's rounded corner so the badge reads as notched into
// the media instead of just sitting on top of it.
const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

function CutoutCorner({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" width={size} height={size} className={className}>
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  );
}

// Fixed at 3 cards (1 per bundle) — a plain responsive grid, no
// scroll/carousel chrome, since there's never anything to scroll to.
export function CuratedSection({ bundles }: { bundles: Bundle[] }) {
  return (
    <section id="curated" className="px-4 py-8 lg:px-8">
      <h2 className="mb-4 font-display text-xl font-bold text-onyx">ไม่ว่าจะกรณีไหน เรารับฟัง</h2>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <LineButton
            key={`${bundle.imageUrl}-${bundle.videoUrl ?? "none"}`}
            className={cutoutCardSurfaceClassName}
          >
            {/* Clips media/rounded corners without clipping the outer
                element's own shadow (see note on cutoutCardSurfaceClassName). */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-[28px]">
              {/* Media */}
              <div className="relative h-72 overflow-hidden lg:h-80">
                {bundle.videoUrl ? (
                  // mode="loop": the video just plays on its own loop — the
                  // image is only ever shown as a decode-failure fallback, so
                  // a single card never visibly cycles between two media.
                  <MediaSlideshow
                    videoSrc={bundle.videoUrl}
                    imageSrc={bundle.imageUrl}
                    imageAlt={bundle.label}
                    mode="loop"
                  />
                ) : (
                  <Image
                    src={bundle.imageUrl}
                    alt={bundle.label}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105"
                  />
                )}

                {/* Soft fade to the card surface tone, not a dark vignette —
                    the badges below carry their own solid background for
                    contrast. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bone/40 via-bone/5 to-transparent"
                />

                {bundle.tagLabel ? (
                  <div className="pointer-events-none absolute bottom-0 left-0 rounded-tr-[20px] bg-bone px-5 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-onyx/60">
                      {bundle.tagLabel}
                    </span>
                    <CutoutCorner className="absolute -right-[31px] -bottom-px rotate-90 text-bone" />
                    <CutoutCorner className="absolute -top-[31px] -left-px rotate-90 text-bone" />
                  </div>
                ) : null}

                {bundle.pinLabel ? (
                  <div className="absolute right-0 top-0 rounded-bl-[16px] bg-crimson px-4 py-2 text-sm font-semibold text-bone shadow-md ring-1 ring-bone/20">
                    {bundle.pinLabel}
                    <CutoutCorner size={24} className="absolute top-0 -left-[23px] -rotate-90 text-crimson" />
                    <CutoutCorner size={24} className="absolute -bottom-[23px] right-0 -rotate-90 text-crimson" />
                  </div>
                ) : null}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-balance font-display text-xl font-bold leading-snug text-onyx">
                  {bundle.label}
                </h3>
                {bundle.description ? (
                  <p className="mb-4 text-pretty text-sm leading-relaxed text-onyx/60">{bundle.description}</p>
                ) : null}

                {bundle.footerName || bundle.footerMeta ? (
                  <div className="flex items-center justify-between border-t border-taupe/30 pt-4">
                    {bundle.footerName ? (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 flex-none rounded-full bg-gradient-to-br from-crimson to-gold ring-2 ring-bone" />
                        <span className="text-sm font-medium text-onyx">{bundle.footerName}</span>
                      </div>
                    ) : (
                      <span />
                    )}
                    {bundle.footerMeta ? (
                      <span className="text-xs tabular-nums text-onyx/50">{bundle.footerMeta}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Floating action — reveals on hover like the reference on
                pointer-capable screens; stays visible on touch, where hover
                never fires, so the CTA affordance isn't lost on mobile. */}
            <span className="absolute bottom-5 right-5 inline-flex translate-y-0 items-center rounded-full bg-crimson px-4 py-2 text-sm font-medium text-bone opacity-100 shadow-md transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-y-2 lg:opacity-0 lg:group-hover/cutout:translate-y-0 lg:group-hover/cutout:opacity-100">
              {bundle.ctaLabel}
            </span>
          </LineButton>
        ))}
      </div>
    </section>
  );
}
