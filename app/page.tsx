import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import WhySection from "@/components/WhySection";
import ReviewCard from "@/components/ReviewCard";
import WorkShowcase from "@/components/WorkShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { SERVICES, REVIEWS, BUSINESS } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />

      <TrustStrip />

      {/* Services */}
      <section
        id="services"
        className="relative border-t border-white/10 bg-brand-black py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="What we do"
              title={
                <>
                  Protection, restyling
                  <br />
                  <span className="h-display-italic text-brand-red">
                    &amp; performance finish.
                  </span>
                </>
              }
              description="From ceramic tint to full-color wraps, every service is dialed in for Dallas weather, Dallas roads, and Dallas car culture."
            />
            <Link
              href="/quote"
              className="h-display hidden rounded-sm border border-white/15 bg-white/[0.04] px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10 sm:inline-flex"
            >
              Book a service →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <WorkShowcase />

      <WhySection />

      {/* Reviews */}
      <section
        id="reviews"
        className="relative overflow-hidden border-t border-white/10 bg-brand-black py-20 sm:py-28"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(193,18,31,0.18)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What clients say"
            title={
              <>
                5 stars from{" "}
                <span className="h-display-italic text-brand-red">real owners.</span>
              </>
            }
            description={`${BUSINESS.rating.toFixed(1)} stars from ${BUSINESS.reviewCount} Google reviews. These are real ones, word for word.`}
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>

          {/* Rating and count verified against the Google listing.
              TODO(owner): confirm the XPEL certification claim below — it is
              the last unverified badge on the page. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/55">
            <span className="h-display tracking-[0.3em] text-white/75">
              {BUSINESS.rating.toFixed(1)} ★ GOOGLE
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-red" />
            <span className="h-display tracking-[0.3em] text-white/75">XPEL CERTIFIED</span>
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />

      <MobileStickyCTA />
    </main>
  );
}
