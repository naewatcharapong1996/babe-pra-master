import { siteConfig } from "@/lib/site-config";

// Plain <img>, not next/image: it's a fixed vector logo (already
// resolution-independent) with a solid crimson background baked in, so
// there's no raster-optimization benefit — and avoids next/image's
// dangerouslyAllowSVG requirement for local SVG sources.
export function Logo({ className = "h-8 w-auto rounded-lg" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed vector SVG, no optimization benefit from next/image
    <img
      src="/media/logo.svg"
      alt={siteConfig.brandNameTh}
      width={510}
      height={428}
      className={className}
    />
  );
}
