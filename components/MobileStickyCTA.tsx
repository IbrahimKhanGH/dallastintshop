import Link from "next/link";
import { BUSINESS } from "@/lib/data";

export default function MobileStickyCTA() {
  return (
    <>
      {/* The bar below is fixed, so without this spacer it sits on top of
          whatever ends the page — on the homepage that was the bottom of the
          footer. Rendering it here means any page that mounts the bar
          reserves its own room, and no page has to remember to. */}
      <div aria-hidden className="lg:hidden">
        <div className="h-16" />
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={BUSINESS.phoneHref}
            className="flex h-12 items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.04] text-sm font-medium text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.95.37 1.87.7 2.75a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.33-1.27a2 2 0 012.11-.45c.88.33 1.8.57 2.75.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Call
          </a>
          <a
            href={BUSINESS.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.04] text-sm font-medium text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="9"
                r="2.5"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Directions
          </a>
          <Link
            href="/quote"
            className="h-display flex h-12 items-center justify-center rounded-sm bg-red-grad text-xs uppercase tracking-[0.2em] text-white shadow-redGlow"
          >
            Get Quote
          </Link>
        </div>
        {/* iOS safe area */}
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </>
  );
}
