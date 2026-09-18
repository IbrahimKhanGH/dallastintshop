/* Shape the reviews UI renders, independent of where reviews come from.
   A provider maps its own response into this; the carousel never sees
   provider-specific fields. */

export type Review = {
  id: string;
  authorName: string;
  /** Reviewer's Google profile photo, when the provider supplies one */
  authorPhotoUrl?: string;
  /** Reviewer's Google profile, when the provider supplies one */
  authorUrl?: string;
  rating: number;
  text: string;
  /** ISO timestamp from the provider. Never inferred. */
  publishedAt?: string;
  /** Provider's own age string, e.g. "2 months ago" */
  relativeTime?: string;
  /** This specific review on Google Maps */
  reviewUrl?: string;
};

/** Reviews fetched from Google at request time. */
export type LiveReviews = {
  status: "live";
  rating: number | null;
  count: number | null;
  reviews: Review[];
  /** Google-provided links, when present in the response */
  links: { reviews?: string; writeReview?: string };
};

export type ReviewsUnavailable = {
  status: "unavailable";
  reason: "not-configured" | "provider-error" | "rate-limited" | "empty";
};

export type ReviewsResponse = LiveReviews | ReviewsUnavailable;
