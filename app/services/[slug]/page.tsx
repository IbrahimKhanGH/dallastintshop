import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { BUSINESS, WARRANTY } from "@/lib/business";
import { SERVICES, getService, quotePath, servicePath } from "@/lib/services";
import { IG_POSTS } from "@/lib/gallery";
import { pageMetadata } from "@/lib/metadata";
import { BUSINESS_SCHEMA_ID, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return pageMetadata({
    title: service.page.title,
    description: service.page.metaDescription,
    path: servicePath(service.slug),
  });
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  // Real posts whose captions name this service — first image of each.
  const work = service.workCodes.flatMap((code) => {
    const post = IG_POSTS.find((p) => p.code === code);
    if (!post) return [];
    const vehicle = post.vehicle ? ` on a ${post.vehicle}` : "";
    return [
      {
        code,
        url: post.url,
        src: post.images[0],
        alt: `${service.name} at Dallas Tint Shop${vehicle}`,
        date: post.date,
      },
    ];
  });

  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const url = absoluteUrl(servicePath(service.slug));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      serviceType: service.name,
      description: service.summary,
      url,
      image: absoluteUrl(service.image),
      provider: { "@id": BUSINESS_SCHEMA_ID },
      areaServed: [
        { "@type": "City", name: "Richardson, TX" },
        { "@type": "City", name: "Dallas, TX" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: service.name, item: url },
      ],
    },
  ];

  return (
    <main id="main" className="relative overflow-hidden bg-brand-black">
      <script
        type="application/ld+json"
        // Built from our own static service data — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* hero */}
      <section className="relative isolate pt-24 sm:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_20%_0%,rgba(193,18,31,0.22)_0%,transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8 lg:pb-20">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="text-sm text-white/65">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/#services" className="hover:text-white">Services</Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-white">{service.name}</li>
              </ol>
            </nav>

            <h1 className="h-display mt-5 text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.92] text-white">
              {service.page.h1}
            </h1>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {service.page.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={quotePath(service.slug)}
                data-track="quote_start"
                className="h-display inline-flex min-h-12 items-center gap-3 rounded-sm bg-brand-red shadow-redGlow hover:bg-brand-redDark px-6 text-sm uppercase tracking-[0.2em] text-white transition-colors"
              >
                Get a {service.tag} quote
              </Link>
              <a
                href={BUSINESS.phoneHref}
                data-track="call"
                className="h-display inline-flex min-h-12 items-center rounded-sm border border-white/20 bg-white/[0.04] px-6 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
              >
                Call {BUSINESS.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="card-edge relative overflow-hidden rounded-md bg-white/[0.03] p-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-none">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* highlights */}
      <section className="border-y border-white/10 bg-brand-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-white">
                <span className="h-2 w-2 flex-none rotate-45 bg-brand-red" />
                <span className="h-display text-lg uppercase tracking-[0.12em]">{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/60">{WARRANTY.note}</p>
        </div>
      </section>

      {/* real work */}
      {work.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="h-display text-4xl uppercase text-white sm:text-5xl">
              Recent {service.name.toLowerCase()} work
            </h2>
            <p className="mt-3 max-w-2xl text-white/70">
              Straight from our Instagram. Tap any photo for the original post.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {work.map((w) => (
                <li key={w.code}>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="instagram"
                    className="card-edge group relative block aspect-[4/5] overflow-hidden rounded-md bg-white/[0.03]"
                  >
                    <Image
                      src={w.src}
                      alt={w.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <p className="pointer-events-none absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-xs text-white/90">
                      {w.alt}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="h-display text-4xl uppercase text-white sm:text-5xl">Questions</h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {service.page.faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-xl text-brand-red transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 pr-8 leading-relaxed text-white/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + visit */}
      <section className="border-t border-white/10 bg-brand-surface/50 py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="h-display text-4xl uppercase text-white">Ready when you are.</h2>
            <p className="mt-2 text-white/75">
              {BUSINESS.addressLine} ·{" "}
              {BUSINESS.hours.map((h) => `${h.label} ${h.value}`).join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={quotePath(service.slug)}
              data-track="quote_start"
              className="h-display inline-flex min-h-12 items-center rounded-sm bg-brand-red shadow-redGlow hover:bg-brand-redDark px-6 text-sm uppercase tracking-[0.2em] text-white"
            >
              Start your quote
            </Link>
            <a
              href={BUSINESS.google.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="directions"
              className="h-display inline-flex min-h-12 items-center rounded-sm border border-white/20 bg-white/[0.04] px-6 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Get directions
            </a>
          </div>
        </div>
      </section>

      {/* other services */}
      <nav aria-label="Other services" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="h-display text-2xl uppercase tracking-wide text-white">Other services</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={servicePath(s.slug)}
                  className="inline-flex min-h-11 items-center border border-white/15 bg-white/[0.03] px-4 text-sm text-white/85 transition-colors hover:border-brand-red hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <Footer />
      <MobileStickyCTA />
    </main>
  );
}
