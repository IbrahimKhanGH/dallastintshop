/* ============================================================
   Services — single source for cards, service pages, footer links,
   quote-form options, sitemap and structured data.

   Copy rules (this is a real shop's site):
   - Only claim what the shop has confirmed or shown in its own posts.
     Every specific below traces to an Instagram caption (quoted in the
     comment beside it) or to the owner's own list of services.
   - No invented packages, install methods, durations, specs or brands.
     If a customer needs to know, the copy sends them to the quote form.
   - Warranty wording comes from WARRANTY in lib/business.ts only.
   ============================================================ */

import { CERTIFICATION, WARRANTY } from "./business";

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  /** Full name, used in headings and schema */
  name: string;
  /** Short badge text on cards */
  tag: string;
  /** One-line card summary */
  summary: string;
  /** Card / page highlights. Keep each one defensible. */
  highlights: string[];
  /** Hero image for the card and page — real shop photography */
  image: string;
  imageAlt: string;
  /** Instagram shortcodes whose captions name this service (lib/gallery.ts) */
  workCodes: string[];
  /** Service-page copy */
  page: {
    title: string;
    metaDescription: string;
    h1: string;
    intro: string[];
    faqs: Faq[];
  };
};

const WARRANTY_FAQ: Faq = {
  q: "Is the work covered by a warranty?",
  a: `Yes — everything we do is backed by our ${WARRANTY.label.replace("*", "")}. ${WARRANTY.note.replace("*", "")}`,
};

/* The six services the owner named as the main push, in the order the
   homepage shows them. Chrome delete sits in the first row on purpose —
   the owner asked for it to be taken seriously, not tucked at the end. */
export const SERVICES: Service[] = [
  {
    slug: "window-tint",
    name: "Window Tint",
    tag: "Tint",
    summary:
      "LLumar ceramic window tint for heat, glare and privacy — from two front windows to the full car and windshield.",
    highlights: [
      CERTIFICATION,
      "LLumar ceramic films",
      "Side windows, rear glass & windshields",
      WARRANTY.label,
    ],
    // "Premium tint, and premium service trusted by many"
    image: "/gallery/tint/2025-03-14_car_tint_DHL6CTds3NP_1.jpg",
    imageAlt: "Black Corvette C8 with fresh window tint in the Dallas Tint Shop bay",
    workCodes: [
      "DHL6CTds3NP",
      "DGduQZuuae1",
      "Db6P4CpI634",
      "DKu38TLOB23",
      "DHlplw0MNb-",
      "DJo4TRoOVSB",
      "DI_u6TLOILU",
      "DHtSnIisGBb",
      "DHJj_N6Oe-F",
    ],
    page: {
      title: "Window Tint in Richardson & Dallas, TX",
      metaDescription:
        "LLumar Certified window tint in Richardson, TX. LLumar ceramic film on side windows, rear glass and windshields. Lifetime Warranty*. Get a quote from Dallas Tint Shop.",
      h1: "Window tint in Richardson & Dallas",
      intro: [
        // Client statement: "ALSO DOES LLUMAR CERTIFIED"
        "Dallas Tint Shop is LLumar Certified, and LLumar film is what goes on our customers' glass — including LLumar's ceramic tint lines like CTX. Ceramic film is built to cut heat and UV without the dark, cheap look.",
        // Captions: "5% all around and 30% front windshield", "70% windshield,
        // 15% front windows, and 5% rear", "Two front windows and front
        // windshield installed", "X4 came in for two front windows to match
        // the back"
        "We tint everything from sedans and work vans to G-Wagons and C8s: full cars, windshields, or just the two fronts to match the factory rear glass. Tell us the shade you're after — we've installed everything from 5% limo to a light 70% windshield film.",
      ],
      faqs: [
        {
          q: "What tint film do you use?",
          a: "We're LLumar Certified and install LLumar window film, including their ceramic lines. Tell us what matters most — heat, privacy or looks — and we'll recommend a film in your quote.",
        },
        {
          q: "Can you tint my windshield?",
          a: "Yes. Windshield tint is one of the jobs we do most, usually alongside the side windows. Let us know the shade you want when you request a quote.",
        },
        {
          q: "Can you match my front windows to the factory rear tint?",
          a: "Yes — tinting just the two front windows to match the back is a common quick job for us.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
  {
    slug: "paint-protection-film",
    name: "Paint Protection Film",
    tag: "PPF",
    summary:
      "Clear, satin and colored PPF that takes the rock chips and road rash so your paint doesn't.",
    highlights: [
      "Clear, satin & colored film",
      "Partial or full-vehicle coverage",
      "Careful badge & edge work",
      WARRANTY.label,
    ],
    // "The way that PPF shines in the sun G63 came in for a full vehicle
    //  @llumarfilms Satin PPF"
    image: "/gallery/ppf/2025-04-26_car_ppf_DI6jTymuD31.jpg",
    imageAlt: "Mercedes G63 finished in full-vehicle satin paint protection film",
    workCodes: [
      "DI6jTymuD31",
      "DWSN72VDouh",
      "DRLVR6JDMXm",
      "DRiOuabjiDc",
      "DP7JvAFjode",
      "DE3YJtJSEXP",
    ],
    page: {
      title: "Paint Protection Film (PPF) in Richardson & Dallas, TX",
      metaDescription:
        "Clear, satin and colored paint protection film in Richardson, TX — partial or full-vehicle PPF with a Lifetime Warranty*. Get a quote from Dallas Tint Shop.",
      h1: "Paint protection film in Richardson & Dallas",
      intro: [
        "Paint protection film is a tough, clear urethane layer installed over your paint. It takes the rock chips, road rash and light scratches that North Texas highways hand out, so the paint underneath stays factory-fresh.",
        // "G63 came in for a full vehicle @llumarfilms Satin PPF",
        // "Genesis GV80 getting a Fiery Orange PPF",
        // "This is how we ensure the most accurate badge placement on your
        //  PPFed vehicle!"
        "It doesn't have to be clear, either. We've wrapped a G63 in full-vehicle satin PPF and turned a Genesis GV80 Fiery Orange with colored film — with the badge and edge work done carefully enough that it reads like paint.",
      ],
      faqs: [
        {
          q: "Do you install satin or colored PPF?",
          a: "Yes. Alongside clear film we've done full-vehicle satin PPF and colored PPF. Tell us the look you're after and we'll quote the options.",
        },
        {
          q: "How much of my car should I cover?",
          a: "It depends on how and where you drive and on your budget. Some owners protect the areas that take the most hits; others cover the whole car. We'll lay out the options in your quote.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
  {
    slug: "chrome-delete",
    name: "Chrome Delete",
    tag: "Chrome Delete",
    summary:
      "Black out the factory chrome for a cleaner, more aggressive look.",
    highlights: [
      "Blacked-out exterior trim",
      "A big change on trucks & SUVs",
      "Pairs with tint and coating",
      WARRANTY.label,
    ],
    // "Denali came in for @llumarfilms ceramic tint, @ceramicprousa coating,
    //  and chrome delete!"
    image: "/gallery/tint/2025-03-18_gmc_tint_DHWQLm1vHU5.jpg",
    imageAlt: "Black GMC Denali after a chrome delete, parked outside the Dallas Tint Shop storefront",
    workCodes: ["DHWQLm1vHU5", "DG8e_UZsLE7"],
    page: {
      title: "Chrome Delete in Richardson & Dallas, TX",
      metaDescription:
        "Chrome delete in Richardson, TX — black out factory chrome trim on trucks, SUVs and cars. Combine with window tint and ceramic coating. Get a quote from Dallas Tint Shop.",
      h1: "Chrome delete in Richardson & Dallas",
      intro: [
        "Factory chrome dates a car fast. A chrome delete takes the bright trim off the exterior and gives it a darker, cleaner finish that makes the whole vehicle look cleaner, meaner and more expensive.",
        // "How to make your SUV/Vehicle look better with a chrome delete!"
        "It's one of the jobs we take most seriously, and it's a big change on trucks and SUVs in particular. The Denali above came in for a chrome delete alongside LLumar ceramic tint and a ceramic coating — one visit, a completely different truck.",
      ],
      faqs: [
        {
          q: "Which chrome can you delete?",
          a: "Tell us — send the vehicle and the pieces you want blacked out when you request a quote, and we'll confirm what we can cover and how we'd finish it.",
        },
        {
          q: "Can I get a chrome delete and tint at the same time?",
          a: "Yes. Combining chrome delete with window tint and ceramic coating in one visit is common — tick all three on the quote form.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
  {
    slug: "vinyl-wraps",
    name: "Vinyl Wraps",
    tag: "Wraps",
    summary:
      "Full color changes, roofs, hoods and custom decals — a completely new look without a repaint.",
    highlights: [
      "Full color changes",
      "Roofs, hoods & partial wraps",
      "Custom decals & accents",
      WARRANTY.label,
    ],
    // "Wrapped up the Porsche, video coming soon…"
    image: "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_1.jpg",
    imageAlt: "Installer finishing a vinyl wrap on a Porsche in the Dallas Tint Shop bay",
    workCodes: [
      "DTv-QkxDn6N",
      "DEx7B4wPuDV",
      "DJHZo8RulIw",
      "DI3-e5vOcNu",
      "DIWvTqbuL9h",
      "DIwwYmdv8y7",
    ],
    page: {
      title: "Vinyl Wraps in Richardson & Dallas, TX",
      metaDescription:
        "Vinyl wraps in Richardson, TX — full color changes, roof and hood wraps, and custom decals. Lifetime Warranty*. Get a quote from Dallas Tint Shop.",
      h1: "Vinyl wraps in Richardson & Dallas",
      intro: [
        "A wrap changes the whole character of a car without touching the paint underneath. Gloss or satin, subtle or loud — pick the finish, and we'll lay it down clean.",
        // "My turn M8 in for a full vehicle wrap", "Mustang GT came in for a
        //  partial hood wrap and full roof wrap", "G63 in for a fresh wrap on
        //  its hood", "Custom Satin Gold Porsche decals installed on this 718
        //  Cayman"
        "We've done full-vehicle color changes on everything from a BMW M8 to a Porsche, roof and hood wraps on Mustangs and G-Wagons, and custom satin gold decals on a 718 Cayman. Go all in, or just change the parts you care about.",
      ],
      faqs: [
        {
          q: "Do you do partial wraps?",
          a: "Yes — roofs, hoods, accents and decals are all common jobs, as well as full color changes.",
        },
        {
          q: "Wrap or colored PPF?",
          a: "Both change the color. Colored PPF also adds paint protection, while vinyl offers a wider range of colors and finishes. We'll walk you through the trade-offs for your car.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    tag: "Coating",
    summary:
      "A hard, glossy protective layer that makes paint easier to wash and keeps it looking deep.",
    highlights: [
      "Deep gloss & water beading",
      "Easier washing",
      "Pairs with tint, PPF & wraps",
      WARRANTY.label,
    ],
    // "Supra in for @llumarfilms ceramic tint, @ceramicprousa full ceramic
    //  coating, @ wrapped with @3mfilms"
    image: "/gallery/tint/2025-03-26_toyota_tint_DHqzyw2uHHu.jpg",
    imageAlt: "Blue Toyota Supra after ceramic coating, parked outside the Dallas Tint Shop storefront",
    workCodes: ["DHqzyw2uHHu", "DHWQLm1vHU5", "DE5nw9FvnRM"],
    page: {
      title: "Ceramic Coating in Richardson & Dallas, TX",
      metaDescription:
        "Ceramic coating in Richardson, TX for gloss, water beading and easier washing. Combine with tint, PPF or a wrap. Lifetime Warranty*. Get a quote from Dallas Tint Shop.",
      h1: "Ceramic coating in Richardson & Dallas",
      intro: [
        "Wax sits on top of your paint and wears off in weeks. A ceramic coating bonds to the surface and forms a hard, glossy layer that sheds water and dirt, so the car stays cleaner and every wash is quicker.",
        "It pairs naturally with the rest of what we do — the Supra above came in for ceramic tint, a full ceramic coating and a wrap, and the Denali on our chrome delete page got a coating in the same visit.",
      ],
      faqs: [
        {
          q: "Is ceramic coating better than wax?",
          a: "For lasting protection, yes. Wax wears off quickly; a ceramic coating bonds to the paint and lasts far longer while making the car easier to keep clean.",
        },
        {
          q: "Can I coat my car at the same time as other work?",
          a: "Yes. Coating is often done in the same visit as tint, PPF, a wrap or a chrome delete. Select everything you want on the quote form.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
  {
    slug: "powder-coating",
    name: "Powder Coating",
    tag: "Powder",
    summary:
      "A hard, baked-on finish in the color you want. Tell us about your parts and we'll quote it.",
    highlights: [
      "Hard, heat-cured finish",
      "Tell us the part & color",
      WARRANTY.label,
    ],
    // "Subtle upgrade. Serious impact" — the shop's only post classified as
    // powder coating. Scope (which parts) is NOT confirmed: say nothing
    // specific until the owner does.
    image: "/gallery/powder-coating/2026-01-15_cadillac_powder-coating_DTjLjQXDDN-.jpg",
    imageAlt: "Close-up of a Cadillac wheel from a Dallas Tint Shop powder coating post",
    workCodes: ["DTjLjQXDDN-"],
    page: {
      title: "Powder Coating in Richardson & Dallas, TX",
      metaDescription:
        "Powder coating in Richardson, TX — a hard, heat-cured finish in the color you want. Lifetime Warranty*. Tell us about your parts and get a quote from Dallas Tint Shop.",
      h1: "Powder coating in Richardson & Dallas",
      intro: [
        "Powder coating is a dry powder applied to the part and cured with heat, leaving a hard, even finish that holds up far better than spray paint.",
        "Every powder coating job starts with the part. Tell us what you want coated and the color you have in mind, and we'll confirm whether it's a fit and send you a quote.",
      ],
      faqs: [
        {
          q: "What can you powder coat?",
          a: "Ask us. Describe the part — or send photos after we reply — and we'll confirm whether it's a job we can take on.",
        },
        WARRANTY_FAQ,
      ],
    },
  },
];

/* Secondary service. Kept from the original site but pending the owner's
   confirmation that it is still offered, so it gets a small mention and a
   quote-form option — no dedicated page.
   Caption: "Half and half before and after paint correction on this 1998
   M3 goes crazy" */
export const SECONDARY_SERVICES = [
  {
    slug: "paint-correction",
    name: "Paint Correction",
    summary:
      "Machine polishing to take out swirls and haze before your paint gets protected.",
  },
] as const;

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const servicePath = (slug: string) => `/services/${slug}`;
export const quotePath = (slug?: string) => (slug ? `/quote?service=${slug}` : "/quote");
