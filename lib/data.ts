import { IG_POSTS } from "./gallery";
import { CERTIFICATION, WARRANTY } from "./business";

/* Business facts live in lib/business.ts; services in lib/services.ts.
   This file holds the homepage's editorial content: the work showcase and
   the "why us" points. */

export type WorkFilter = "tint" | "ppf" | "wrap" | "chrome-delete" | "more";

export type ShowcaseTile = {
  /** Unique per tile — the same post can contribute several photos. */
  key: string;
  /** Instagram permalink of the post the photo or reel comes from */
  url: string;
  kind: "photo" | "reel";
  /** Still image, or the poster frame for a reel */
  src: string;
  /** Local mp4, reels only */
  video: string | null;
  /** Badge text on the tile */
  label: string;
  filter: WorkFilter;
  alt: string;
  plays: number | null;
};

/* ---------------------------------------------------------------------
   THE WORK — one feed, built from two sources.

   Stills come from the shop's photo posts; reels keep their covers.

   Labels are only as specific as the source supports:
   - A service label ("Window Tint") appears only when the post's caption
     names that service.
   - DGRSZKAOQGo is a general showcase carousel ("for the best tint,
     ceramic coatings, paint corrections, wraps and PPF!") — its photos
     don't say which job each car was in for, so they're labelled
     "Shop showcase" rather than guessed at.
   - DRVRIvlDnoJ ("When you drive a Bentley, the details matter") names no
     service, so its tiles carry the car, not a service.
   Several photos linking to the same carousel post is correct: each one
   is a slide in that post.
--------------------------------------------------------------------- */
const STILLS: (Omit<ShowcaseTile, "kind" | "video" | "plays" | "url"> & {
  code: string;
})[] = [
  {
    key: "c8-tint",
    code: "DHL6CTds3NP", // "Premium tint, and premium service trusted by many"
    src: "/gallery/tint/2025-03-14_car_tint_DHL6CTds3NP_1.jpg",
    alt: "Black Corvette C8 with fresh window tint against the Dallas Tint Shop mural",
    label: "Window Tint",
    filter: "tint",
  },
  {
    key: "denali-chrome-delete",
    code: "DHWQLm1vHU5", // "…ceramic tint, coating, and chrome delete!"
    src: "/gallery/tint/2025-03-18_gmc_tint_DHWQLm1vHU5.jpg",
    alt: "GMC Denali after a chrome delete, ceramic tint and ceramic coating, outside the shop",
    label: "Chrome Delete",
    filter: "chrome-delete",
  },
  {
    key: "g63-satin-ppf",
    code: "DI6jTymuD31", // "G63 came in for a full vehicle Satin PPF"
    src: "/gallery/ppf/2025-04-26_car_ppf_DI6jTymuD31.jpg",
    alt: "Mercedes G63 finished in full-vehicle satin paint protection film",
    label: "Satin PPF",
    filter: "ppf",
  },
  {
    key: "porsche-wrap-install",
    code: "DTv-QkxDn6N", // "Wrapped up the Porsche, video coming soon…"
    src: "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_1.jpg",
    alt: "Installer finishing a vinyl wrap on a Porsche in the bay",
    label: "Vinyl Wrap",
    filter: "wrap",
  },
  {
    key: "bmw-x7-tint",
    code: "DGduQZuuae1", // "Protection, privacy, and pure style. Our tinted windshields…"
    src: "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_4.jpg",
    alt: "White BMW X7 with tinted windows in the install bay",
    label: "Window Tint",
    filter: "tint",
  },
  {
    key: "suv-chrome-delete",
    code: "DG8e_UZsLE7", // "How to make your SUV/Vehicle look better with a chrome delete!"
    src: "/gallery/wrap/2025-03-08_car_wrap_DG8e_UZsLE7.jpg",
    alt: "SUV after a chrome delete at Dallas Tint Shop",
    label: "Chrome Delete",
    filter: "chrome-delete",
  },
  {
    key: "supra-coating",
    code: "DHqzyw2uHHu", // "Supra in for ceramic tint, full ceramic coating, wrapped"
    src: "/gallery/tint/2025-03-26_toyota_tint_DHqzyw2uHHu.jpg",
    alt: "Blue Toyota Supra after ceramic tint, a full ceramic coating and a wrap",
    label: "Tint · Coating · Wrap",
    filter: "more",
  },
  {
    key: "mclaren-showcase",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_7.jpg",
    alt: "Purple McLaren 720S with its doors up in the Dallas Tint Shop bay",
    label: "Shop showcase",
    filter: "more",
  },
  {
    key: "cayman-decals",
    code: "DIwwYmdv8y7", // "Custom Satin Gold Porsche decals installed on this 718 Cayman"
    src: "/gallery/shop/2025-04-22_porsche_shop_DIwwYmdv8y7_1.jpg",
    alt: "Black Porsche 718 Cayman with custom satin gold decals",
    label: "Custom Decals",
    filter: "wrap",
  },
  {
    key: "range-rover-tint",
    code: "DGduQZuuae1",
    src: "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_5.jpg",
    alt: "Champagne Range Rover with tinted glass under the shop lights",
    label: "Window Tint",
    filter: "tint",
  },
  {
    key: "bentley-front",
    code: "DRVRIvlDnoJ",
    src: "/gallery/shop/2025-11-21_bentley_shop_DRVRIvlDnoJ_1.jpg",
    alt: "Bronze Bentley Bentayga front end in the bay",
    label: "Bentley Bentayga",
    filter: "more",
  },
  {
    key: "porsche-crest",
    code: "DTv-QkxDn6N",
    src: "/gallery/wrap/2026-01-20_porsche_wrap_DTv-QkxDn6N_3.jpg",
    alt: "Porsche crest on a freshly wrapped panel",
    label: "Vinyl Wrap",
    filter: "wrap",
  },
  {
    key: "z06-showcase",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_12.jpg",
    alt: "Red Corvette Z06 in front of the Dallas Tint Shop mural",
    label: "Shop showcase",
    filter: "more",
  },
  {
    key: "gle-color-change",
    code: "DVJlgI-jhGb", // "All green on the Mercedes"
    src: "/gallery/ppf/2026-02-24_mercedes_ppf_DVJlgI-jhGb_4.jpg",
    alt: "Mercedes GLE after its color change from red to green",
    label: "Color Change",
    filter: "more",
  },
  {
    key: "escalade-tint",
    code: "DGduQZuuae1",
    src: "/gallery/tint/2025-02-24_car_tint_DGduQZuuae1_6.jpg",
    alt: "Black Cadillac Escalade with tinted windows outside the shop",
    label: "Window Tint",
    filter: "tint",
  },
  {
    key: "bentley-wheel",
    code: "DRVRIvlDnoJ",
    src: "/gallery/shop/2025-11-21_bentley_shop_DRVRIvlDnoJ_3.jpg",
    alt: "Bentley Bentayga wheel and red brake caliper",
    label: "Bentley Bentayga",
    filter: "more",
  },
  {
    key: "911-showcase",
    code: "DGRSZKAOQGo",
    src: "/gallery/ppf/2025-02-19_car_ppf_DGRSZKAOQGo_5.jpg",
    alt: "Silver Porsche 911 outside the Richardson shop",
    label: "Shop showcase",
    filter: "more",
  },
];

/* Reels are single-subject posts, so the classifier's category is usually
   right — but a few captions contradict it or name no service, and those
   are overridden here rather than shown with a guessed label. */
const REEL_OVERRIDES: Record<string, Pick<ShowcaseTile, "label" | "filter">> = {
  // "This isn't a wrap | it's a full transformation"
  DSqHummDguc: { label: "Porsche transformation", filter: "more" },
  // "Is a Lamborghini or a Ferrari easier to wrap?" — a wrap explainer
  DGTk0jAPA8Z: { label: "Wrap talk", filter: "wrap" },
};

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
  label: REEL_OVERRIDES[p.code]?.label ?? (p.category === "shop" ? "Shop work" : p.service),
  filter: REEL_OVERRIDES[p.code]?.filter ?? FILTER_OF[p.category] ?? "more",
  alt: p.alt,
  plays: p.plays,
}));

/* Interleave so the grid alternates stills and video rather than showing
   one block of each. Most-watched reel leads. */
export const SHOWCASE: ShowcaseTile[] = (() => {
  const reels = [...reelTiles].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
  const out: ShowcaseTile[] = [];
  const max = Math.max(reels.length, stillTiles.length);
  for (let i = 0; i < max; i++) {
    if (reels[i]) out.push(reels[i]);
    if (stillTiles[i * 2]) out.push(stillTiles[i * 2]);
    if (stillTiles[i * 2 + 1]) out.push(stillTiles[i * 2 + 1]);
  }
  return out;
})();

export const WORK_FILTERS: { value: WorkFilter | "all"; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "tint", label: "Tint" },
  { value: "ppf", label: "PPF" },
  { value: "wrap", label: "Wraps" },
  { value: "chrome-delete", label: "Chrome Delete" },
  { value: "more", label: "More builds" },
];

export const WHY_POINTS = [
  {
    n: "01",
    title: CERTIFICATION,
    body: "LLumar film on your glass, installed by a LLumar Certified shop. No bargain-bin film, ever.",
  },
  {
    n: "02",
    title: "Real work, real bay",
    body: "Every car on this site came through our shop in Richardson — shot by us, posted by us, linked back to the original post.",
  },
  {
    n: "03",
    title: "Built for enthusiasts",
    body: "M cars, AMGs, C8s, G-Wagons, Lambos and lifted trucks. Every build gets treated like it's parked in our own garage.",
  },
  {
    n: "04",
    title: WARRANTY.label,
    body: "Everything we do is backed by our lifetime warranty. Ask us for the details on your service.",
  },
];
