const ITEMS = [
  "XPEL Certified Installer",
  "SunTek Authorized",
  "3M Pro Network",
  "Avery Dennison",
  "KPMF Wraps",
  "Gtechniq",
  "Ceramic Pro",
  "Modesta",
];

export default function TrustStrip() {
  // Duplicate for a seamless marquee
  const loop = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-label="Trusted brands"
      className="relative overflow-hidden border-y border-white/10 bg-brand-surface/60 py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-black to-transparent" />

      <div className="flex w-[200%] animate-marquee items-center gap-12 whitespace-nowrap">
        {loop.map((label, i) => (
          <div key={i} className="flex items-center gap-12 text-white/50">
            <span className="h-display text-base uppercase tracking-[0.3em] sm:text-lg">
              {label}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-red/80" />
          </div>
        ))}
      </div>
    </section>
  );
}
