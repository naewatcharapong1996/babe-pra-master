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
import { faqJsonLd } from "@/lib/schema";
import { faqItems } from "@/lib/faq-data";

export default function Home() {
  const jsonLd = [faqJsonLd(faqItems)];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <PromoBar />
      <HeroCarousel />

      <Reveal>
        <LifestyleBanner />
      </Reveal>
      <Reveal>
        <CampaignCta />
      </Reveal>
      <Reveal>
        <StorySection />
      </Reveal>
      <Reveal>
        <CuratedSection />
      </Reveal>
      <Reveal>
        <AuthenticitySection />
      </Reveal>
      <Reveal>
        <SpotlightGrid />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <CtaSection />
    </>
  );
}
