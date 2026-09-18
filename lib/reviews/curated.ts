import type { Review } from "./types";

/* Shown when live Google reviews are not configured or unavailable.

   Provenance: copied word for word from the shop's Google Business Profile
   (Dallas Tint Shop, 630 S Central Expy #104, Richardson) on 2026-08-12.

   What is deliberately NOT here:
   - Dates. Google showed only relative ages ("5 months ago") at the time,
     and converting those to dates would be inventing them.
   - The rating and review count. They were correct on 2026-08-12 and are
     not re-verified, so the page does not show them unless they come live
     from Google.
   - Vehicle summaries. Google reviews have no vehicle field; the old site
     added its own, which read as if Google had said it.

   Adding more: quote verbatim, keep the author's name as Google shows it,
   and check the listing — "Dallas Window Tint" at 10825 Plano Rd is a
   different company. */
export const CURATED_REVIEWS: Review[] = [
  {
    id: "uli-mar",
    authorName: "Uli Mar",
    rating: 5,
    text: "This place is AMAZING! If I can give 100 stars I would! Curly is the best, will get you right and make sure you are well taken care of!! I came in needing tint for my Lexus and these guys took their time and paid attention to detail and got my car looking right!",
  },
  {
    id: "trung-ha",
    authorName: "Trung Ha",
    rating: 5,
    text: "The team took the time to understand exactly what I was looking for and recommended the best tint solution based on my specific needs instead of trying to upsell me. The workmanship is flawless, the installation is incredibly clean, and the heat reduction is immediately noticeable.",
  },
  {
    id: "raul-camargo",
    authorName: "Raul Camargo",
    rating: 5,
    text: "They installed nano ceramic tint on all the windows of my 2026 Odyssey Van, and the results came out amazing. The customer service was professional, the installation was very clean, and you can immediately feel the difference in heat rejection.",
  },
];
