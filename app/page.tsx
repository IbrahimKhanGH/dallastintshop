import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import GalleryGrid from "@/components/GalleryGrid";
import WhySection from "@/components/WhySection";
import ReviewCard from "@/components/ReviewCard";
import InstagramSection from "@/components/InstagramSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { SERVICES, GALLERY, REVIEWS } from "@/lib/data";

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
            <a
              href="#contact"
              className="h-display hidden rounded-sm border border-white/15 bg-white/[0.04] px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10 sm:inline-flex"
            >
              Book a service →
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section
        id="work"
        className="relative border-t border-white/10 bg-brand-surface/40 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Featured work"
              title={
                <>
                  Built in the
                  <br />
                  <span className="h-display-italic text-brand-red">studio.</span>
                </>
              }
              description="Tesla, Hellcat, Blackwing, BMW M, AMG, exotics, and daily drivers — same standard, every install."
            />
            <a
              href="#contact"
              className="h-display hidden rounded-sm bg-red-grad px-5 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-redGlow transition-all hover:-translate-y-0.5 sm:inline-flex"
            >
              Start your build →
            </a>
          </div>

          <div className="mt-12">
            <GalleryGrid items={GALLERY} />
          </div>
        </div>
      </section>

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
            description="180+ five-star reviews across Google and Instagram from Dallas drivers who trust us with their cars."
            align="center"
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>

          {/* TODO: Drop in real screenshots of Google review cards here */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/55">
            <span className="h-display tracking-[0.3em] text-white/75">5.0 ★ GOOGLE</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-red" />
            <span className="h-display tracking-[0.3em] text-white/75">XPEL CERTIFIED</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-brand-red" />
            <span className="h-display tracking-[0.3em] text-white/75">SUNTEK PRO</span>
          </div>
        </div>
      </section>

      <InstagramSection />

      <CTASection />

      <Footer />

      <MobileStickyCTA />
    </main>
  );
}
