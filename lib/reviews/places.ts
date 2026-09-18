/* ============================================================
   Live Google reviews via Places API (New) — Place Details.

   Why this provider: it is the simplest official source. One server-side
   request returns the rating, the review count and up to FIVE reviews
   (Google chooses and orders them), each with author attribution and a
   link to the review on Google Maps. The Business Profile API can return
   every review, but needs the owner's OAuth consent and a separate access
   approval — worth doing later if more than five cards are wanted.

   Terms this code is written to (checked 2026-09-17):
   - Google Maps Platform Service Specific Terms §14.3 (last modified
     2026-06-10): the only Places content that may be cached is
     latitude/longitude, for up to 30 days. Everything else — reviews,
     rating, count — may not be pre-fetched, cached or stored. The place
     ID is exempt and may be stored indefinitely.
   - Places API policies (updated 2026-09-16): show "Google Maps"
     attribution, attribute each author with the available name, photo and
     profile link, link each review to Google Maps via its googleMapsUri,
     and state how reviews are ordered and filtered.

   So: every fetch is `no-store`, the response is served `no-store`, and
   nothing here is written to disk, a database, ISR or the image
   optimiser. If Google ever permits caching reviews, revisit this —
   until then, every page view that reaches the reviews section is one
   billable Place Details request (the reviews field is billed at the
   Enterprise + Atmosphere SKU; check current pricing).

   Env:
     GOOGLE_PLACES_API_KEY        server only — never NEXT_PUBLIC_. Restrict
                                  the key to "Places API (New)".
     NEXT_PUBLIC_GOOGLE_PLACE_ID  the listing's place ID (not secret).
   ============================================================ */

// Relative imports: this file is also compiled for tests/ outside Next.
import { BUSINESS } from "../business";
import type { LiveReviews, Review, ReviewsResponse } from "./types";

export const FIELD_MASK = "rating,userRatingCount,reviews,googleMapsLinks";
const TIMEOUT_MS = 6000;

export function placesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY && BUSINESS.google.placeId);
}

type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  publishTime?: string;
  googleMapsUri?: string;
};

type PlaceDetails = {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
};

export class ProviderError extends Error {}

type FetchOptions = {
  apiKey?: string;
  placeId?: string;
  /** Injected in tests; defaults to global fetch */
  fetchImpl?: typeof fetch;
};

export async function fetchPlacesReviews({
  apiKey = process.env.GOOGLE_PLACES_API_KEY,
  placeId = BUSINESS.google.placeId,
  fetchImpl = fetch,
}: FetchOptions = {}): Promise<LiveReviews> {
  if (!apiKey || !placeId) throw new ProviderError("not configured");

  let res: Response;
  try {
    res = await fetchImpl(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
  } catch (err) {
    throw new ProviderError(err instanceof Error ? err.message : "request failed");
  }
  if (!res.ok) throw new ProviderError(`HTTP ${res.status}`);

  let data: PlaceDetails;
  try {
    data = (await res.json()) as PlaceDetails;
  } catch {
    throw new ProviderError("invalid JSON");
  }

  const reviews: Review[] = (data.reviews ?? []).flatMap((r, i) => {
    const text = r.text?.text ?? r.originalText?.text ?? "";
    const authorName = r.authorAttribution?.displayName;
    if (!authorName || typeof r.rating !== "number") return [];
    return [
      {
        id: r.name ?? `review-${i}`,
        authorName,
        authorPhotoUrl: r.authorAttribution?.photoUri,
        authorUrl: r.authorAttribution?.uri,
        rating: r.rating,
        text,
        publishedAt: r.publishTime,
        relativeTime: r.relativePublishTimeDescription,
        reviewUrl: r.googleMapsUri,
      },
    ];
  });

  return {
    status: "live",
    rating: typeof data.rating === "number" ? data.rating : null,
    count: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    reviews,
    links: {
      reviews: data.googleMapsLinks?.reviewsUri,
      writeReview: data.googleMapsLinks?.writeAReviewUri,
    },
  };
}

/* What /api/reviews returns for each outcome. Kept here, out of the route,
   so tests can exercise every branch without a server. */
export async function reviewsResponse(opts: FetchOptions = {}): Promise<{
  status: number;
  body: ReviewsResponse;
}> {
  const apiKey = opts.apiKey ?? process.env.GOOGLE_PLACES_API_KEY;
  const placeId = opts.placeId ?? BUSINESS.google.placeId;
  if (!apiKey || !placeId) {
    return { status: 503, body: { status: "unavailable", reason: "not-configured" } };
  }
  try {
    const live = await fetchPlacesReviews({ ...opts, apiKey, placeId });
    if (live.reviews.length === 0) {
      return { status: 503, body: { status: "unavailable", reason: "empty" } };
    }
    return { status: 200, body: live };
  } catch (err) {
    console.error("reviews: provider error:", err instanceof Error ? err.message : err);
    return { status: 502, body: { status: "unavailable", reason: "provider-error" } };
  }
}
