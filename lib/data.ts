export const BUSINESS = {
  name: "Dallas Tint Shop",
  shortName: "DTS",
  phone: "(469) 555-0123", // TODO: replace with real number
  phoneHref: "tel:+14695550123",
  instagram: "https://instagram.com/thedallastintshop",
  instagramHandle: "@thedallastintshop",
  address: "630 South Central Expressway, Richardson, TX 75080",
  addressShort: "Richardson, TX",
  mapsHref:
    "https://www.google.com/maps/dir/?api=1&destination=630+South+Central+Expressway+Richardson+TX+75080",
  hours: [
    { day: "Mon – Fri", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
    { day: "Sunday", hours: "By Appointment" },
  ],
  rating: 5.0,
  reviewCount: 180,
} as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  bullets: string[];
  // Image source (placeholder Unsplash automotive shots).
  // TODO: Replace these with real studio photography from Dallas Tint Shop.
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
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80",
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
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1600&q=80",
    tag: "PPF",
  },
  {
    slug: "vinyl-wraps",
    title: "Vinyl Wraps",
    short:
      "Color change wraps in satin, gloss, matte, and chrome — installed clean enough to fool a factory rep.",
    bullets: ["Full color change", "Accents, roofs & hoods", "Avery / 3M / KPMF"],
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80",
    tag: "Wraps",
  },
  {
    slug: "ceramic-coating",
    title: "Ceramic Coating",
    short:
      "9H-rated coatings that lock in gloss, water-bead like a magnet, and turn weekly washes into a 10-minute job.",
    bullets: ["2, 5, 7 & 10-year systems", "Hydrophobic finish", "UV stable"],
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    tag: "Coating",
  },
  {
    slug: "paint-correction",
    title: "Paint Correction",
    short:
      "Multi-stage machine polish that removes swirls, etching, and oxidation to reset your paint to better-than-new.",
    bullets: ["1, 2 & 3-stage corrections", "Wet sanding available", "Pre-coating prep"],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    tag: "Correction",
  },
  {
    slug: "detailing",
    title: "Detailing",
    short:
      "Showroom-grade interior and exterior detailing — the kind of clean enthusiasts notice in the first 30 seconds.",
    bullets: ["Full interior reset", "Engine bay detail", "Maintenance washes"],
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80",
    tag: "Detail",
  },
  {
    slug: "powder-coating",
    title: "Powder Coating",
    short:
      "Durable powder coating for wheels, calipers, and trim. Gloss black, satin red, custom colors — your call.",
    bullets: ["Wheels & calipers", "Custom color match", "Chip & corrosion proof"],
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80",
    tag: "Powder",
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  span?: "tall" | "wide" | "square";
};

// TODO: Replace placeholders with real Dallas Tint Shop work photography.
export const GALLERY: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    alt: "Black Tesla Model S with full ceramic tint",
    span: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    alt: "Lamborghini under garage LED lighting",
    span: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
    alt: "Red Dodge Challenger Hellcat under shop lights",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80",
    alt: "Window tint install close up",
    span: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80",
    alt: "PPF installer working on hood",
    span: "tall",
  },
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    alt: "Water beading on ceramic coated paint",
    span: "square",
  },
  {
    src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    alt: "Satin wrap finished BMW",
    span: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1617814086367-ed64d6dfafce?auto=format&fit=crop&w=1200&q=80",
    alt: "BMW M3 in red ambient garage lighting",
    span: "square",
  },
];

export type Review = {
  name: string;
  car: string;
  rating: number;
  body: string;
  source: "Google" | "Instagram" | "Yelp";
};

export const REVIEWS: Review[] = [
  {
    name: "Marcus T.",
    car: "2024 Tesla Model 3 Performance",
    rating: 5,
    body:
      "Full front PPF + ceramic tint and these guys did not miss a single edge. Cleanest install I’ve seen in Dallas — and I shopped around.",
    source: "Google",
  },
  {
    name: "Jordan R.",
    car: "Hellcat Redeye Widebody",
    rating: 5,
    body:
      "Got my Hellcat wrapped satin black with red accents and the calipers powder coated. Looks like it rolled out of a SEMA booth.",
    source: "Google",
  },
  {
    name: "Priya K.",
    car: "BMW M340i",
    rating: 5,
    body:
      "Booked the ceramic coating + 2-stage paint correction. Texas sun does not play. The gloss came back like new and water rolls right off.",
    source: "Instagram",
  },
  {
    name: "Devon S.",
    car: "Cadillac CT5-V Blackwing",
    rating: 5,
    body:
      "Best shop in Richardson. Transparent pricing, real talk on what my car needed, and the showroom is something else.",
    source: "Google",
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
    body: "Only top-tier films and coatings — XPEL, SunTek, 3M, Avery, KPMF. No bargain-bin film, ever.",
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
