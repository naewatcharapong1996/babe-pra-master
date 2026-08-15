import Image from "next/image";

const spotlightItems = [
  "พระเหรียญ",
  "พระผง",
  "พระเนื้อดิน",
  "พระปิดตา",
  "พระสมเด็จ",
  "พระหล่อ",
  "พระกริ่ง-ชัยวัฒน์",
  "พระทองคำ",
  "รูปถ่ายเกจิ",
  "เหรียญคณาจารย์",
  "ของเก่าของโบราณ",
  "กระเพาะปลา",
];

// 11 real product photos cycled across the 12 labels above — illustrative
// only, not mapped to the correct type per item.
const PRODUCT_PHOTO_COUNT = 11;
function photoSrcForIndex(index: number) {
  return `/media/products/product-${(index % PRODUCT_PHOTO_COUNT) + 1}.png`;
}

export function SpotlightGrid() {
  return (
    <section className="px-4 py-8 text-center lg:px-8">
      <h2 className="font-display text-xl font-bold text-onyx">รายการที่รับซื้อ</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-onyx/70">
        พระเครื่อง วัตถุมงคล ของเก่าของโบราณ และของสะสมทุกชนิด
      </p>

      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {spotlightItems.map((label, i) => (
          <SpotlightTile key={label} label={label} photoSrc={photoSrcForIndex(i)} />
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
