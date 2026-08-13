"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { BUSINESS, SHOWCASE, WORK_FILTERS, type WorkFilter } from "@/lib/data";
import { IG_POSTS } from "@/lib/gallery";

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

/* One section for everything the shop has shot: stills from their photo
   carousels and their most-watched reels, in a single filterable grid that
   links every tile back to the original post. Replaces the old trio of
   Featured Work / Featured Reels / Instagram strip, which were three views
   of one account stacked in a row. */
export default function WorkShowcase() {
  const [filter, setFilter] = useState<WorkFilter | "all">("all");
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const tiles = SHOWCASE.filter((t) => filter === "all" || t.filter === filter);
  const featureKey = tiles.find((t) => t.kind === "reel")?.key;

  /* The lead reel plays itself once it's on screen. Hover does nothing on a
     phone, and a grid of frozen posters undersells work that is mostly
     video — but only the feature tile, so nobody downloads eight videos on
     cellular, and never when the visitor asked for reduced motion. */
  useEffect(() => {
    if (!featureKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = videoRefs.current[featureKey];
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [featureKey]);

  const play = (key: string) => {
    const v = videoRefs.current[key];
    if (v) void v.play().catch(() => {});
  };
  const stop = (key: string) => {
    const v = videoRefs.current[key];
    if (v && key !== featureKey) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-white/10 bg-brand-surface/40 py-20 sm:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_15%_0%,rgba(193,18,31,0.18)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="The work"
            title={
              <>
                Straight from the{" "}
                <span className="h-display-italic text-brand-red">shop floor.</span>
              </>
            }
            description="Every car on this page came through the bay in Richardson. Tap any tile to see the original post."
          />
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="h-display group hidden shrink-0 items-center gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10 sm:inline-flex"
          >
            {BUSINESS.instagramHandle}
            <span className="grid h-6 w-6 place-items-center rounded-sm bg-brand-red/20 text-brand-red transition-all group-hover:bg-brand-red group-hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* filters */}
        <div
          role="tablist"
          aria-label="Filter work by service"
          className="mt-9 flex flex-wrap gap-2"
        >
          {WORK_FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={`h-display inline-flex min-h-11 items-center rounded-full border px-4 text-xs uppercase tracking-[0.2em] transition-all sm:min-h-0 sm:py-2.5 ${
                  active
                    ? "border-brand-red bg-brand-red/15 text-white"
                    : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* the feed — reels are 9:16, stills are square, so the grid runs on
            fixed rows and the feature tile spans two of them */}
        <div className="mt-8 grid auto-rows-[minmax(0,11rem)] grid-cols-2 gap-3 sm:auto-rows-[minmax(0,13rem)] sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {tiles.map((tile) => {
            const isFeature = tile.key === featureKey;
            return (
              <a
                key={tile.key}
                href={tile.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => tile.video && play(tile.key)}
                onMouseLeave={() => tile.video && stop(tile.key)}
                className={`card-edge group relative overflow-hidden rounded-md bg-white/[0.03] ${
                  isFeature ? "col-span-2 row-span-2" : ""
                }`}
              >
                {tile.video ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[tile.key] = el;
                    }}
                    src={tile.video}
                    poster={tile.src}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-label={tile.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/25" />
                <div className="pointer-events-none absolute inset-0 bg-red-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {tile.kind === "reel" && (
                  <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-sm border border-white/15 bg-black/60 px-2 py-1 backdrop-blur">
                    <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden>
                      <path d="M8 5l12 7-12 7V5z" fill="currentColor" className="text-white" />
                    </svg>
                    <span className="h-display text-[10px] uppercase tracking-[0.15em] text-white">
                      {tile.plays ? compact(tile.plays) : "Reel"}
                    </span>
                  </span>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="h-display block text-[10px] uppercase tracking-[0.25em] text-brand-red">
                    {tile.service}
                  </span>
                  {isFeature && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/90">{tile.alt}</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* absorbs what the old Instagram strip was for */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-white/50">
            {SHOWCASE.length} of {IG_POSTS.length} builds — the rest live on Instagram.
          </p>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="h-display inline-flex min-h-11 items-center gap-3 rounded-sm bg-red-grad px-6 text-xs uppercase tracking-[0.2em] text-white shadow-redGlow transition-all hover:-translate-y-0.5"
          >
            Follow {BUSINESS.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
