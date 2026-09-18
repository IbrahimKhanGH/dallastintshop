import { BUSINESS } from "@/lib/business";

const btn =
  "grid h-11 w-11 place-items-center rounded-sm border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-brand-red hover:text-brand-red";

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.73 5.73 0 0 0-.77-.05A5.7 5.7 0 0 0 4.16 15.3 5.7 5.7 0 0 0 9.86 21a5.7 5.7 0 0 0 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48z" />
    </svg>
  );
}

/** Instagram + TikTok icon buttons, 44px targets. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={BUSINESS.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram ${BUSINESS.social.instagramHandle}`}
        data-track="instagram"
        className={btn}
      >
        <InstagramIcon />
      </a>
      <a
        href={BUSINESS.social.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`TikTok ${BUSINESS.social.tiktokHandle}`}
        data-track="tiktok"
        className={btn}
      >
        <TikTokIcon />
      </a>
    </div>
  );
}
