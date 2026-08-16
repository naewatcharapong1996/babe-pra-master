import { MediaSlideshow } from "../media-slideshow";

export function LifestyleBanner({ videoUrl, imageUrl }: { videoUrl: string; imageUrl: string }) {
  return (
    <section className="px-4 pt-16 lg:px-8">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-[21/9]">
        <MediaSlideshow videoSrc={videoUrl} imageSrc={imageUrl} />
      </div>
    </section>
  );
}
