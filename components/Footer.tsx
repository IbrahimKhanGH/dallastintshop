import Link from "next/link";
import Logo from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { BUSINESS, WARRANTY } from "@/lib/business";
import { SERVICES, SECONDARY_SERVICES, servicePath } from "@/lib/services";

export default function Footer() {
  const { address, google, social } = BUSINESS;
  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a] pb-24 pt-16 lg:pb-12">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo height={72} className="-ml-8" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Window tint, paint protection film, vinyl wraps, ceramic coating,
            powder coating and chrome delete in Richardson, serving Dallas.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="h-display text-sm uppercase tracking-[0.3em] text-brand-red">Services</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={servicePath(s.slug)}
                  className="inline-block py-1.5 text-white/75 transition-colors hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            {SECONDARY_SERVICES.map((s) => (
              <li key={s.slug} className="py-1.5 text-white/55">
                Also: {s.name}
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-5">
          <h2 className="h-display text-sm uppercase tracking-[0.3em] text-brand-red">
            Visit the shop
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <address className="not-italic text-sm leading-relaxed text-white/80">
                <a
                  href={google.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {address.street}, {address.suite}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </a>
              </address>
              <a
                href={google.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="directions"
                className="h-display mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm bg-red-grad px-5 text-sm uppercase tracking-[0.2em] text-white shadow-redGlow"
              >
                <PinIcon />
                Get directions
              </a>
              <div className="mt-4 text-sm">
                <a
                  href={BUSINESS.phoneHref}
                  data-track="call"
                  className="inline-block py-1.5 text-white transition-colors hover:text-brand-red"
                >
                  {BUSINESS.phone}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-white/60">Hours</h3>
              <dl className="mt-2 space-y-1 text-sm">
                {BUSINESS.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-4">
                    <dt className="text-white/65">{h.label}</dt>
                    <dd className="text-white/90">{h.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 space-y-1 text-sm">
                <li>
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="instagram"
                    className="inline-block py-1 text-white/70 transition-colors hover:text-white"
                  >
                    Instagram {social.instagramHandle}
                  </a>
                </li>
                <li>
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="tiktok"
                    className="inline-block py-1 text-white/70 transition-colors hover:text-white"
                  >
                    TikTok {social.tiktokHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs text-white/55">{WARRANTY.note}</p>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-4 pt-6 text-xs text-white/55 sm:flex-row sm:px-6 lg:px-8">
        <div>
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="px-1 py-3 transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="px-1 py-3 transition-colors hover:text-white">
            Terms
          </Link>
          <span className="h-display tracking-[0.3em]">RICHARDSON · TX</span>
        </div>
      </div>
    </footer>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
