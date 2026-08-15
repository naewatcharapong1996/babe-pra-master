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
 * - mode="alternate" (default): holds on the image first, then plays the
 *   video once, then back to the image, cycling indefinitely.
 * - mode="loop": the video loops continuously on its own; the image is only
 *   ever shown if the video fails to load/decode.
 *
 * Reduced-motion always shows the static image only, in both modes.
 *
 * Playback is gated on scroll visibility with two IntersectionObserver
 * thresholds so off-screen instances don't all autoplay (or download) at
 * once on page load:
 * - "primed" fires ~600px before the section reaches the viewport — the
 *   video starts buffering (preload="auto") ahead of time so there's no
 *   loading flash by the time it's actually seen.
 * - "inView" fires once the section is actually visible — only then does
 *   playback start; it pauses again once scrolled back out.
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
  // "loop" mode has no picture phase to start on (the image is only an
  // error fallback), so it still starts on the video; "alternate" mode now
  // starts on the image and cycles to video after the dwell timer below.
  const [showingVideo, setShowingVideo] = useState(mode === "loop");
  const [videoFailed, setVideoFailed] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [primed, setPrimed] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const primeObserver = new IntersectionObserver(
      ([entry]) => setPrimed(entry.isIntersecting),
      { rootMargin: "600px 0px", threshold: 0 },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    primeObserver.observe(node);
    playObserver.observe(node);
    return () => {
      primeObserver.disconnect();
      playObserver.disconnect();
    };
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
        preload={primed ? "auto" : "none"}
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
