import Image from "next/image";
import type { Service } from "@/lib/data";

type Props = {
  service: Service;
  index: number;
};

export default function ServiceCard({ service, index }: Props) {
  return (
    <article className="card-edge group relative overflow-hidden rounded-md bg-white/[0.03] transition-all duration-500 hover:bg-white/[0.05]">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        {/* red bottom glow */}
        <div className="absolute inset-x-0 -bottom-1/3 h-2/3 bg-red-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Index + tag */}
        <div className="absolute left-4 top-4 flex items-center gap-3">
          <span className="h-display text-xs uppercase tracking-[0.3em] text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-display rounded-sm border border-white/15 bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
            {service.tag}
          </span>
        </div>

        {/* Top red LED */}
        <div className="absolute inset-x-6 top-0 h-px led-strip-red opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="relative -mt-20 p-6">
        <h3 className="h-display text-2xl uppercase leading-none text-white sm:text-3xl">
          {service.title}
        </h3>
        <p className="mt-3 text-sm text-white/70 sm:text-base">{service.short}</p>

        <ul className="mt-5 space-y-2">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-white/75">
              <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none rotate-45 bg-brand-red" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="h-display text-xs uppercase tracking-[0.3em] text-white/60">
            Learn more
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-brand-red/20 text-brand-red transition-all group-hover:bg-brand-red group-hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
