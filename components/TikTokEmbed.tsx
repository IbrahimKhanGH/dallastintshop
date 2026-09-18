"use client";

import { useEffect, useState } from "react";
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
  const { tiktok, tiktokHandle } = BUSINESS.social;
  const handle = tiktokHandle.replace(/^@/, "");

  useEffect(() => {
    if (!loaded) return;
    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [loaded]);

  return (
    <div className="mt-14 rounded-md border border-white/10 bg-black/40 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-sm bg-white text-black">
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
              className="h-display inline-flex min-h-11 items-center rounded-sm bg-white px-5 text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-white/90"
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
        <div className="mt-6 overflow-hidden rounded-md bg-white">
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
