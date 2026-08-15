"use client";

import { useState } from "react";
import { navLinks, siteConfig } from "@/lib/site-config";
import { LineIcon, MenuIcon } from "./icons";
import { LineButton } from "./line-modal";
import { Logo } from "./logo";
import { MobileNavDrawer } from "./mobile-nav-drawer";

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-onyx">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 text-bone">
          <Logo className="h-9 w-auto shrink-0 rounded-lg" />
          <span className="flex flex-row items-baseline gap-1.5 leading-tight md:flex-col md:items-start md:gap-0">
            <span className="font-display text-base font-semibold tracking-wide sm:text-lg">
              {siteConfig.brandNameTh}
            </span>
            <span className="text-[11px] font-medium text-bone/60">
              {siteConfig.businessDescriptorTh}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bone/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LineButton className="hidden items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-bone transition-colors hover:bg-crimson-dark md:inline-flex">
            <LineIcon className="h-4 w-4" />
            ทักไลน์สอบถาม
          </LineButton>
          <button
            type="button"
            className="-mr-1.5 p-1.5 text-bone md:hidden"
            aria-haspopup="dialog"
            aria-controls="mobile-nav-drawer"
            aria-expanded={drawerOpen}
            aria-label="เปิดเมนู"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
