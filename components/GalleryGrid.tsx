import Image from "next/image";
import type { GalleryItem } from "@/lib/data";

type Props = {
  items: GalleryItem[];
};

const spanClass = (span?: GalleryItem["span"]) => {
  switch (span) {
    case "tall":
      return "sm:row-span-2 aspect-[3/4] sm:aspect-auto";
    case "wide":
      return "sm:col-span-2 aspect-[16/9]";
    case "square":
    default:
      return "aspect-square";
  }
};

export default function GalleryGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-[repeat(3,minmax(0,1fr))] lg:gap-4">
      {items.map((item, i) => (
        <a
          key={i}
          href="#contact"
          className={`group card-edge relative overflow-hidden rounded-md bg-white/[0.03] ${spanClass(
            item.span,
          )}`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
          />
          {/* gradient + red glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-red-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
            <span className="h-display text-xs uppercase tracking-[0.3em] text-white/85">
              View work
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-sm border border-white/15 bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
