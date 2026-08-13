import { IG_POSTS } from "./gallery";

/* ⚠️ LAUNCH BLOCKERS — every field marked TODO below is invented.
   None of it can go live on the shop's real domain as-is. */
export const BUSINESS = {
  name: "Dallas Tint Shop",
  shortName: "DTS",
  // Phone, address and hours below are transcribed from the shop's own
  // Instagram captions (the same block appears on 84–90 posts).
  phone: "(469) 655-2884",
  phoneHref: "tel:+14696552884",
  instagram: "https://instagram.com/thedallastintshop",
  instagramHandle: "@thedallastintshop",
  address: "630 South Central Expressway, Suite 104, Richardson, TX 75080",
  addressShort: "Richardson, TX",
  mapsHref:
    "https://www.google.com/maps/dir/?api=1&destination=630+South+Central+Expressway+Suite+104+Richardson+TX+75080",
  hours: [
    { day: "Mon – Sat", hours: "10:00 AM – 7:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  // Verified against their Google Business Profile (Dallas Tint Shop,
  // 630 S Central Expy #104 — the listing that matches this phone number).
  // Re-check periodically; the count only goes up.
  rating: 5.0,
  reviewCount: 138,
} as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  bullets: string[];
  /** Real shop photography pulled from @thedallastintshop (see lib/gallery.ts). */
  image: string;
  tag: string;
};

export const SERVICES: Service[] = [
  {
    slug: "ceramic-window-tint",
    title: "Ceramic Window Tint",
    short:
      "Heat-rejecting nano-ceramic tint that keeps Dallas summers off your skin and your interior pristine.",
    bullets: [
      "Up to 99% UV / IR rejection",
      "Lifetime warranty",
      "Lab-cut precision install",
    ],
    image:
      "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_2.jpg",
    tag: "Tint",
  },
  {
    slug: "paint-protection-film",
    title: "Paint Protection Film",
    short:
      "Self-healing PPF that guards your clear coat from rock chips, road rash, and Texas highway abuse.",
    bullets: [
      "Full-front, track pack & full-body coverage",
      "Self-healing top coat",
      "10-year warranty",
    ],
    image:
      "/gallery/ppf/2026-01-28_car_ppf_DUEnTXCDqoQ_1.jpg",
    tag: "PPF",
  },
  {
    slug: "vinyl-wraps",
    title: "Vinyl Wraps",
    short:
      "Color change wraps in satin, gloss, matte, and chrome — installed clean enough to fool a factory rep.",
    bullets: ["Full color change", "Accents, roofs & hoods", "Avery / 3M / KPMF"],
    image:
      "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_2.jpg",
    tag: "Wraps",
  },
  {
    slug: "ceramic-coating",
    title: "Ceramic Coating",
    short:
      "9H-rated coatings that lock in gloss, water-bead like a magnet, and turn weekly washes into a 10-minute job.",
    bullets: ["2, 5, 7 & 10-year systems", "Hydrophobic finish", "UV stable"],
    image:
      "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_3.jpg",
    tag: "Coating",
  },
  {
    slug: "paint-correction",
    title: "Paint Correction",
    short:
      "Multi-stage machine polish that removes swirls, etching, and oxidation to reset your paint to better-than-new.",
    bullets: ["1, 2 & 3-stage corrections", "Wet sanding available", "Pre-coating prep"],
    image:
      "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_1.jpg",
    tag: "Correction",
  },
  // Detailing removed — the shop does not offer it.
  {
    slug: "powder-coating",
    title: "Powder Coating",
    short:
      "Durable powder coating for wheels, calipers, and trim. Gloss black, satin red, custom colors — your call.",
    bullets: ["Wheels & calipers", "Custom color match", "Chip & corrosion proof"],
    image:
      "/gallery/shop/2025-11-21_bentley_shop_DRVRIvlDnoJ_3.jpg",
    tag: "Powder",
  },
];

export type WorkFilter = "tint" | "ppf" | "wrap" | "detail";

export type ShowcaseTile = {
  /** Unique per tile — the same post can contribute several photos. */
  key: string;
  /** Instagram permalink */
  url: string;
  kind: "photo" | "reel";
  /** Still image, or the poster frame for a reel */
  src: string;
  /** Local mp4, reels only */
  video: string | null;
  /** Badge text on the tile */
  service: string;
  filter: WorkFilter;
  alt: string;
  plays: number | null;
};

/* ---------------------------------------------------------------------
   THE WORK — one feed, built from two sources.

   This replaces what used to be three separate sections all showing the
   same Instagram account (a stills grid, a reels rail, and a six-thumbnail
   follow strip). Twenty-two tiles of one feed in a single scroll read as
   padding; one filterable section reads as a portfolio.

   Stills come from the shop's photo carousels — never from reel covers,
   which carry burned-in captions ("HOW MUCH TINT BEETLE") that look like
   clickbait on a gallery wall. Reels keep their covers, because there the
   text belongs to a video you can actually play.

   `filter` is set per tile, not inherited from the post: one carousel
   (DGRSZKAOQGo) is a mixed showcase whose individual photos span tint,
   PPF and wrap work, so the post's own category would mislabel them.
--------------------------------------------------------------------- */
const STILLS: (Omit<ShowcaseTile, "kind" | "video" | "plays" | "url"> & {
  code: string;
})[] = [
  {
    key: "corvette-sign",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_12.jpg",
    alt: "Red Corvette parked under the Dallas Tint Shop storefront sign",
    service: "Paint Protection Film",
    filter: "ppf",
  },
  {
    key: "bentley-grille",
    code: "DRVRIvlDnoJ",
    src: "/gallery/shop/2025-11-21_bentley_shop_DRVRIvlDnoJ_1.jpg",
    alt: "Bronze Bentley Bentayga front grille detail",
    service: "Bentley Detail",
    filter: "detail",
  },
  {
    key: "bmw-x7",
    code: "DGduQZuuae1",
    src: "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_4.jpg",
    alt: "White BMW X7 with freshly tinted windows in the install bay",
    service: "Window Tint",
    filter: "tint",
  },
  {
    key: "yellow-911",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_8.jpg",
    alt: "Yellow Porsche 911 in the Dallas Tint Shop bay",
    service: "Paint Protection Film",
    filter: "ppf",
  },
  {
    key: "purple-chrome-tesla",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_7.jpg",
    alt: "Tesla finished in a purple chrome colour-change wrap",
    service: "Vinyl Wrap",
    filter: "wrap",
  },
  {
    key: "grey-911",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_5.jpg",
    alt: "Grey Porsche 911 outside the Richardson shop",
    service: "Paint Protection Film",
    filter: "ppf",
  },
  {
    key: "corvette-c8",
    code: "DHL6CTds3NP",
    src: "/gallery/tint/2025-03-14_car_tint_DHL6CTds3NP_1.jpg",
    alt: "Black Corvette C8 in the bay against the Dallas Tint Shop mural",
    service: "Window Tint",
    filter: "tint",
  },
  {
    key: "range-rover",
    code: "DGduQZuuae1",
    src: "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_5.jpg",
    alt: "Champagne Range Rover with tinted glass under the shop lights",
    service: "Window Tint",
    filter: "tint",
  },
  {
    key: "green-amg",
    code: "DVJlgI-jhGb",
    src: "/gallery/ppf/2026-02-24_mercedes_ppf_DVJlgI-jhGb_4.jpg",
    alt: "Mercedes-AMG finished in green paint protection film",
    service: "Paint Protection Film",
    filter: "ppf",
  },
  {
    key: "porsche-crest",
    code: "DTv-QkxDn6N",
    src: "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_3.jpg",
    alt: "Porsche crest on deep green gloss after a colour change",
    service: "Vinyl Wrap",
    filter: "wrap",
  },
  {
    key: "bentley-wheel",
    code: "DRVRIvlDnoJ",
    src: "/gallery/shop/2025-11-21_bentley_shop_DRVRIvlDnoJ_3.jpg",
    alt: "Bentley wheel face after powder coating",
    service: "Powder Coating",
    filter: "detail",
  },
  {
    key: "lambo-bay",
    code: "DG3e4auuq0Z",
    src: "/gallery/ppf/2025-03-06_car_ppf_DG3e4auuq0Z_2.jpg",
    alt: "White BMW in the bay beside the Dallas Tint Shop mural",
    service: "Window Tint",
    filter: "tint",
  },
];

/* Reels are single-subject posts, so their own classification is reliable —
   unlike the mixed carousel above, which needed per-photo assignment.
   Anything that is not one of the three headline services files under
   "detail" (shop-floor work, wheels, coatings). */
const FILTER_OF: Record<string, WorkFilter> = {
  tint: "tint",
  ppf: "ppf",
  wrap: "wrap",
};

const stillTiles: ShowcaseTile[] = STILLS.flatMap((t) => {
  const post = IG_POSTS.find((p) => p.code === t.code);
  if (!post) return [];
  const { code, ...rest } = t;
  return [{ ...rest, kind: "photo" as const, video: null, plays: null, url: post.url }];
});

const reelTiles: ShowcaseTile[] = IG_POSTS.filter((p) => p.video).map((p) => ({
  key: p.code,
  url: p.url,
  kind: "reel" as const,
  src: p.images[0],
  video: p.video,
  service: p.service,
  filter: FILTER_OF[p.category] ?? "detail",
  alt: p.alt,
  plays: p.plays,
}));

/* Interleave so the grid alternates stills and video rather than showing
   one block of each — the mix is the point. Most-watched reel leads. */
export const SHOWCASE: ShowcaseTile[] = (() => {
  const reels = [...reelTiles].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
  const out: ShowcaseTile[] = [];
  const max = Math.max(reels.length, stillTiles.length);
  for (let i = 0; i < max; i++) {
    if (reels[i]) out.push(reels[i]);
    if (stillTiles[i]) out.push(stillTiles[i]);
    if (stillTiles[i + max]) out.push(stillTiles[i + max]);
  }
  return out;
})();

export const WORK_FILTERS: { value: WorkFilter | "all"; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "tint", label: "Tint" },
  { value: "ppf", label: "PPF" },
  { value: "wrap", label: "Wraps" },
  { value: "detail", label: "Details" },
];

export type Review = {
  name: string;
  car: string;
  rating: number;
  body: string;
  source: "Google" | "Instagram" | "Yelp";
  /** How Google displays the age of the review */
  when: string;
};

/* Verbatim from the shop's Google Business Profile — Dallas Tint Shop,
   630 S Central Expy #104, Richardson (5.0 from 138). Every one of these
   was read off that listing; the four invented testimonials that used to
   live here are gone.

   ⚠️ Two rules if you add more:
   1. VERIFY THE LISTING. "Dallas Window Tint" at 10825 Plano Rd is a
      different company with its own 4.8/140 — their reviews are not ours.
   2. Quote verbatim and keep the author's name as Google shows it.
      Signed out, Google only serves three reviews; sign in to the shop's
      account to pull the rest.

   `car` is our own summary of what the reviewer described, not a Google
   field — Google reviews have no vehicle attribute. */
export const REVIEWS: Review[] = [
  {
    name: "Uli Mar",
    car: "Lexus — window tint",
    rating: 5,
    body:
      "This place is AMAZING! If I can give 100 stars I would! Curly is the best, will get you right and make sure you are well taken care of!! I came in needing tint for my Lexus and these guys took their time and paid attention to detail and got my car looking right!",
    source: "Google",
    when: "5 months ago",
  },
  {
    name: "Trung Ha",
    car: "Window tint + panoramic roof",
    rating: 5,
    body:
      "The team took the time to understand exactly what I was looking for and recommended the best tint solution based on my specific needs instead of trying to upsell me. The workmanship is flawless, the installation is incredibly clean, and the heat reduction is immediately noticeable.",
    source: "Google",
    when: "1 month ago",
  },
  {
    name: "Raul Camargo",
    car: "2026 Honda Odyssey — nano ceramic",
    rating: 5,
    body:
      "They installed nano ceramic tint on all the windows of my 2026 Odyssey Van, and the results came out amazing. The customer service was professional, the installation was very clean, and you can immediately feel the difference in heat rejection.",
    source: "Google",
    when: "2 months ago",
  },
];

export const TRUST_CHIPS = [
  "Ceramic Tint",
  "PPF",
  "Vinyl Wraps",
  "Ceramic Coating",
  "Paint Correction",
  "Richardson / Dallas, TX",
];

export const WHY_POINTS = [
  {
    n: "01",
    title: "Performance-grade materials",
    // SunTek removed — not an authorized dealer.
    // TODO: Confirm the remaining brands with the owner before launch.
    body: "Only top-tier films and coatings — XPEL, 3M, Avery, KPMF. No bargain-bin film, ever.",
  },
  {
    n: "02",
    title: "Studio-clean install bay",
    body: "Dust-controlled, LED-lit, climate stable. The environment your paint deserves before it gets wrapped or coated.",
  },
  {
    n: "03",
    title: "Built by enthusiasts",
    body: "We drive the same cars you do. Teslas, Hellcats, M-cars, AMGs — we treat every build like it's parked in our own garage.",
  },
  {
    n: "04",
    title: "Backed by warranty",
    body: "Lifetime tint warranty. 10-year PPF warranty. Ceramic coatings up to 10 years. In writing, every time.",
  },
];
