import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm, { QuoteFormFromUrl } from "@/components/quote/QuoteForm";
import DallasSkyline from "@/components/DallasSkyline";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get a Quote",
  description:
    "Request a quote for window tint, PPF, vinyl wraps, ceramic coating, powder coating or chrome delete in Richardson, TX. Four quick steps.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <main id="main" className="relative min-h-screen overflow-hidden bg-brand-black">
      <Navbar />

      {/* backdrop, dialed down from the homepage hero so the form stays
          the brightest thing on the page */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(193,18,31,0.28)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-lines [background-size:60px_60px] opacity-30" />
        <div className="absolute inset-0 racing-stripes opacity-20" />
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-16 h-[2px] led-strip sm:top-20" />

      <section className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-px w-8 bg-brand-red" />
            <span className="h-display text-xs uppercase tracking-[0.4em] text-brand-red">
              Book your build
            </span>
            <span className="h-px w-8 bg-brand-red" />
          </div>

          <h1 className="h-display text-5xl uppercase leading-[0.9] text-white sm:text-6xl md:text-7xl">
            Get a{" "}
            <span className="h-display-italic text-brand-red">quote.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base text-white/75">
            Four quick steps. Tell us what you&apos;re after and what you drive,
            and we&apos;ll come back with an honest estimate.
          </p>
        </div>

        <div className="mt-10">
          {/* QuoteForm reads ?service= to preselect a service. The boundary
              lets the page stay statically rendered; the fallback is the
              same form with nothing preselected. */}
          <Suspense fallback={<QuoteForm />}>
            <QuoteFormFromUrl />
          </Suspense>
        </div>

        {/* Some people won't fill out a form no matter how short it is. */}
        <p className="mt-8 text-center text-sm text-white/65">
          Rather just talk to someone?{" "}
          <a
            href={BUSINESS.phoneHref}
            data-track="call"
            className="text-white underline decoration-brand-red underline-offset-4 transition-colors hover:text-brand-red"
          >
            Call {BUSINESS.phone}
          </a>
        </p>
      </section>

      <DallasSkyline className="h-24 w-full opacity-50 sm:h-32" fill="#0a0a0a" />

      <Footer />
    </main>
  );
}
