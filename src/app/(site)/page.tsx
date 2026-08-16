import { SiteContent } from "@/components/site-content";
import { faqJsonLd } from "@/lib/schema";
import { getAllPublishedSections } from "@/lib/content/repository";

export default async function Home() {
  const content = await getAllPublishedSections();
  const jsonLd = [faqJsonLd(content.faq.items)];

  return (
    <>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <SiteContent content={content} />
    </>
  );
}
