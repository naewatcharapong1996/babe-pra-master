"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FacebookIcon,
  HelpIcon,
  LineIcon,
  PhoneIcon,
} from "./icons";
import { LineButton } from "./line-modal";
import { Logo } from "./logo";
import { siteConfig } from "@/lib/site-config";

type PrimaryItem =
  | { label: string; href: string; subPanelId?: undefined }
  | { label: string; subPanelId: string; href?: undefined };

const primaryItems: PrimaryItem[] = [
  { label: "เรื่องราวของเรา", href: "#story" },
  { label: "การันตีของแท้", href: "#authenticity" },
  { label: "รีวิวลูกค้า", href: "#testimonials" },
  { label: "คำถามที่พบบ่อย", href: "#faq" },
];

// No primary item currently drills into a sub-panel, but the drill-down
// mechanism (activePanelId, focus trap, back button) is kept in place below
// since it's generic and cheap to keep working if a future item needs it.
const subPanels: { id: string; title: string; items: { label: string; href: string }[] }[] = [];

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null);
}

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [slid, setSlid] = useState(false);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  const level0Ref = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Mount immediately on open; unmount only after the close transition ends
  // (handleLevel0TransitionEnd) so the slide-out animation gets to play.
  // Adjusted during render (not an effect) per React's "previous prop" pattern,
  // since setState-in-effect here would cascade an extra render for no benefit.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
    } else {
      setSlid(false);
      setActivePanelId(null);
    }
  }

  // Capture whatever had focus before the drawer opened, so it can be
  // restored on close. A ref write belongs in an effect, not render.
  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Flip to the slid-in position on the next frame so the browser paints the
  // off-screen starting position first — otherwise there's nothing to animate from.
  useEffect(() => {
    if (mounted && open) {
      const raf = requestAnimationFrame(() => setSlid(true));
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
      const t = setTimeout(() => closeBtnRef.current?.focus(), 300);
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
      if (e.key !== "Tab") return;

      const activeContainer = activePanelId
        ? document.getElementById(`drawer-panel-${activePanelId}`)
        : level0Ref.current;
      if (!activeContainer) return;

      const focusables = focusableElements(activeContainer);
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
  }, [mounted, activePanelId, onClose]);

  function handleLevel0TransitionEnd() {
    if (!open) setMounted(false);
  }

  if (!mounted) return null;

  return (
    <div id="mobile-nav-drawer" className="fixed inset-0 z-[60]">
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-onyx transition-opacity duration-300 ease-out ${
          slid ? "opacity-50" : "opacity-0"
        }`}
      />

      <div className="absolute inset-y-0 right-0 w-[88vw] max-w-[400px] overflow-hidden">
        <div
          ref={level0Ref}
          role="dialog"
          aria-modal="true"
          aria-label="เมนูหลัก"
          inert={activePanelId ? true : undefined}
          onTransitionEnd={handleLevel0TransitionEnd}
          className={`absolute inset-0 flex flex-col bg-bone transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            slid ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-taupe/30 px-4 py-3">
            <span className="flex items-center gap-2">
              <Logo className="h-8 w-auto rounded-lg" />
              <span className="font-display text-base font-semibold text-onyx">
                {siteConfig.brandNameTh}
              </span>
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="ปิดเมนู"
              className="p-1.5 text-onyx"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-taupe/30">
              {primaryItems.map((item) =>
                item.subPanelId ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setActivePanelId(item.subPanelId)}
                      className="flex w-full items-center justify-between px-4 py-5 text-left text-base font-bold text-onyx"
                    >
                      {item.label}
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-onyx/60" />
                    </button>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="block px-4 py-5 text-base font-bold text-onyx"
                    >
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>

            <div className="border-t border-taupe/30">
              <LineButton onClick={onClose} className="flex items-center gap-3 px-4 py-5">
                <LineIcon className="h-6 w-6 shrink-0 text-crimson" />
                <span className="text-base font-bold text-onyx">
                  ทักไลน์ {siteConfig.lineId}
                </span>
              </LineButton>
            </div>

            {/* Trust/promo block: explicit dark-section rule — bg-onyx text-bone */}
            <div className="mx-4 my-5 rounded-2xl bg-onyx px-4 py-5">
              <p className="text-sm leading-relaxed text-bone/70">
                ส่งรูปพระมาให้เราประเมินราคาฟรี ตอบไว จ่ายเงินสดทันที{" "}
                <a
                  href="#authenticity"
                  onClick={onClose}
                  className="text-gold underline hover:opacity-70"
                >
                  ดูเพิ่มเติม
                </a>
              </p>
              <div className="mt-4 flex gap-3">
                <LineButton
                  onClick={onClose}
                  className="flex-1 rounded-full bg-crimson py-3 text-center text-sm font-medium text-bone transition-colors hover:bg-crimson-dark"
                >
                  ทักไลน์สอบถาม
                </LineButton>
                <a
                  href="#testimonials"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-bone/30 py-3 text-center text-sm font-medium text-bone"
                >
                  ดูรีวิว
                </a>
              </div>
            </div>

            <ul className="divide-y divide-taupe/30 border-t border-taupe/30 pb-6">
              <li>
                <a
                  href="#faq"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <HelpIcon className="h-5 w-5 shrink-0 text-onyx/60" />
                  <span className="text-sm text-onyx">ความช่วยเหลือ</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <PhoneIcon className="h-5 w-5 shrink-0 text-onyx/60" />
                  <span className="text-sm text-onyx">{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <FacebookIcon className="h-5 w-5 shrink-0 text-onyx/60" />
                  <span className="text-sm text-onyx">{siteConfig.social.facebookName}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold text-onyx/60">
                    IG
                  </span>
                  <span className="text-sm text-onyx">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {subPanels.map((panel) => (
          <div
            key={panel.id}
            id={`drawer-panel-${panel.id}`}
            role="dialog"
            aria-modal="true"
            aria-label={panel.title}
            inert={activePanelId === panel.id ? undefined : true}
            className={`absolute inset-0 bg-bone transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activePanelId === panel.id ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center gap-3 border-b border-taupe/30 px-4 py-3">
              <button
                type="button"
                onClick={() => setActivePanelId(null)}
                aria-label="ย้อนกลับ"
                className="p-1.5 text-onyx"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-base font-bold text-onyx">{panel.title}</span>
            </div>
            <ul className="divide-y divide-taupe/30 overflow-y-auto">
              {panel.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="block px-4 py-4 text-sm text-onyx"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
