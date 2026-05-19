import Image from "next/image";
import DallasSkyline from "./DallasSkyline";
import { TRUST_CHIPS, BUSINESS } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black pt-20 sm:pt-24">
      {/* Pure dark cinematic backdrop — no competing photo so the McLaren card pops */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_120%,rgba(193,18,31,0.55)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_15%_20%,rgba(193,18,31,0.28)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_30%,rgba(193,18,31,0.18)_0%,transparent_70%)]" />
        {/* grid lines */}
        <div className="absolute inset-0 bg-grid-lines [background-size:60px_60px] opacity-40" />
        {/* diagonal racing stripes texture */}
        <div className="absolute inset-0 racing-stripes opacity-30" />
      </div>

      {/* Top LED strip */}
      <div className="pointer-events-none absolute left-0 right-0 top-20 h-[2px] led-strip" />

      {/* Side LED strips (desktop) */}
      <div className="pointer-events-none absolute left-0 top-32 hidden h-[60%] w-[2px] bg-white/40 shadow-[0_0_18px_rgba(255,255,255,0.5)] md:block" />
      <div className="pointer-events-none absolute right-0 top-32 hidden h-[60%] w-[2px] bg-brand-red shadow-[0_0_22px_rgba(193,18,31,0.8)] md:block" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:px-8 lg:pb-28 lg:pt-20">
        {/* Left: copy */}
        <div className="lg:col-span-7">
          {/* eyebrow */}
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
            </span>
            <span className="h-display text-[11px] uppercase tracking-[0.25em] text-white/80">
              Richardson · Dallas, TX
            </span>
          </div>

          {/* Headline */}
          <h1 className="h-display text-[clamp(2.75rem,8vw,6.5rem)] uppercase leading-[0.9] tracking-tight text-white">
            <span className="block">Dallas&apos;</span>
            <span className="text-glow-red block text-brand-red">
              <span className="h-display-italic">Premium</span>
            </span>
            <span className="block">Tint &amp; Wrap</span>
            <span className="block text-white/95">
              <span className="h-display-italic">Studio</span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
            Performance-focused{" "}
            <span className="text-white">tint, PPF, wraps, ceramic coating,</span>{" "}
            and detailing — trusted by Dallas car enthusiasts who don&apos;t
            settle.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="h-display group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-red-grad px-6 py-4 text-sm uppercase tracking-[0.2em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg sm:text-base"
            >
              <span>Get a Quote</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
              <span className="absolute inset-y-0 right-0 w-14 -skew-x-12 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
            <a
              href="#work"
              className="h-display group inline-flex items-center gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:bg-white/10 sm:text-base"
            >
              <span>View Work</span>
              <span className="h-[2px] w-6 bg-brand-red transition-all group-hover:w-10" />
            </a>
          </div>

          {/* Trust chips */}
          <ul className="mt-10 flex flex-wrap gap-2">
            {TRUST_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur"
              >
                {chip}
              </li>
            ))}
          </ul>

          {/* Inline meta strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <div className="flex" aria-label={`${BUSINESS.rating} star rating`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#C1121F"
                    aria-hidden
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-white/80">
                <strong className="text-white">{BUSINESS.rating.toFixed(1)}</strong>{" "}
                · {BUSINESS.reviewCount}+ reviews
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
                  stroke="#C1121F"
                  strokeWidth="2"
                />
                <circle cx="12" cy="9" r="2.5" stroke="#C1121F" strokeWidth="2" />
              </svg>
              <span>630 S Central Expy, Richardson</span>
            </div>
          </div>
        </div>

        {/* Right: stat / hero card */}
        <div className="relative lg:col-span-5">
          <div className="card-edge relative overflow-hidden rounded-md bg-white/[0.03] p-1 backdrop-blur">
            <div className="relative overflow-hidden rounded-[5px] bg-black">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/malikMclaren.png"
                  alt="Purple McLaren 720S with dihedral door up at the Dallas Tint Shop studio"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* Subtle darken so the bright garage lights don't blow out the card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
                <div className="absolute inset-x-0 top-0 h-px led-strip-red" />

                {/* Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-white/15 bg-black/60 px-2.5 py-1 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  <span className="h-display text-[10px] uppercase tracking-[0.25em] text-white">
                    Featured build
                  </span>
                </div>

                {/* Bottom meta */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="h-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                    McLaren 720S
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Out of the Dallas Tint Shop studio
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat pills */}
          <div className="absolute -left-3 top-8 hidden rotate-[-4deg] rounded-sm border border-white/10 bg-black/80 px-3 py-2 shadow-redGlow backdrop-blur sm:block">
            <div className="h-display text-2xl text-brand-red">720S</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">
              Latest in the bay
            </div>
          </div>
          <div className="absolute -right-3 bottom-10 hidden rotate-[3deg] rounded-sm border border-white/10 bg-black/80 px-3 py-2 backdrop-blur sm:block">
            <div className="h-display text-2xl text-white">10yr</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">
              PPF warranty
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dallas skyline silhouette */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
        <DallasSkyline className="h-32 w-full sm:h-40" fill="#050505" />
      </div>
    </section>
  );
}
