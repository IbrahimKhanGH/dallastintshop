import type { Review } from "@/lib/data";

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  return (
    <article className="card-edge relative flex h-full flex-col justify-between rounded-md bg-white/[0.03] p-6 backdrop-blur">
      <div>
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C1121F" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
          ))}
          <span className="ml-2 h-display text-[10px] uppercase tracking-[0.25em] text-white/50">
            {review.source}
          </span>
        </div>

        {/* Body */}
        <p className="mt-4 text-base leading-relaxed text-white/85">
          “{review.body}”
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <div className="h-display text-base uppercase tracking-wide text-white">
            {review.name}
          </div>
          <div className="text-xs text-white/55">{review.car}</div>
          <div className="mt-0.5 text-[11px] text-white/35">
            {review.source} · {review.when}
          </div>
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-red/15 text-brand-red">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.17A2 2 0 017.17 9zM17.17 6A5.17 5.17 0 0012 11.17V18h6.83v-6.83h-3.66A2 2 0 0117.17 9z" />
          </svg>
        </div>
      </div>
    </article>
  );
}
