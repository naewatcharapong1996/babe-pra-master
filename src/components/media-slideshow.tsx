"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/use-media-query";

const IMAGE_DWELL_MS = 5000;

/**
 * Ambient supporting media — a short video paired with a fallback image, no
 * visible controls (this is background/supporting media, not a primary
 * navigable carousel like the hero).
 *
 * - mode="alternate" (default): plays the video once, then holds on the
 *   image for a few seconds, then loops back to the video.
 * - mode="loop": the video loops continuously on its own; the image is only
 *   ever shown if the video fails to load/decode.
 *
 * Reduced-motion always shows the static image only, in both modes.
 *
 * Playback is gated on scroll visibility (IntersectionObserver) so that
 * off-screen instances don't all autoplay at once on page load — each one
 * only starts once it actually scrolls into view, and pauses when it
 * scrolls back out.
 */
export function MediaSlideshow({
  videoSrc,
  imageSrc,
  imageAlt = "",
  mediaClassName = "object-cover",
  mode = "alternate",
}: {
  videoSrc: string;
  imageSrc: string;
  imageAlt?: string;
  mediaClassName?: string;
  mode?: "alternate" | "loop";
}) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [showingVideo, setShowingVideo] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mode !== "alternate" || reducedMotion || videoFailed || showingVideo || !inView) return;
    const timer = setTimeout(() => {
      setCycle((c) => c + 1);
      setShowingVideo(true);
    }, IMAGE_DWELL_MS);
    return () => clearTimeout(timer);
  }, [mode, showingVideo, reducedMotion, videoFailed, inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, cycle]);

  const playVideo = showingVideo && !reducedMotion && !videoFailed;

  if (!playVideo) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <Image src={imageSrc} alt={imageAlt} fill sizes="100vw" className={mediaClassName} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        key={cycle}
        ref={videoRef}
        className={`h-full w-full ${mediaClassName}`}
        muted
        playsInline
        preload="none"
        autoPlay={inView}
        loop={mode === "loop"}
        onEnded={mode === "alternate" ? () => setShowingVideo(false) : undefined}
        onError={() => setVideoFailed(true)}
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    </div>
  );
}
