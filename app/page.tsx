import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import WhySection from "@/components/WhySection";
import WorkShowcase from "@/components/WorkShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import GoogleReviews from "@/components/reviews/GoogleReviews";
import { BUSINESS, WARRANTY } from "@/lib/business";
import { SERVICES, SECONDARY_SERVICES, quotePath } from "@/lib/services";
import { CURATED_REVIEWS } from "@/lib/reviews/curated";
import { placesConfigured } from "@/lib/reviews/places";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `${BUSINESS.name} | Window Tint, PPF & Wraps in Richardson, TX`,
  description:
    "LLumar Certified window tint, paint protection film, vinyl wraps, ceramic coating, powder coating and chrome delete in Richardson, TX, serving Dallas. Lifetime Warranty*.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  // Evaluated at build time: whether the carousel should try Google live.
  // A key added later takes effect on the next deploy.
  const liveReviews = placesConfigured();

  return (
    <main id="main" className="relative overflow-hidden">
      <Navbar />
      <Hero />

      <TrustStrip />

      <section
        id="services"
        className="relative scroll-mt-20 border-t border-white/10 bg-brand-black py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="What we do"
              title={
                <>
                  Protection, restyling
                  <br />
                  <span className="h-display-italic text-brand-red">&amp; finish work.</span>
                </>
              }
              description="Six services, all done in-house in our Richardson bay and built for Dallas heat, Dallas highways and Dallas car culture."
            />
            <Link
              href="/quote"
              data-track="quote_start"
              className="h-display hidden min-h-11 items-center rounded-sm border border-white/15 bg-white/[0.04] px-5 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-white/10 sm:inline-flex"
            >
              Get a quote →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {SECONDARY_SERVICES.map((s) => (
                <span key={s.slug}>
                  Also available: <span className="text-white">{s.name}</span> — {s.summary}{" "}
                  <Link
                    href={quotePath(s.slug)}
                    className="text-white underline decoration-brand-red underline-offset-4"
                  >
                    Ask about it
                  </Link>
                </span>
              ))}
            </p>
            <p className="text-xs text-white/60 sm:max-w-sm sm:text-right">{WARRANTY.note}</p>
          </div>
        </div>
      </section>

      <WorkShowcase />

      <WhySection />

      <section
        id="reviews"
        className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-brand-black py-20 sm:py-28"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(193,18,31,0.16)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Google reviews"
            title={
              <>
                Straight from{" "}
                <span className="h-display-italic text-brand-red">our customers.</span>
              </>
            }
          />
          <div className="mt-10">
            <GoogleReviews
              initial={CURATED_REVIEWS}
              liveEnabled={liveReviews}
              reviewsUrl={BUSINESS.google.reviewsUrl}
              writeReviewUrl={BUSINESS.google.writeReviewUrl}
            />
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />

      <MobileStickyCTA />
    </main>
  );
}
