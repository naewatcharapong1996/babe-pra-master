import { Reveal } from "@/components/reveal";
import { PromoBar } from "@/components/sections/promo-bar";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { LifestyleBanner } from "@/components/sections/lifestyle-banner";
import { CampaignCta } from "@/components/sections/campaign-cta";
import { StorySection } from "@/components/sections/story-section";
import { CuratedSection } from "@/components/sections/curated-section";
import { AuthenticitySection } from "@/components/sections/authenticity-section";
import { SpotlightGrid } from "@/components/sections/spotlight-grid";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import type { SectionContent, SectionKey } from "@/lib/content/schema";

type Content = { [K in SectionKey]: SectionContent<K> };

// Shared between the live page (fed published content) and the admin
// preview route (fed draft content) — same components, same order, so
// preview is pixel-identical to what publishing will produce.
export function SiteContent({ content }: { content: Content }) {
  return (
    <>
      <PromoBar message={content.promo_bar.message} />
      <HeroCarousel slides={content.hero.slides} />

      <Reveal>
        <LifestyleBanner videoUrl={content.lifestyle_banner.videoUrl} imageUrl={content.lifestyle_banner.imageUrl} />
      </Reveal>
      <Reveal>
        <CampaignCta
          heading={content.campaign_cta.heading}
          sub={content.campaign_cta.sub}
          ctaLabel={content.campaign_cta.ctaLabel}
        />
      </Reveal>
      <Reveal>
        <StorySection
          heading={content.story.heading}
          body={content.story.body}
          points={content.story.points}
          videoUrl={content.story.videoUrl}
          imageUrl={content.story.imageUrl}
        />
      </Reveal>
      <Reveal>
        <CuratedSection bundles={content.curated.bundles} />
      </Reveal>
      <Reveal>
        <AuthenticitySection
          heading={content.authenticity.heading}
          body={content.authenticity.body}
          steps={content.authenticity.steps}
          note={content.authenticity.note}
          videoUrl={content.authenticity.videoUrl}
          imageUrl={content.authenticity.imageUrl}
        />
      </Reveal>
      <Reveal>
        <SpotlightGrid heading={content.spotlight.heading} sub={content.spotlight.sub} items={content.spotlight.items} />
      </Reveal>
      <Reveal>
        <TestimonialsSection items={content.testimonials.items} />
      </Reveal>
      <Reveal>
        <FaqSection items={content.faq.items} />
      </Reveal>
      <CtaSection heading={content.cta_footer.heading} sub={content.cta_footer.sub} />
    </>
  );
}
