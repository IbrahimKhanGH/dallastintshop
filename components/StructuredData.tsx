import { BUSINESS } from "@/lib/business";
import { SERVICES, servicePath } from "@/lib/services";
import { BUSINESS_SCHEMA_ID, SITE_URL, absoluteUrl } from "@/lib/site";

/* Schema.org business data, rendered on every page.

   Built entirely from lib/business.ts and lib/services.ts, so it can't
   drift from what the page shows.

   Deliberately absent:
   - aggregateRating / review. A business marking up its own rating on its
     own site is "self-serving" review markup; Google does not show stars
     for it and it adds risk for no gain. The rating lives on Google.
   - Facebook in sameAs, until the page is confirmed as the shop's.

   Type is AutomotiveBusiness — the general type. The old AutoDetailing
   type described one narrow service rather than what the shop is. */
export default function StructuredData() {
  const { address, geo, google, social } = BUSINESS;
  const data = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": BUSINESS_SCHEMA_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    logo: absoluteUrl(BUSINESS.logo.src),
    image: absoluteUrl("/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_1.jpg"),
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.suite}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { "@type": "GeoCoordinates", ...geo },
    hasMap: google.mapsUrl,
    openingHoursSpecification: BUSINESS.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: [social.instagram, social.tiktok],
    areaServed: ["Richardson, TX", "Dallas, TX"].map((name) => ({ "@type": "City", name })),
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.summary,
        url: absoluteUrl(servicePath(s.slug)),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Static object built from our own constants — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
