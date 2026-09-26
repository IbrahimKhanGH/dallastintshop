"use client";

import { useEffect, useRef, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { TikTokIcon } from "./SocialLinks";
import { track } from "@/lib/analytics";

/* The shop's TikTok, via TikTok's official creator-profile embed (the
   markup TikTok's own oEmbed endpoint returns for this profile), which
   shows their latest videos.

   Loaded only when the visitor asks. TikTok's embed script is heavy and
   sets third-party cookies, so nothing from tiktok.com is requested until
   the button is pressed — until then this is a plain link and a button. */
export default function TikTokEmbed() {
  const [loaded, setLoaded] = useState(false);
  // True once TikTok's script has swapped the blockquote for its iframe.
  const [ready, setReady] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const { tiktok, tiktokHandle } = BUSINESS.social;
  const handle = tiktokHandle.replace(/^@/, "");

  useEffect(() => {
    if (!loaded) return;
    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);

    const el = feedRef.current;
    const mo = new MutationObserver(() => {
      if (el?.querySelector("iframe")) {
        setReady(true);
        mo.disconnect();
      }
    });
    if (el) mo.observe(el, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      s.remove();
    };
  }, [loaded]);

  return (
    <div className="mt-14 rounded-md border border-white/10 bg-black/40 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-sm bg-brand-off text-black">
            <TikTokIcon size={20} />
          </span>
          <div>
            <h3 className="h-display text-2xl uppercase tracking-wide text-white">
              More on TikTok
            </h3>
            <p className="text-sm text-white/70">Builds, how-tos and shop life from {tiktokHandle}.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!loaded && (
            <button
              type="button"
              onClick={() => {
                setLoaded(true);
                track("tiktok", { action: "load_embed" });
              }}
              className="h-display inline-flex min-h-11 items-center rounded-sm bg-brand-off px-5 text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-white/80"
            >
              Show latest TikToks
            </button>
          )}
          <a
            href={tiktok}
            target="_blank"
            rel="noopener noreferrer"
            data-track="tiktok"
            className="h-display inline-flex min-h-11 items-center rounded-sm border border-white/25 px-5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
          >
            Open TikTok
          </a>
        </div>
      </div>

      {loaded ? (
        <div ref={feedRef} className="relative mt-6 min-h-[480px] overflow-hidden bg-brand-off">
          {!ready && <FeedSkeleton />}
          <blockquote
            className="tiktok-embed"
            cite={tiktok}
            data-unique-id={handle}
            data-embed-type="creator"
            style={{ maxWidth: 780, minWidth: 288, margin: "0 auto" }}
          >
            <section>
              <a target="_blank" rel="noopener noreferrer" href={tiktok}>
                {tiktokHandle}
              </a>
            </section>
          </blockquote>
        </div>
      ) : (
        <p className="mt-4 text-xs text-white/55">
          Loading the feed connects to TikTok, which may set its own cookies.
        </p>
      )}
    </div>
  );
}

/* Placeholder in the shape of TikTok's creator feed (profile row, then a
   grid of 9:16 thumbnails) while the embed script loads. */
function FeedSkeleton() {
  return (
    <div aria-hidden className="absolute inset-0 animate-pulse p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-black/10" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-black/10" />
          <div className="h-3 w-20 bg-black/10" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[9/16] bg-black/10" />
        ))}
      </div>
    </div>
  );
}
