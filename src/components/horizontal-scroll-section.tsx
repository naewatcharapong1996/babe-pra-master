"use client";

import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export function HorizontalScrollSection({
  id,
  title,
  children,
  tone = "light",
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  }

  const isDark = tone === "dark";

  return (
    <section id={id} className={`pt-8 ${isDark ? "bg-onyx text-bone" : "text-onyx"}`}>
      <div className="flex items-center justify-between px-4 lg:px-8 mb-4">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            aria-label="เลื่อนไปทางซ้าย"
            onClick={() => scrollByPage(-1)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isDark
                ? "border-bone/25 hover:bg-bone/10"
                : "border-taupe/30 hover:bg-taupe/10"
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="เลื่อนไปทางขวา"
            onClick={() => scrollByPage(1)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isDark
                ? "border-bone/25 hover:bg-bone/10"
                : "border-taupe/30 hover:bg-taupe/10"
            }`}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-2 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
