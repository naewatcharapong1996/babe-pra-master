import { MediaSlideshow } from "../media-slideshow";

export function LifestyleBanner() {
  return (
    <section className="px-4 pt-4 lg:px-8">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-[21/9]">
        <MediaSlideshow
          videoSrc="/media/hero/video-5.webm"
          imageSrc="/media/hero/picture-4.jpeg"
        />
      </div>
    </section>
  );
}
