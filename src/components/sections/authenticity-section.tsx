import { CheckIcon, ShieldIcon } from "../icons";
import { MediaSlideshow } from "../media-slideshow";

export function AuthenticitySection({
  heading,
  body,
  steps,
  note,
  videoUrl,
  imageUrl,
}: {
  heading: string;
  body: string;
  steps: string[];
  note: string;
  videoUrl: string;
  imageUrl: string;
}) {
  return (
    <section id="authenticity" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            การันตีราคาเป็นธรรม
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">{heading}</h2>
          <p className="mt-6 text-base leading-relaxed text-onyx/70 sm:text-lg">{body}</p>

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
            <p className="text-sm text-onyx/70">{note}</p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <MediaSlideshow videoSrc={videoUrl} imageSrc={imageUrl} mode="loop" />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden h-24 w-24 items-center justify-center rounded-2xl border border-taupe/30 bg-bone shadow-lg sm:flex">
            <CheckIcon className="h-10 w-10 text-crimson" />
          </div>
        </div>
      </div>
    </section>
  );
}
