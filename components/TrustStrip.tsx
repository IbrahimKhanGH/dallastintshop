import { CERTIFICATION, WARRANTY } from "@/lib/business";

/* Static credibility row. Replaces the scrolling brand marquee, which
   listed dealer networks and product brands the shop never confirmed
   (the previous list is in git history).

   Only add a brand here once the owner confirms the relationship in
   writing — naming a certification a shop doesn't hold is a liability for
   them, not decoration. */
// The warranty footnote sits directly above this strip, under the hero card.
const ITEMS = [
  CERTIFICATION,
  WARRANTY.label,
  "Tint · PPF · Wraps",
  "Coating · Powder · Chrome Delete",
  "Richardson / Dallas, TX",
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why customers trust us"
      className="relative border-y border-white/10 bg-brand-surface/70"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {ITEMS.map((label, i) => (
            <li key={label} className="flex items-center gap-6">
              {i > 0 && <span aria-hidden className="hidden h-1.5 w-1.5 rotate-45 bg-brand-red sm:block" />}
              <span
                className={`h-display text-base uppercase tracking-[0.2em] sm:text-lg ${
                  i < 2 ? "text-white" : "text-white/70"
                }`}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
