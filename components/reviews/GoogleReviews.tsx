"use client";

import { useEffect, useRef, useState } from "react";
import { Roboto } from "next/font/google";
import type { LiveReviews, Review, ReviewsResponse } from "@/lib/reviews/types";
import { GOOGLE_REVIEW_TOTAL } from "@/lib/reviews/curated";

// Google's attribution rules ask for "Google Maps" set in Roboto.
const roboto = Roboto({ weight: ["400", "500"], subsets: ["latin"], display: "swap" });

type Props = {
  /** Verified reviews rendered into the static page */
  initial: Review[];
  /** True when the server has Places credentials; otherwise never fetch */
  liveEnabled: boolean;
  reviewsUrl: string;
  writeReviewUrl: string | null;
};

/* Google reviews as two rows that drift in opposite directions.

   The verified selection is in the static HTML, so it works without JS and
   for crawlers. If live reviews are configured, the section asks
   /api/reviews once it is near the viewport. Google's rating and review
   count are shown whenever they come back; Google's own review cards (at
   most five) replace the verified selection only when there are more of
   them. The two sets are never mixed. Any failure leaves the verified
   selection in place. */
export default function GoogleReviews({ initial, liveEnabled, reviewsUrl, writeReviewUrl }: Props) {
  const [live, setLive] = useState<LiveReviews | null>(null);
  const [loading, setLoading] = useState(liveEnabled);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!liveEnabled) return;
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        const data = (await res.json()) as ReviewsResponse;
        if (!cancelled && data.status === "live" && data.reviews.length > 0) setLive(data);
      } catch {
        // stay on the verified selection
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!("IntersectionObserver" in window)) {
      void load();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          void load();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [liveEnabled]);

  const useLiveCards = live !== null && live.reviews.length > initial.length;
  const reviews = useLiveCards ? live.reviews : initial;
  const allUrl = live?.links.reviews ?? reviewsUrl;
  const writeUrl = live?.links.writeReview ?? writeReviewUrl;

  return (
    <div ref={rootRef} data-reviews-source={useLiveCards ? "google-live" : "curated"}>
      <div className="flex flex-col gap-6 border-y border-white/10 py-6 lg:flex-row lg:items-end lg:justify-between">
        {live && live.rating !== null ? (
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <span className="h-display text-[clamp(4.5rem,12vw,8rem)] leading-[0.8] text-white">
              {live.rating.toFixed(1)}
            </span>
            <div className="pb-1">
              <Stars rating={live.rating} size={26} />
              <div className="mt-2 flex items-center gap-2 text-base text-white/80">
                <GoogleG className="h-5 w-5 shrink-0" />
                {live.count !== null ? (
                  <span>
                    <span className="font-semibold text-white">
                      {live.count.toLocaleString("en-US")}
                    </span>{" "}
                    reviews on Google
                  </span>
                ) : (
                  <span>Rated on Google</span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/55">
                Rating and reviews from{" "}
                <span translate="no" className={`${roboto.className} text-white/75`}>
                  Google Maps
                </span>
              </p>
            </div>
          </div>
        ) : loading ? (
          <SummarySkeleton />
        ) : (
          // Snapshot of the listing's total (lib/reviews/curated.ts); every
          // review on it was five stars when it was taken.
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <span className="h-display text-[clamp(4.5rem,12vw,8rem)] leading-[0.8] text-white">
              {GOOGLE_REVIEW_TOTAL.count}+
            </span>
            <div className="pb-1">
              <Stars rating={5} size={26} />
              <div className="mt-2 flex items-center gap-2 text-base text-white/80">
                <GoogleG className="h-5 w-5 shrink-0" />
                <span>Five-star reviews on Google</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <a
            href={allUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="google_reviews"
            className="h-display inline-flex min-h-11 items-center bg-brand-off px-5 text-sm uppercase tracking-[0.2em] text-black transition-colors hover:bg-white/80"
          >
            Read every review
          </a>
          {writeUrl && (
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="write_review"
              className="h-display inline-flex min-h-11 items-center border border-white/25 px-5 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Leave a review
            </a>
          )}
        </div>
      </div>

      <Marquee reviews={reviews} allUrl={allUrl} />

      <p className="mt-4 text-xs text-white/55">
        {useLiveCards
          ? "Showing up to 5 reviews, selected and ordered by Google."
          : "Reviews from our Google Business Profile, quoted word for word. See every review on Google."}
      </p>
    </div>
  );
}

/* Rows need enough cards to be wider than the widest screen, or the loop
   shows a gap. Short lists are repeated to reach this count per row. */
const MIN_CARDS_PER_ROW = 8;
// Seconds for one card to travel its own width. Lower is faster.
const SECONDS_PER_CARD = 7;

function fillRow(items: Review[]): Review[] {
  if (items.length === 0) return items;
  const out = [...items];
  while (out.length < MIN_CARDS_PER_ROW) out.push(...items);
  return out;
}

function Marquee({ reviews, allUrl }: { reviews: Review[]; allUrl: string }) {
  const [paused, setPaused] = useState(false);

  // Two rows with alternating reviews; a single row when there are too few
  // to tell the rows apart.
  const rows =
    reviews.length >= 6
      ? [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)]
      : [reviews];

  return (
    <section aria-label="Google reviews" className="relative mt-8">
      {/* Full-bleed: the rows run edge to edge of the screen, past the
          content column. The page's <main> clips the horizontal overflow. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 space-y-4">
        {rows.map((row, r) => {
          const filled = fillRow(row);
          return (
            <div key={r} className="marquee overflow-hidden">
              <ul
                className="marquee-track flex w-max gap-4"
                data-reverse={r % 2 === 1 ? "" : undefined}
                style={
                  {
                    "--marquee-duration": `${filled.length * SECONDS_PER_CARD}s`,
                    animationPlayState: paused ? "paused" : undefined,
                  } as React.CSSProperties
                }
              >
                {filled.map((review, i) => (
                  // Repeats of a short list are decorative copies: hidden
                  // from screen readers so each review is announced once.
                  <li
                    key={`a-${i}`}
                    aria-hidden={i >= row.length || undefined}
                    data-dup={i >= row.length ? "" : undefined}
                    className="w-[300px] shrink-0 sm:w-[360px]"
                  >
                    <ReviewCard review={review} fallbackUrl={allUrl} hidden={i >= row.length} />
                  </li>
                ))}
                {filled.map((review, i) => (
                  <li key={`b-${i}`} data-dup aria-hidden className="w-[300px] shrink-0 sm:w-[360px]">
                    <ReviewCard review={review} fallbackUrl={allUrl} hidden />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="h-display inline-flex min-h-11 items-center gap-2 border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden fill="currentColor">
            {paused ? <path d="M7 4l13 8-13 8V4z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
          </svg>
          {paused ? "Play reviews" : "Pause reviews"}
        </button>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  fallbackUrl,
  hidden = false,
}: {
  review: Review;
  fallbackUrl: string;
  /** Decorative copy: links are taken out of the tab order */
  hidden?: boolean;
}) {
  const tab = hidden ? -1 : undefined;
  return (
    <article className="flex h-full flex-col border border-white/10 bg-brand-surface p-5">
      <header className="flex items-start gap-3">
        <Avatar name={review.authorName} src={review.authorPhotoUrl} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-white">
            {review.authorUrl ? (
              <a
                href={review.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tab}
                className="hover:underline"
              >
                {review.authorName}
              </a>
            ) : (
              review.authorName
            )}
          </div>
          {review.relativeTime && (
            <div className="text-[13px] text-white/55">
              {review.publishedAt ? (
                <time dateTime={review.publishedAt}>{review.relativeTime}</time>
              ) : (
                review.relativeTime
              )}
            </div>
          )}
        </div>
        <GoogleG className="h-5 w-5 shrink-0" />
      </header>

      <div className="mt-3">
        <Stars rating={review.rating} size={18} />
      </div>

      {review.text && (
        <p className="mt-3 line-clamp-5 text-[15px] leading-relaxed text-white/80">{review.text}</p>
      )}

      <div className="mt-auto pt-3">
        <a
          href={review.reviewUrl ?? fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={tab}
          data-track="review_open"
          className="inline-flex min-h-11 items-center text-sm font-medium text-white/70 underline decoration-brand-red underline-offset-4 hover:text-white"
        >
          Read on Google
          <span className="sr-only"> (review by {review.authorName})</span>
        </a>
      </div>
    </article>
  );
}

function SummarySkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse items-end gap-6">
      <div className="h-24 w-32 bg-white/10" />
      <div className="space-y-3 pb-1">
        <div className="h-5 w-36 bg-white/10" />
        <div className="h-4 w-48 bg-white/10" />
      </div>
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    // Plain <img>, not next/image: the optimiser would store a copy of
    // Google's content on our server, which the Places terms don't allow.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-red text-base font-semibold text-white"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z"
            fill={i < rounded ? "#FBBC04" : "#3c3c3c"}
          />
        </svg>
      ))}
    </span>
  );
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Google">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
