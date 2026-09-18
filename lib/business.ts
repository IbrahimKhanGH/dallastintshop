/* ============================================================
   Business facts — the one place they live.

   Header, footer, CTA, quote form, structured data and the service pages
   all read from here, so a changed phone number or opening hour is a
   one-line edit instead of a hunt through components.

   Provenance of every value is noted beside it. Anything flagged
   CONFIRM must be checked with the owner before release.
   ============================================================ */

/* ---------- identity & contact ---------- */

// Phone and address are transcribed from the shop's own Instagram captions
// (the same block appears on 84–90 posts) and match their Google listing.
const ADDRESS = {
  street: "630 South Central Expressway",
  suite: "Suite 104",
  city: "Richardson",
  region: "TX",
  postalCode: "75080",
  country: "US",
} as const;

const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.suite}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postalCode}`;

/* ---------- hours ----------
   CONFIRM before release. These come from the shop's Instagram captions.
   The old website (thedallastint.com) lists different hours; the Google
   Business Profile is the authority — whatever it shows, set here, and the
   UI and structured data both follow. */
export type HoursRow = {
  /** Display label, e.g. "Mon – Sat" */
  label: string;
  /** Display value, e.g. "10:00 AM – 7:00 PM" or "Closed" */
  value: string;
  /** schema.org days this row covers */
  days: string[];
  /** 24h "HH:MM", omitted when closed */
  opens?: string;
  closes?: string;
};

const HOURS: HoursRow[] = [
  {
    label: "Mon – Sat",
    value: "10:00 AM – 7:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  },
  { label: "Sunday", value: "Closed", days: ["Sunday"] },
];

/* ---------- Google ----------
   Place ID comes from NEXT_PUBLIC_GOOGLE_PLACE_ID — or GOOGLE_PLACE_ID,
   which next.config.mjs maps onto it — set in Vercel. It is
   not a secret, Google's terms allow storing it indefinitely, and the
   NEXT_PUBLIC_ prefix inlines it at build so server and browser agree.
   CONFIRM it belongs to the listing at 630 S Central Expy #104 —
   ⚠️ "Dallas Window Tint" at 10825 Plano Rd is a different company.

   Unset, every link below falls back to a name + address search, which
   still lands on Google Maps — just less precisely — and the
   "Leave a review" button is hidden. */
const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID?.trim() ?? "";

const MAPS_QUERY = encodeURIComponent(
  `Dallas Tint Shop, 630 S Central Expy #104, Richardson, TX ${ADDRESS.postalCode}`,
);

function withPlace(base: string, param: string): string {
  return GOOGLE_PLACE_ID ? `${base}&${param}=${GOOGLE_PLACE_ID}` : base;
}

const GOOGLE = {
  placeId: GOOGLE_PLACE_ID,
  /** The business on Google Maps. */
  mapsUrl: withPlace(
    `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
    "query_place_id",
  ),
  /** Turn-by-turn directions. Opens the Maps app on phones that have it. */
  directionsUrl: withPlace(
    `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`,
    "destination_place_id",
  ),
  /** All reviews: the Maps listing, with the Reviews tab one tap away.
      (search.google.com/local/reviews?placeid= now 404s — don't use it.) */
  reviewsUrl: withPlace(
    `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
    "query_place_id",
  ),
  /** Opens Google's write-a-review dialog. Needs the Place ID; null until
      it is set, and the UI hides the button rather than guess. */
  writeReviewUrl: GOOGLE_PLACE_ID
    ? `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`
    : null,
} as const;

/* ---------- social ---------- */
const SOCIAL = {
  instagram: "https://www.instagram.com/thedallastintshop/",
  instagramHandle: "@thedallastintshop",
  // Verified: TikTok's oEmbed endpoint returns "Dallas Tint Shop" for this
  // profile.
  tiktok: "https://www.tiktok.com/@dallastintshop",
  tiktokHandle: "@dallastintshop",
  // A Facebook page is linked from the old website but has not been
  // confirmed as current — CONFIRM before adding it here and to sameAs.
} as const;

export const BUSINESS = {
  name: "Dallas Tint Shop",
  phone: "(469) 655-2884",
  phoneHref: "tel:+14696552884",
  /** Digits only — for sms: links */
  smsDigits: "4696552884",
  address: ADDRESS,
  addressLine: ADDRESS_LINE,
  addressShort: "Richardson, TX",
  // From the Google listing's map pin.
  geo: { latitude: 32.9445245, longitude: -96.7411731 },
  hours: HOURS,
  google: GOOGLE,
  social: SOCIAL,
  logo: {
    /** Original artwork: transparent background and transparent letter
        fills, designed for white. Used where the background is white
        (schema.org logo, which Google shows on light surfaces). */
    src: "/brand/dallas-tint-shop-logo.png",
    /** Same artwork with only the enclosed letter fills set to white, for
        the site's dark surfaces. Generated by scripts/brand/make-dark-logo.py
        — regenerate rather than edit. */
    darkSrc: "/brand/dallas-tint-shop-logo-dark.png",
    width: 1041,
    height: 240,
    alt: "Dallas Tint Shop",
  },
} as const;

/* ---------- claims ----------
   Worded exactly as the client stated them. Do not upgrade either into a
   more specific designation (dealer tier, named warranty programme) without
   written confirmation from the shop. */

export const CERTIFICATION = "LLumar Certified";

export const WARRANTY = {
  label: "Lifetime Warranty*",
  note: "*Coverage and exclusions vary by service and product. Contact the shop for warranty details.",
} as const;
