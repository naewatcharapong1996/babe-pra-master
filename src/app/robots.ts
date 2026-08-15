import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// This brand wants maximum search + AI-search visibility, so every crawler is
// explicitly allowed (including AI training/citation bots) rather than the
// more common privacy-first stance of blocking them. Revisit per-bot if that
// changes.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
