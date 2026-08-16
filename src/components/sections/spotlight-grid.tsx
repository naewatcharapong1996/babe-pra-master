import Image from "next/image";

type SpotlightItem = { label: string; photoUrl: string };

export function SpotlightGrid({
  heading,
  sub,
  items,
}: {
  heading: string;
  sub: string;
  items: SpotlightItem[];
}) {
  return (
    <section className="px-4 py-8 text-center lg:px-8">
      <h2 className="font-display text-xl font-bold text-onyx">{heading}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-onyx/70">{sub}</p>

      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {items.map((item, i) => (
          <SpotlightTile key={`${item.label}-${i}`} label={item.label} photoSrc={item.photoUrl} />
        ))}
      </div>
    </section>
  );
}

function SpotlightTile({ label, photoSrc }: { label: string; photoSrc: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-taupe/30 bg-bone lg:h-16 lg:w-16">
        <Image src={photoSrc} alt="" fill className="object-contain p-2" sizes="64px" />
      </div>
      <p className="text-xs font-medium text-onyx">{label}</p>
    </div>
  );
}
