import { BUSINESS, SERVICES } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

/* Schema.org LocalBusiness data.

   This is what lets Google show the hours, rating and phone number directly
   in results, and it is also how ChatGPT/Perplexity answer "who does
   ceramic tint near Richardson" — those assistants read structured data far
   more reliably than they read marketing prose.

   Every value here is verified: address, phone and hours come from the
   shop's own Instagram captions, the rating and review count from their
   Google Business Profile, the coordinates from that listing's map pin.
   Do not put an aggregateRating here that the page does not also display —
   Google treats that as spam, and the reviews section shows both numbers. */
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDetailing",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    priceRange: "$$",
    image: `${SITE_URL}/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_1.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "630 South Central Expressway, Suite 104",
      addressLocality: "Richardson",
      addressRegion: "TX",
      postalCode: "75080",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 32.9445245, longitude: -96.7411731 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [BUSINESS.instagram],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.rating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
    },
    areaServed: [
      "Richardson, TX",
      "Dallas, TX",
      "Plano, TX",
      "Garland, TX",
      "Addison, TX",
      "Allen, TX",
    ].map((name) => ({ "@type": "City", name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automotive protection & restyling",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.short },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Schema data is a static object we build ourselves — no user input
      // reaches it, so there is nothing here to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
