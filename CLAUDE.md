# Project: Amulet Personal Branding — Single-Page Site

## What this is
A single-page, mobile-first branding/advertisement site for a Thai amulet (พระเครื่อง)
personal brand, styled after nike.com's landing page structure (full-bleed hero,
bold product storytelling sections, sticky nav, strong CTA rhythm) — adapted to an
e-commerce-advertisement context rather than literal Nike content.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS, mobile-first (design at `sm:` base, scale up)
- Static/SSG-first — this is one route (`/`) plus SEO infra routes
  (`robots.txt`, `sitemap.xml`, `llms.txt`)

## SEO / GEO requirements (non-negotiable for this project)
- Full metadata hierarchy: title/description templates, OpenGraph, Twitter cards,
  canonical URLs — see `.claude/skills/seo-technical`.
- Structured data: `Product` + `Person`/`Organization` + `BreadcrumbList` JSON-LD
  appropriate to a single-page amulet/e-commerce brand — see `.claude/skills/seo-schema`
  and `.claude/skills/seo-ecommerce`.
- `robots.txt` allowing standard search crawlers, with deliberate policy on AI
  crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — decide
  allow/block per crawler, don't blanket-block. See `.claude/skills/seo-technical`
  (AI Crawler Management section) and `.claude/skills/seo-geo`.
- `llms.txt` at the site root summarizing the brand/page for LLM/AI-search
  consumption (GEO — Generative Engine Optimization) — see `.claude/skills/seo-geo`.
- `sitemap.xml` even for a single route (still expected by crawlers) — see
  `.claude/skills/seo-sitemap`.
- Image SEO (alt text, OG image, lazy-loading, `next/image`) — see
  `.claude/skills/seo-images`.
- Since this is one page, treat it as `seo-page`-style deep optimization rather
  than a multi-page site audit.

## Design system
- Reference `.claude/skills/ui-ux-pro-max` for style/palette/typography/motion
  research before building sections (it has searchable local data — colors, font
  pairings, UX guidelines, GSAP motion presets).
- Build components with `.claude/skills/ui-styling` (Tailwind conventions,
  accessible primitives) and `.claude/skills/design-system` (token architecture:
  primitive → semantic → component).
- Brand identity (palette, voice, logo direction) comes from
  `.claude/skills/brand` and `.claude/skills/brand-discovery`
  (identity/positioning interview) + `.claude/skills/brand-voice` (writing voice).
- Ad/social creative (banners, OG image) via `.claude/skills/banner-design`.

## Code conventions
- `.claude/skills/frontend-patterns` and `.claude/skills/nextjs-turbopack` for
  React/Next.js component and rendering patterns.
- `.claude/skills/backend-patterns` only if/when a real API route is needed
  (e.g. contact/order form) — this project has no backend by default.
- `.claude/skills/coding-standards` for naming/readability baseline.
- `.claude/skills/security-review` before adding any form, input handling, or
  third-party embed.
- `.claude/skills/documentation-lookup` to pull current Next.js/Tailwind API
  docs via Context7 instead of relying on training data.

## Notes on the imported SEO skills
The `seo-*` skills were trimmed from a larger multi-page SEO audit toolkit
(claude-seo). Some of their instructions reference a `claude-seo run <script>.py`
CLI helper that was **not** copied into this project (it's built for repeated
multi-page audits, not a single static page) — treat those as optional; follow
the skill's manual checklist/guidance instead when the script isn't present.
