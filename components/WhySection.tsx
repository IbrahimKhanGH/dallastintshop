import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { WHY_POINTS } from "@/lib/data";

export default function WhySection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden border-t border-white/10 bg-brand-black py-20 sm:py-28"
    >
      {/* Background photo — TODO: replace with the real shop / red mural shot */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <Image
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/60" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Why Dallas Tint Shop"
            title={
              <>
                Built for{" "}
                <span className="h-display-italic text-brand-red">drivers</span>
                <br /> not commuters.
              </>
            }
            description="We exist for one reason: deliver the level of work a Dallas car enthusiast actually wants — clean, on time, and warranted. Here's how we keep that bar."
          />

          {/* Quote panel */}
          <div className="card-edge mt-10 rounded-md bg-white/[0.03] p-6 backdrop-blur">
            <div className="h-display text-4xl leading-none text-brand-red">“</div>
            <p className="-mt-2 text-base text-white/85 sm:text-lg">
              Tint, PPF, and Wrap Experts — delivering protection &amp; restyling
              services. Good pricing. Great results.
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-sm bg-brand-red text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="text-sm">
                <div className="h-display uppercase tracking-widest text-white">
                  @thedallastintshop
                </div>
                <div className="text-white/55">From the studio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_POINTS.map((p) => (
              <li
                key={p.n}
                className="card-edge group relative overflow-hidden rounded-md bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between">
                  <span className="h-display text-5xl leading-none text-brand-red/60 transition-colors group-hover:text-brand-red">
                    {p.n}
                  </span>
                  <span className="h-px w-8 translate-y-3 bg-white/20" />
                </div>
                <h3 className="mt-4 h-display text-xl uppercase tracking-wide text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
