import Link from "next/link";
import Logo from "./Logo";
import { BUSINESS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-brand-black pb-24 pt-16 lg:pb-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-5 max-w-md text-sm text-white/60">
            Dallas / Richardson&apos;s premium automotive studio for ceramic
            tint, paint protection film, vinyl wraps, ceramic coatings, paint
            correction, and powder coating.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-sm border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-brand-red hover:text-brand-red"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
            </a>
            <a
              href={BUSINESS.phoneHref}
              aria-label="Call"
              className="grid h-10 w-10 place-items-center rounded-sm border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-brand-red hover:text-brand-red"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.95.37 1.87.7 2.75a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.33-1.27a2 2 0 012.11-.45c.88.33 1.8.57 2.75.7A2 2 0 0122 16.92z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </a>
            <a
              href={BUSINESS.mapsHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Directions"
              className="grid h-10 w-10 place-items-center rounded-sm border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-brand-red hover:text-brand-red"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="h-display text-sm uppercase tracking-[0.3em] text-brand-red">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Ceramic Window Tint</li>
            <li>Paint Protection Film</li>
            <li>Vinyl Wraps</li>
            <li>Ceramic Coating</li>
            <li>Paint Correction</li>
            <li>Detailing</li>
            <li>Powder Coating</li>
          </ul>
        </div>

        <div>
          <h4 className="h-display text-sm uppercase tracking-[0.3em] text-brand-red">
            Visit the Studio
          </h4>
          <address className="mt-4 not-italic text-sm text-white/70">
            {BUSINESS.address.split(",").map((line, i, arr) => (
              <span key={i} className="block">
                {line.trim()}
                {i < arr.length - 1 ? "" : ""}
              </span>
            ))}
          </address>
          <div className="mt-4 space-y-1 text-sm">
            <a href={BUSINESS.phoneHref} className="block text-white hover:text-brand-red">
              {BUSINESS.phone}
            </a>
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noreferrer"
              className="block text-white/70 hover:text-brand-red"
            >
              {BUSINESS.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-4 pt-6 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-white/80">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white/80">
            Terms
          </Link>
          <span className="h-display tracking-[0.3em]">RICHARDSON · TX</span>
        </div>
      </div>
    </footer>
  );
}
