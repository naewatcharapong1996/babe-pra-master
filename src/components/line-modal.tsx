"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { useMediaQuery } from "@/lib/use-media-query";
import { CloseIcon, LineIcon } from "./icons";
import { Logo } from "./logo";

const LineModalContext = createContext<{ openModal: () => void } | null>(null);

function useLineModalContext() {
  const ctx = useContext(LineModalContext);
  if (!ctx) {
    throw new Error("LineButton must be rendered inside LineModalProvider");
  }
  return ctx;
}

export function LineModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <LineModalContext.Provider value={{ openModal: () => setOpen(true) }}>
      {children}
      <LineQrModal open={open} onClose={() => setOpen(false)} />
    </LineModalContext.Provider>
  );
}

/**
 * Drop-in replacement for `<a href={siteConfig.lineUrl}>`. On desktop (no
 * LINE app to deep-link into) it opens an in-page QR modal instead of
 * bouncing the visitor to LINE's web page. On mobile it navigates normally,
 * which hands off to the LINE app via the lin.ee redirect.
 */
export function LineButton({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { openModal } = useLineModalContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (isDesktop) {
      e.preventDefault();
      openModal();
    }
  }

  return (
    <a href={siteConfig.lineUrl} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null);
}

function LineQrModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Same render-phase adjustment pattern as MobileNavDrawer: mount immediately
  // on open, unmount only after the close transition ends, so the fade/scale
  // out gets to play. setState here (not in an effect) avoids an extra
  // cascading render for no benefit.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
    } else {
      setVisible(false);
    }
  }

  useEffect(() => {
    if (open) lastFocusedRef.current = document.activeElement as HTMLElement;
  }, [open]);

  useEffect(() => {
    if (mounted && open) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [mounted, open]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeBtnRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
    lastFocusedRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusables = focusableElements(dialogRef.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [mounted, onClose]);

  function handleTransitionEnd() {
    if (!open) setMounted(false);
  }

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-onyx transition-opacity duration-300 ease-out ${
          visible ? "opacity-70" : "opacity-0"
        }`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="สแกน QR เพื่อทักไลน์"
        onTransitionEnd={handleTransitionEnd}
        className={`relative w-full max-w-sm rounded-3xl bg-bone p-6 text-center shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 p-1.5 text-onyx/60 hover:text-onyx"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <Logo className="mx-auto h-10 w-auto rounded-lg" />
        <h2 className="mt-3 font-display text-xl font-bold text-onyx">สแกนเพื่อทักไลน์</h2>
        <p className="mt-1 text-sm text-onyx/70">เปิดกล้องหรือแอป LINE แล้วสแกน QR ด้านล่าง</p>

        <div className="mx-auto mt-5 w-full max-w-[220px] overflow-hidden rounded-2xl border border-taupe/30">
          <Image
            src="/media/line-qr.png"
            alt={`LINE QR code สำหรับ ${siteConfig.lineId}`}
            width={640}
            height={640}
            className="h-auto w-full"
          />
        </div>

        <p className="mt-4 text-sm text-onyx/70">
          หรือเพิ่มเพื่อน LINE ID{" "}
          <span className="font-semibold text-onyx">{siteConfig.lineId}</span>
        </p>

        <a
          href={siteConfig.lineUrl}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark"
        >
          <LineIcon className="h-4 w-4" />
          เปิดแอป LINE โดยตรง
        </a>
      </div>
    </div>
  );
}
