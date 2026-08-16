"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeftIcon, ChevronRightIcon, LineIcon, PauseIcon, PlayIcon } from "../icons";
import { LineButton } from "../line-modal";
import { useMediaQuery } from "@/lib/use-media-query";

gsap.registerPlugin(useGSAP);

const IMAGE_DWELL_MS = 5000;
// Shown in place of any video slide whose source fails to load/decode
// (e.g. Safari has no WebM support) — a static image beats a blank box.
const VIDEO_FALLBACK_SRC = "/media/hero/picture-4.jpeg";
const VIDEO_FALLBACK_ASPECT = "4 / 3";

type Slide = {
  type: "video" | "image";
  mediaUrl: string;
  /** True aspect ratio of the source media, used to size the desktop floating panel with zero crop. */
  aspect: string;
  alt?: string;
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  // Autoplay only stops via the explicit pause button — no hover/focus
  // auto-pause, so the carousel keeps running regardless of mouse position.
  const [paused, setPaused] = useState(false);
  // Browser-level capability, not per-slide: once one video source fails
  // (e.g. no WebM support), every other video slide would fail identically,
  // so this permanently switches all video slides to the fallback image.
  const [videoUnsupported, setVideoUnsupported] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const elapsedRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [prevIndexForProgress, setPrevIndexForProgress] = useState(index);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Reset the progress ring's state at the start of render for the new
  // slide, rather than in an effect (avoids a cascading-render
  // setState-in-effect). The elapsedRef write itself still happens in an
  // effect below — refs can't be written during render.
  if (index !== prevIndexForProgress) {
    setPrevIndexForProgress(index);
    setProgress(0);
  }

  function goToNext() {
    setIndex((i) => (i + 1) % slides.length);
  }

  function goToPrev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
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

  // Progress ring around the pause/play button: tracks elapsed time toward
  // the next auto-advance. Image slides use the fixed dwell timer; playable
  // video slides sync to the video's own currentTime/duration instead.
  useEffect(() => {
    elapsedRef.current = 0;
  }, [index]);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const isPlayableVideo = slide.type === "video" && !showVideoFallback;
    let raf: number;
    let last = performance.now();
    function tick(now: number) {
      const video = videoRef.current;
      if (isPlayableVideo && video && video.duration) {
        setProgress(video.currentTime / video.duration);
      } else {
        elapsedRef.current += now - last;
        setProgress(Math.min(elapsedRef.current / IMAGE_DWELL_MS, 1));
      }
      last = now;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, reducedMotion, slide.type, showVideoFallback]);

  const ringRadius = 17;
  const ringCircumference = 2 * Math.PI * ringRadius;

  // Staggered text/CTA entrance, re-triggered on every slide change.
  // opacity + y only (compositor-friendly, per gsap-performance guidance) —
  // no layout-affecting properties, so it stays cheap even on low-end phones.
  useGSAP(
    () => {
      const targets = ["[data-hero-eyebrow]", "[data-hero-headline]", "[data-hero-sub]", "[data-hero-cta]"];
      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.6 } })
        .from("[data-hero-eyebrow]", { opacity: 0, y: 16 })
        .from("[data-hero-headline]", { opacity: 0, y: 24 }, "-=0.4")
        .from("[data-hero-sub]", { opacity: 0, y: 16 }, "-=0.4")
        .from("[data-hero-cta]", { opacity: 0, y: 16 }, "-=0.35");
    },
    { scope: contentRef, dependencies: [index, reducedMotion] },
  );

  // Every slide swap remounts a fresh <video>/<img> (needed to force the new
  // source to load from frame 0), which always needs at least one paint to
  // decode a frame — there's no way to make that instant. A single fade-in
  // on the whole media stack (not a fade-to-color-and-back pulse, which read
  // as a double flash) softens that gap into one smooth reveal.
  useGSAP(
    () => {
      if (!mediaRef.current) return;
      if (reducedMotion) {
        gsap.set(mediaRef.current, { opacity: 1 });
        return;
      }
      gsap.fromTo(mediaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power1.out" });
    },
    { dependencies: [index, reducedMotion] },
  );

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="แคมเปญเด่น"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-onyx text-bone lg:min-h-0 lg:aspect-[21/9]"
    >
      <div ref={mediaRef} className="absolute inset-0">
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
              <source src={slide.mediaUrl} type="video/webm" />
            </video>
          ) : (
            <Image
              key={`bg-${index}`}
              src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.mediaUrl}
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
                  <source src={slide.mediaUrl} type="video/webm" />
                </video>
              ) : (
                <Image
                  key={index}
                  src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.mediaUrl}
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
            <source src={slide.mediaUrl} type="video/webm" />
          </video>
        ) : (
          <Image
            key={index}
            src={showVideoFallback ? VIDEO_FALLBACK_SRC : slide.mediaUrl}
            alt={showVideoFallback ? slide.eyebrow : (slide.alt ?? "")}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        )}

        {/* Lives inside the fading media wrapper (not a static sibling) so it
            fades in sync with the media instead of staying fully opaque and
            exposing a dark gradient shape while the media underneath fades in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent"
        />
      </div>

      <div ref={contentRef} className="relative p-4 pb-10 sm:p-8 lg:p-12">
        <span
          data-hero-eyebrow
          className="inline-block bg-bone/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur"
        >
          {slide.eyebrow}
        </span>
        <h1
          data-hero-headline
          className="mt-3 max-w-lg font-display text-4xl font-bold leading-tight sm:text-5xl"
        >
          {slide.headline}
        </h1>
        <p data-hero-sub className="mt-2 max-w-md text-sm text-bone/75 sm:text-base">
          {slide.sub}
        </p>
        <LineButton
          data-hero-cta
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark"
        >
          <LineIcon className="h-4 w-4" />
          {slide.ctaLabel}
        </LineButton>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-3">
        <button
          type="button"
          aria-label="สไลด์ก่อนหน้า"
          onClick={goToPrev}
          className="hidden h-8 w-8 items-center justify-center rounded-full bg-bone/10 hover:bg-bone/20 lg:flex"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={paused ? "เล่นต่อ" : "หยุดชั่วคราว"}
          onClick={() => setPaused((p) => !p)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-bone/10 hover:bg-bone/20"
        >
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="20"
              cy="20"
              r={ringRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-bone/20"
            />
            <circle
              cx="20"
              cy="20"
              r={ringRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - progress)}
              className="text-bone"
            />
          </svg>
          {paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          aria-label="สไลด์ถัดไป"
          onClick={goToNext}
          className="hidden h-8 w-8 items-center justify-center rounded-full bg-bone/10 hover:bg-bone/20 lg:flex"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
