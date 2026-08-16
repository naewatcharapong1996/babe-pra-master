"use client";

import { create } from "zustand";
import type { SectionKey } from "@/lib/content/schema";

type SectionMeta = {
  pending: boolean;
  updatedAt: string;
  publishedAt: string | null;
};

type AdminStore = {
  sections: Partial<Record<SectionKey, SectionMeta>>;
  hydrate: (
    rows: { key: SectionKey; pending: boolean; updated_at: string; published_at: string | null }[],
  ) => void;
  setPending: (key: SectionKey, pending: boolean) => void;
  markAllPublished: () => void;
};

// Client-side mirror of the dashboard's pending/published state. Seeded from
// server data on mount (see DashboardBody), then updated optimistically by
// actions (save draft, publish) so the UI reflects the outcome immediately
// instead of waiting on a server round-trip that may not visibly refresh.
export const useAdminStore = create<AdminStore>((set) => ({
  sections: {},

  hydrate: (rows) =>
    set({
      sections: Object.fromEntries(
        rows.map((row) => [
          row.key,
          { pending: row.pending, updatedAt: row.updated_at, publishedAt: row.published_at },
        ]),
      ),
    }),

  setPending: (key, pending) =>
    set((state) => ({
      sections: {
        ...state.sections,
        [key]: { ...state.sections[key], pending, updatedAt: new Date().toISOString(), publishedAt: state.sections[key]?.publishedAt ?? null },
      },
    })),

  markAllPublished: () =>
    set((state) => ({
      sections: Object.fromEntries(
        Object.entries(state.sections).map(([key, meta]) => [
          key,
          meta ? { ...meta, pending: false, publishedAt: new Date().toISOString() } : meta,
        ]),
      ),
    })),
}));
