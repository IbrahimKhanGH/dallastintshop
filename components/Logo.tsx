type LogoProps = {
  className?: string;
  withWordmark?: boolean;
};

/**
 * Wordmark logo.
 * TODO: Swap this for the real Dallas Tint Shop logo SVG/PNG (the
 * black-background "DALLAS" (white) + "TINT SHOP" (red) racing-style mark).
 * Place the asset at /public/logo.svg and replace this component's body
 * with <Image src="/logo.svg" ... />.
 */
export default function Logo({ className = "", withWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-sm bg-black ring-1 ring-white/10">
        <span className="h-display text-[10px] italic text-white">DTS</span>
        <span className="absolute -bottom-[3px] left-1 right-1 h-[2px] bg-brand-red" />
      </div>
      {withWordmark && (
        <div className="leading-none">
          <div className="h-display h-display-italic text-base tracking-wider text-white">
            DALLAS
          </div>
          <div className="h-display h-display-italic -mt-0.5 text-base tracking-wider text-brand-red">
            TINT SHOP
          </div>
        </div>
      )}
    </div>
  );
}
