import Image from "next/image";
import Link from "next/link";
import DallasSkyline from "./DallasSkyline";
import { BUSINESS } from "@/lib/data";

// Mirrors the steps in components/quote/QuoteForm.tsx. Showing the shape of
// the flow up front is what makes it feel short enough to start.
const QUOTE_PREVIEW = [
  { label: "Your vehicle", hint: "Year, make, model" },
  { label: "Body style", hint: "Sedan, coupe, SUV, truck" },
  { label: "What you need", hint: "Tap what applies" },
  { label: "How to reach you", hint: "Text, call, or email" },
];

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden border-y border-white/10 bg-brand-black"
    >
      {/* Background image — TODO: replace with shop interior photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_6.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_50%,rgba(193,18,31,0.35)_0%,transparent_70%)]" />
        <div className="absolute inset-0 racing-stripes opacity-30" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-px w-8 bg-brand-red" />
            <span className="h-display text-xs uppercase tracking-[0.4em] text-brand-red">
              Book your build
            </span>
          </div>

          <h2 className="h-display text-5xl uppercase leading-[0.9] text-white sm:text-6xl md:text-7xl">
            Ready to <span className="text-brand-red h-display-italic">level up</span>
            <br /> your car?
          </h2>

          <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Tell us about your vehicle and what you want done. We&apos;ll send
            you a transparent quote — usually same day.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="h-display group inline-flex items-center gap-3 rounded-sm bg-red-grad px-6 py-4 text-sm uppercase tracking-[0.2em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg sm:text-base"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.95.37 1.87.7 2.75a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.33-1.27a2 2 0 012.11-.45c.88.33 1.8.57 2.75.7A2 2 0 0122 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Call {BUSINESS.phone}
            </a>
            <a
              href={BUSINESS.mapsHref}
              target="_blank"
              rel="noreferrer"
              className="h-display inline-flex items-center gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-6 py-4 text-sm uppercase tracking-[0.2em] text-white backdrop-blur transition-all hover:bg-white/10 sm:text-base"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              Get Directions
            </a>
          </div>

          {/* Hours */}
          <div className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-6">
            {BUSINESS.hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between text-sm">
                <span className="h-display uppercase tracking-widest text-white/60">
                  {h.day}
                </span>
                <span className="text-white/90">{h.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick quote card — a teaser that hands off to the real flow at
            /quote. Deliberately not a form: a second set of inputs here
            would either duplicate the step engine or drop the lead, and a
            half-width card is the wrong place for a four-step flow. */}
        <div className="card-edge relative rounded-md bg-black/60 p-6 backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="h-display text-2xl uppercase tracking-wide text-white">
              Quick Quote
            </h3>
            <span className="h-display rounded-sm bg-brand-red/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-red">
              Same-day reply
            </span>
          </div>

          <p className="text-sm text-white/65">
            Four quick steps — about thirty seconds. No account, no pressure,
            and a real person reads every one.
          </p>

          <ol className="mt-6 space-y-3">
            {QUOTE_PREVIEW.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="h-display mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] text-white/70">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="h-display text-sm uppercase tracking-widest text-white">
                    {s.label}
                  </div>
                  <div className="text-xs text-white/45">{s.hint}</div>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/quote"
            className="h-display group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-sm bg-red-grad px-6 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg"
          >
            Start your quote
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
            <span className="absolute inset-y-0 right-0 w-14 -skew-x-12 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          <p className="mt-3 text-center text-[11px] text-white/40">
            We&apos;ll text or call back within business hours.
          </p>
        </div>
      </div>

      {/* skyline footer accent */}
      <DallasSkyline
        className="h-24 w-full opacity-60 sm:h-32"
        fill="#0a0a0a"
      />
    </section>
  );
}
