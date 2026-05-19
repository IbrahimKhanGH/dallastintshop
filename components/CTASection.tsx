import Image from "next/image";
import DallasSkyline from "./DallasSkyline";
import { BUSINESS } from "@/lib/data";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden border-y border-white/10 bg-brand-black"
    >
      {/* Background image — TODO: replace with shop interior photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80"
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

        {/* Quick quote card */}
        <div className="card-edge relative rounded-md bg-black/60 p-6 backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="h-display text-2xl uppercase tracking-wide text-white">
              Quick Quote
            </h3>
            <span className="h-display rounded-sm bg-brand-red/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-red">
              Same-day reply
            </span>
          </div>

          <form className="space-y-4" action="#" method="post">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" />
              <Field label="Phone" name="phone" placeholder="(214) 000-0000" />
            </div>
            <Field label="Vehicle" name="vehicle" placeholder="Year / Make / Model" />

            <div>
              <label className="h-display mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/60">
                Services
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Tint",
                  "PPF",
                  "Wrap",
                  "Ceramic Coating",
                  "Paint Correction",
                  "Powder Coating",
                ].map((s) => (
                  <label
                    key={s}
                    className="cursor-pointer rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-white/85 transition-all hover:border-brand-red/60 hover:bg-brand-red/10 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/15 has-[:checked]:text-white"
                  >
                    <input type="checkbox" name="services" value={s} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="h-display mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/60">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Tell us what you're going for…"
                className="w-full rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="h-display group relative w-full overflow-hidden rounded-sm bg-red-grad px-6 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 hover:shadow-redGlowLg"
            >
              Request Quote
              <span className="absolute inset-y-0 right-0 w-14 -skew-x-12 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>

            <p className="text-center text-[11px] text-white/40">
              We&apos;ll text or call back within business hours.
            </p>
          </form>
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

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="h-display mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/60"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none"
      />
    </div>
  );
}
