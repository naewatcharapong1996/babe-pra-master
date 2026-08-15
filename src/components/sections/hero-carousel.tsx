"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, LineIcon } from "../icons";
import { LineButton } from "../line-modal";
import { useMediaQuery } from "@/lib/use-media-query";

const IMAGE_DWELL_MS = 5000;
// Shown in place of any video slide whose source fails to load/decode
// (e.g. Safari has no WebM support) — a static image beats a blank box.
const VIDEO_FALLBACK_SRC = "/media/hero/picture-4.jpeg";
const VIDEO_FALLBACK_ASPECT = "4 / 3";

type Slide = {
  type: "video" | "image";
  src: string;
  /** True aspect ratio of the source media, used to size the desktop floating panel with zero crop. */
  aspect: string;
  alt?: string;
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
};

// Alternates video -> picture -> video -> picture ... then loops back to slide 1.
// Every slide's CTA is the same LINE contact action on purpose — the hero's
// only job is "get them to send a photo"; browsing lives further down the page.
const slides: Slide[] = [
  {
    type: "video",
    src: "/media/hero/video-1.webm",
    aspect: "9 / 16",
    eyebrow: "รับเช่าพระเครื่อง พระบูชา วัตถุมงคล",
    headline: "ส่งรูปพระ มาตีราคาได้เลย",
    sub: "ตอบไว รวดเร็ว ให้ราคาสูงสุด จ่ายเงินสดทันที",
    ctaLabel: "ทักไลน์ส่งรูปประเมินราคา",
  },
  {
    type: "image",
    src: "/media/hero/picture-1.jpeg",
    aspect: "4 / 3",
    alt: "เลิกสะสม พระมรดกตกทอด",
    eyebrow: "เลิกสะสม พระมรดกตกทอด",
    headline: "มีพระเครื่องต้องการปล่อย?",
    sub: "การันตีราคาเป็นธรรม ตั้งแต่หลักร้อยถึงหลักล้าน",
    ctaLabel: "ทักไลน์เลย",
  },
  {
    type: "video",
    src: "/media/hero/video-2.webm",
    aspect: "9 / 16",
    eyebrow: "บริการถึงที่",
    headline: "รับซื้อพระถึงบ้าน",
    sub: "สะดวก รวดเร็ว ปลอดภัย ทั่วกรุงเทพฯ และต่างจังหวัด",
    ctaLabel: "ทักไลน์นัดหมาย",
  },
  {
    type: "image",
    src: "/media/hero/picture-2.jpeg",
    aspect: "4 / 3",
    alt: "ต้องการเงินด่วน",
    eyebrow: "ต้องการเงินด่วน?",
    headline: "จ่ายเงินสดทันที ไม่ต้องรอ",
    sub: "ส่งภาพพระมาให้เราประเมินราคา ตอบไวทันใจ",
    ctaLabel: "ทักไลน์ด่วน",
  },
  {
    type: "video",
    src: "/media/hero/video-3.webm",
    aspect: "9 / 16",
    eyebrow: "รับซื้อทุกประเภท",
    headline: "พระเครื่อง วัตถุมงคล ของเก่าของโบราณ",
    sub: "พระเหรียญ พระผง พระสมเด็จ พระปิดตา พระกริ่ง และของสะสมทุกชนิด",
    ctaLabel: "ทักไลน์สอบถาม",
  },
  {
    type: "image",
    src: "/media/hero/picture-3.jpeg",
    aspect: "4 / 3",
    alt: "ดันราคาให้สูงสุด",
    eyebrow: "ดันราคาให้สูงสุด",
    headline: "ประเมินราคาโดยทีมงานมืออาชีพ",
    sub: "ตรวจสอบอย่างละเอียด ตรงไปตรงมา ให้ราคาสูงสุดทุกรายการ",
    ctaLabel: "ทักไลน์ประเมินราคา",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Browser-level capability, not per-slide: once one video source fails
  // (e.g. no WebM support), every other video slide would fail identically,
  // so this permanently switches all video slides to the fallback image.
  const [videoUnsupported, setVideoUnsupported] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  function goToNext() {
    setIndex((i) => (i + 1) % slides.length);
  }

  function handleVideoError() {
    setVideoUnsupported(true);
  }

  const slide = slides[index];
  const showVideoFallback = slide.type === "video" && videoUnsupported;

  // Image slides (and video slides that fell back to a static image)
  // advance on a fixed timer; playable video slides advance on their own
  // 'ended' event instead (wired on the foreground <video> below).
  useEffect(() => {
    if (paused || reducedMotion) return;
    if (slide.type === "video" && !showVideoFallback) return;
    const timer = setTimeout(goToNext, IMAGE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, slide.type, showVideoFallback]);

  useEffect(() => {
    for (const ref of [videoRef, bgVideoRef]) {
      const video = ref.current;
      if (!video) continue;
      if (paused) {
        video.pause();
      } else if (!reducedMotion) {
        video.play().catch(() => {});
      }
    }
  }, [paused, reducedMotion, index]);

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="แคมเปญเด่น"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-onyx text-bone lg:min-h-0 lg:aspect-[21/9]"
    >
      {/* Desktop only: blurred, dimmed full-bleed copy of the same media as
          ambient background, so the real media below can be shown uncropped
          at its true aspect ratio instead of being cover-cropped into a sliver. */}
      {isDesktop &&
        (slide.type === "video" && !showVideoFallback ? (
          <video
            key={`bg-${index}`}
            ref={bgVideoRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
            muted
            loop
            playsInline
            preload="auto"
            autoPlay={!paused && !reducedMotion}
            onError={handleVideoError}
          >
            <source src={slide.src} type="video/webm" />
          </video>
        ) : (
          <Image
            key={`bg-${index}`}
            src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-50 blur-2xl"
          />
        ))}

      {isDesktop ? (
        <div className="absolute inset-0 flex items-start justify-center px-8 pb-32 pt-16 xl:px-16">
          <div
            className="relative h-full max-w-[85%] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-bone/10"
            style={{ aspectRatio: showVideoFallback ? VIDEO_FALLBACK_ASPECT : slide.aspect }}
          >
            {slide.type === "video" && !showVideoFallback ? (
              <video
                key={index}
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                preload="auto"
                autoPlay={!paused && !reducedMotion}
                onEnded={goToNext}
                onError={handleVideoError}
              >
                <source src={slide.src} type="video/webm" />
              </video>
            ) : (
              <Image
                key={index}
                src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.src}
                alt={showVideoFallback ? slide.eyebrow : (slide.alt ?? "")}
                fill
                sizes="85vw"
                className="object-cover"
                priority={index === 0}
              />
            )}
          </div>
        </div>
      ) : slide.type === "video" && !showVideoFallback ? (
        <video
          key={index}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          autoPlay={!paused && !reducedMotion}
          onEnded={goToNext}
          onError={handleVideoError}
        >
          <source src={slide.src} type="video/webm" />
        </video>
      ) : (
        <Image
          key={index}
          src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.src}
          alt={showVideoFallback ? slide.eyebrow : (slide.alt ?? "")}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent"
      />

      <div className="relative p-4 pb-10 sm:p-8 lg:p-12">
        <span className="inline-block bg-bone/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur">
          {slide.eyebrow}
        </span>
        <h1 className="mt-3 max-w-lg font-display text-4xl font-bold leading-tight sm:text-5xl">
          {slide.headline}
        </h1>
        <p className="mt-2 max-w-md text-sm text-bone/75 sm:text-base">{slide.sub}</p>
        <LineButton className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark">
          <LineIcon className="h-4 w-4" />
          {slide.ctaLabel}
        </LineButton>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3">
        <button
          type="button"
          aria-label="สไลด์ก่อนหน้า"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bone/10 hover:bg-bone/20"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="เลือกสไลด์">
          {slides.map((s, i) => (
            <button
              key={s.headline}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`สไลด์ ${i + 1} จาก ${slides.length}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-bone" : "w-1.5 bg-bone/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="สไลด์ถัดไป"
          onClick={goToNext}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bone/10 hover:bg-bone/20"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
