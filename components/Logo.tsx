import Image from "next/image";
import { BUSINESS } from "@/lib/business";

type LogoProps = {
  className?: string;
  /** Rendered height of the artwork in px; width follows the native ratio */
  height?: number;
  priority?: boolean;
};

/**
 * The shop's real logo artwork, shown at its native aspect ratio — never
 * redrawn, recoloured or approximated with a font.
 *
 * The original PNG has transparent letter fills and is built to sit on
 * white; on this site's black surfaces "DALLAS" would vanish. So dark
 * surfaces use the dark-background version: the same artwork with only
 * its enclosed letter fills set to white (scripts/brand/make-dark-logo.py).
 * No plate or box behind it.
 *
 * The artwork carries transparent margin (about 11% each side); callers
 * pull it in with a negative margin so the lettering lines up with content.
 */
export default function Logo({ className = "", height = 44, priority = false }: LogoProps) {
  const { darkSrc: src, width: w, height: h, alt } = BUSINESS.logo;
  const width = Math.round((w / h) * height);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={`h-auto max-w-full select-none ${className}`}
      style={{ width }}
    />
  );
}
