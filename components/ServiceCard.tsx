import Image from "next/image";
import Link from "next/link";
import { servicePath, type Service } from "@/lib/services";

type Props = {
  service: Service;
  index: number;
};

/* The whole card is the link to the service page — one large target
   instead of a small "Learn more" that used to go nowhere. */
export default function ServiceCard({ service, index }: Props) {
  return (
    <Link
      href={servicePath(service.slug)}
      className="card-edge group relative flex h-full flex-col overflow-hidden rounded-md bg-white/[0.03] transition-colors duration-300 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-3">
          <span className="h-display text-xs uppercase tracking-[0.3em] text-white/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-display rounded-sm border border-white/20 bg-black/60 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
            {service.tag}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="h-display text-3xl uppercase leading-none text-white">{service.name}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/75">{service.summary}</p>

        <ul className="mb-6 mt-5 space-y-2">
          {service.highlights.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
              <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none rotate-45 bg-brand-red" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <span className="h-display text-sm uppercase tracking-[0.25em] text-white/80 group-hover:text-white">
            Explore {service.tag}
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-brand-red/20 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
