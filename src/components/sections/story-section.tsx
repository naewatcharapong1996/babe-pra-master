import { CheckIcon } from "../icons";
import { MediaSlideshow } from "../media-slideshow";

export function StorySection({
  heading,
  body,
  points,
  videoUrl,
  imageUrl,
}: {
  heading: string;
  body: string;
  points: string[];
  videoUrl: string;
  imageUrl: string;
}) {
  return (
    <section id="story" className="bg-bone py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-2">
          <MediaSlideshow videoSrc={videoUrl} imageSrc={imageUrl} />
        </div>

        <div className="lg:order-1">
          <span className="text-sm font-semibold uppercase tracking-widest text-onyx/60">
            เรื่องราวของเรา
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-onyx sm:text-4xl">{heading}</h2>
          <p className="mt-6 text-base leading-relaxed text-onyx/70 sm:text-lg">{body}</p>

          <ul className="mt-8 space-y-4">
            {points.map((point) => (
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
