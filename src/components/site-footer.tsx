import { ChevronDownIcon, FacebookIcon } from "./icons";
import { LineButton } from "./line-modal";
import { Logo } from "./logo";
import { siteConfig } from "@/lib/site-config";

const footerGroups = [
  {
    title: "เกี่ยวกับเรา",
    links: [
      { href: "#story", label: "เรื่องราวของเรา" },
      { href: "#authenticity", label: "การันตีของแท้" },
    ],
  },
  {
    title: "ช่วยเหลือ",
    links: [
      { href: "#faq", label: "คำถามที่พบบ่อย" },
      { href: siteConfig.lineUrl, label: `ทักไลน์ ${siteConfig.lineId}` },
      { href: siteConfig.phoneHref, label: `โทร ${siteConfig.phone}` },
    ],
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  if (href === siteConfig.lineUrl) {
    return (
      <LineButton className="text-sm text-bone/70 hover:text-gold">{label}</LineButton>
    );
  }
  return (
    <a href={href} className="text-sm text-bone/70 hover:text-gold">
      {label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-bone/10 bg-onyx pb-6 pt-8">
      <div className="flex items-center gap-2 px-4 lg:px-8">
        <Logo className="h-7 w-auto rounded-md" />
        <span className="font-display text-base font-semibold text-bone">
          {siteConfig.brandNameTh}
        </span>
      </div>

      {/* Mobile: accordion groups */}
      <div className="mt-4 divide-y divide-bone/10 px-4 lg:hidden">
        {footerGroups.map((group) => (
          <details key={group.title} className="py-3 group">
            <summary className="flex list-none items-center justify-between text-sm font-medium text-bone marker:content-none">
              {group.title}
              <ChevronDownIcon className="h-4 w-4 text-bone/50 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              {group.links.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} />
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Desktop: expanded columns */}
      <div className="mt-6 hidden grid-cols-3 gap-6 px-8 lg:grid">
        {footerGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 text-sm font-semibold text-bone">{group.title}</p>
            <div className="flex flex-col gap-2">
              {group.links.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} />
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-start justify-end gap-3">
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={siteConfig.social.facebookName}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/20 text-bone/70 hover:text-gold"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/20 text-bone/70 hover:text-gold"
          >
            IG
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-bone/10 px-4 pt-4 text-[11px] text-taupe lg:px-8">
        <span>
          © {new Date().getFullYear()} {siteConfig.brandNameTh}. สงวนลิขสิทธิ์.
        </span>
        {/* TODO: link these once real policy pages exist — left as plain text to avoid dead links. */}
        <div className="flex gap-3">
          <span>ข้อตกลงการใช้</span>
          <span>นโยบายความเป็นส่วนตัว</span>
          <span>คุกกี้</span>
        </div>
      </div>
    </footer>
  );
}
