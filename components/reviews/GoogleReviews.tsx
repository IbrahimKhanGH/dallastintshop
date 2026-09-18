"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Roboto } from "next/font/google";
import type { LiveReviews, Review, ReviewsResponse } from "@/lib/reviews/types";

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

/* Google reviews, styled after Google's own review cards.

   Renders the verified selection first (it's in the static HTML, so it
   works without JS and for crawlers). If live reviews are configured, it
   asks /api/reviews once the section is close to the viewport and swaps
   in Google's data on success. Any failure — no config, timeout, bad key,
   empty response — leaves the verified selection in place and nothing
   else on the page is affected. Live and curated reviews are never mixed. */
export default function GoogleReviews({ initial, liveEnabled, reviewsUrl, writeReviewUrl }: Props) {
  const [live, setLive] = useState<LiveReviews | null>(null);
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

  const reviews = live?.reviews ?? initial;
  const allUrl = live?.links.reviews ?? reviewsUrl;
  const writeUrl = live?.links.writeReview ?? writeReviewUrl;

  return (
    <div ref={rootRef} data-reviews-source={live ? "google-live" : "curated"}>
      {/* summary bar */}
      <div className="flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <GoogleG className="h-8 w-8 shrink-0" />
          {live && live.rating !== null ? (
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-2xl font-semibold text-white">{live.rating.toFixed(1)}</span>
                <Stars rating={live.rating} />
                {live.count !== null && (
                  <span className="text-sm text-white/70">
                    {live.count.toLocaleString("en-US")} reviews
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-white/60">
                Rating and reviews from{" "}
                <span translate="no" className={`${roboto.className} text-white/80`}>
                  Google Maps
                </span>
              </p>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-white">Google reviews</div>
              <p className="text-sm text-white/65">Real customers, word for word.</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={allUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="google_reviews"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#202124] transition-colors hover:bg-white/90"
          >
            See all Google reviews
          </a>
          {writeUrl && (
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="write_review"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Leave a review
            </a>
          )}
        </div>
      </div>

      <Carousel reviews={reviews} allUrl={allUrl} />

      <p className="mt-4 text-xs text-white/55">
        {live
          ? "Showing up to 5 reviews, selected and ordered by Google."
          : "A selection of reviews from our Google Business Profile, quoted word for word. See every review on Google."}
      </p>
    </div>
  );
}

function Carousel({ reviews, allUrl }: { reviews: Review[]; allUrl: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft <= 4);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    update();
    t?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      t?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, reviews]);

  function go(dir: 1 | -1) {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : t.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }

  const scrollable = !(atStart && atEnd);

  function onTrackKey(e: KeyboardEvent<HTMLUListElement>) {
    if (!scrollable) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      const t = trackRef.current;
      if (t) t.scrollTo({ left: 0, behavior: "auto" });
    } else if (e.key === "End") {
      e.preventDefault();
      const t = trackRef.current;
      if (t) t.scrollTo({ left: t.scrollWidth, behavior: "auto" });
    }
  }

  return (
    <section aria-roledescription="carousel" aria-label="Google reviews" className="relative mt-6">
      {scrollable && (
        <div className="mb-4 hidden justify-end gap-2 sm:flex">
          <ArrowButton label="Previous reviews" disabled={atStart} onClick={() => go(-1)} dir="prev" />
          <ArrowButton label="Next reviews" disabled={atEnd} onClick={() => go(1)} dir="next" />
        </div>
      )}

      <ul
        ref={trackRef}
        tabIndex={scrollable ? 0 : undefined}
        onKeyDown={onTrackKey}
        aria-label={scrollable ? "Reviews — use left and right arrows for more" : undefined}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {reviews.map((r, i) => (
          <li
            key={r.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
            className="w-[86%] shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)]"
          >
            <ReviewCard review={r} fallbackUrl={allUrl} />
          </li>
        ))}
      </ul>

      {scrollable && (
        <p className="mt-2 text-center text-xs text-white/50 sm:hidden" aria-hidden>
          Swipe for more →
        </p>
      )}
    </section>
  );
}

function ReviewCard({ review, fallbackUrl }: { review: Review; fallbackUrl: string }) {
  const name = review.authorUrl ? (
    <a
      href={review.authorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {review.authorName}
    </a>
  ) : (
    review.authorName
  );

  return (
    <article className="flex h-full flex-col rounded-lg bg-white p-5 text-[#202124] shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <header className="flex items-start gap-3">
        <Avatar name={review.authorName} src={review.authorPhotoUrl} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-medium">{name}</div>
          {review.relativeTime && (
            <div className="text-[13px] text-[#5f6368]">
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

      {review.text && <ReviewText text={review.text} />}

      <div className="mt-auto pt-4">
        <a
          href={review.reviewUrl ?? fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="review_open"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[#1a0dab] underline-offset-2 hover:underline"
        >
          {review.reviewUrl ? "Read on Google" : "Read more on Google"}
          <span className="sr-only"> (review by {review.authorName})</span>
        </a>
      </div>
    </article>
  );
}

function ReviewText({ text }: { text: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;
    const measure = () => {
      if (expanded) return;
      setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expanded]);

  return (
    <div className="mt-3">
      <p
        ref={pRef}
        className={`text-[15px] leading-relaxed text-[#3c4043] ${expanded ? "" : "line-clamp-6"}`}
      >
        {text}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 min-h-11 text-sm font-medium text-[#1a0dab] underline-offset-2 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
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
  const palette = ["#1a73e8", "#e8710a", "#188038", "#a142f4", "#d93025", "#12859c"];
  const color = palette[name.length % palette.length];
  return (
    <span
      aria-hidden
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-medium text-white"
      style={{ background: color }}
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
            fill={i < rounded ? "#FBBC04" : "#dadce0"}
          />
        </svg>
      ))}
    </span>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  dir,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-35"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
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
