import Image from "next/image";
import Link from "next/link";
import DallasSkyline from "./DallasSkyline";
import { BUSINESS, CERTIFICATION, WARRANTY } from "@/lib/business";
import { SERVICES, servicePath } from "@/lib/services";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black pt-20 sm:pt-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_120%,rgba(193,18,31,0.5)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_15%_20%,rgba(193,18,31,0.22)_0%,transparent_70%)]" />
      </div>

      {/* LED strip: the shop's bay is lit with these; one is enough */}
      <div className="pointer-events-none absolute left-0 right-0 top-20 h-[2px] led-strip" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center border-l-2 border-brand-red pl-3">
            <span className="h-display text-xs uppercase tracking-[0.25em] text-white/85">
              Richardson · Dallas, TX
            </span>
          </div>

          <h1 className="h-display text-[clamp(3rem,8vw,6.5rem)] uppercase leading-[0.9] tracking-tight text-white">
            <span className="block">Dallas&apos; tint,</span>
            <span className="text-glow-red block text-brand-red">
              <span className="h-display-italic">PPF &amp; wrap</span>
            </span>
            <span className="block">shop.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Window tint, paint protection film, vinyl wraps, ceramic coating,
            powder coating and{" "}
            <Link href={servicePath("chrome-delete")} className="text-white underline decoration-brand-red underline-offset-4">
              chrome delete
            </Link>
            , done in our Richardson bay for Dallas drivers who care how their
            car looks.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              data-track="quote_start"
              className="h-display inline-flex items-center gap-3 rounded-sm bg-brand-red shadow-redGlow hover:bg-brand-redDark px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors sm:text-base"
            >
              Get a Quote
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </Link>
            <a
              href="#work"
              className="h-display group inline-flex items-center gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 sm:text-base"
            >
              View Work
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Services">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={servicePath(s.slug)}
                  className="inline-flex min-h-9 items-center border border-white/15 bg-black/40 px-3.5 text-sm text-white/85 transition-colors hover:border-brand-red hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm">
            <a href="#reviews" className="text-white/85 underline-offset-4 hover:underline">
              Read our Google reviews →
            </a>
            <a
              href={BUSINESS.google.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="directions"
              className="flex items-center gap-2 text-white/75 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke="#C1121F" strokeWidth="2" />
                <circle cx="12" cy="9" r="2.5" stroke="#C1121F" strokeWidth="2" />
              </svg>
              630 S Central Expy, Richardson
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="card-edge relative overflow-hidden rounded-md bg-white/[0.03] p-1">
            <div className="relative overflow-hidden rounded-none bg-black">
              <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
                <Image
                  src="/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_1.jpg"
                  alt="Purple Lamborghini Aventador with the doors up against the Dallas Tint Shop mural"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px led-strip-red" />

                <div className="absolute left-4 top-4 flex items-center gap-2 bg-black/70 px-2.5 py-1">
                  <span className="h-display text-[11px] uppercase tracking-[0.25em] text-white">
                    Featured build
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="h-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                    Lamborghini Aventador
                  </div>
                  <div className="mt-1 text-sm text-white/80">In the Dallas Tint Shop bay</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="h-display rounded-sm bg-brand-off px-2.5 py-1 text-sm uppercase tracking-[0.15em] text-black">
                      {CERTIFICATION}
                    </span>
                    <span className="h-display rounded-sm bg-brand-red px-2.5 py-1 text-sm uppercase tracking-[0.15em] text-white">
                      {WARRANTY.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/60">{WARRANTY.note}</p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
        <DallasSkyline className="h-28 w-full sm:h-36" fill="#050505" />
      </div>
    </section>
  );
}
