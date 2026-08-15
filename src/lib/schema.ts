import { siteConfig } from "./site-config";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandNameTh,
    alternateName: siteConfig.brandNameEn,
    url: siteConfig.url,
    logo: `${siteConfig.url}/media/logo.svg`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      areaServed: "TH",
      availableLanguage: "Thai",
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandNameTh,
    url: siteConfig.url,
    inLanguage: "th-TH",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
