"use client";

import { useState } from "react";
import { CloseIcon } from "../icons";
import { siteConfig } from "@/lib/site-config";

export function PromoBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-crimson px-8 py-2 text-center text-[11px] text-bone sm:text-xs">
      <span>
        ส่งรูปพระมาให้เราตีราคาฟรีวันนี้ — {siteConfig.lineId}
      </span>
      <button
        type="button"
        aria-label="ปิดแถบโปรโมชั่น"
        onClick={() => setDismissed(true)}
        className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-bone/80 hover:bg-bone/10"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
