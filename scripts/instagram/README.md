# Instagram media pipeline

Pulls the shop's own posts from [@thedallastintshop](https://instagram.com/thedallastintshop),
sorts the media into `/public/gallery/<category>/`, and regenerates the typed
index at `lib/gallery.ts`.

Instagram blocks anonymous scraping (`gallery-dl` and friends get a 401 login
wall), so step 1 runs in a browser tab where you are already signed in.

## 1. Grab the raw posts

Open instagram.com signed in, then paste this into the devtools console. It walks
the profile feed plus the reels tab and downloads `ig_posts.json`:

```js
(async () => {
  const uid = document.documentElement.innerHTML.match(/"profile_id":"(\d+)"/)[1];
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  const h = { "x-ig-app-id": "936619743392459", "x-csrftoken": csrf, "x-asbd-id": "129477" };
  const best = (l) => (l || []).slice().sort((a, b) => (b.width || 0) - (a.width || 0))[0]?.url || null;
  const norm = (it) => ({
    code: it.code, taken_at: it.taken_at,
    type: it.carousel_media ? "carousel" : it.media_type === 2 ? "video" : "image",
    product_type: it.product_type || null, caption: (it.caption?.text || "").slice(0, 600),
    likes: it.like_count ?? null, comments: it.comment_count ?? null,
    plays: it.play_count ?? it.ig_play_count ?? null,
    image: best(it.image_versions2?.candidates),
    video: it.video_versions ? best(it.video_versions) : null,
    children: (it.carousel_media || []).map((k) => ({
      image: best(k.image_versions2?.candidates),
      video: k.video_versions ? best(k.video_versions) : null,
    })),
  });

  const out = [];
  let maxId = null;
  for (let p = 0; p < 8; p++) {
    const u = new URL(`/api/v1/feed/user/${uid}/`, location.origin);
    u.searchParams.set("count", "33");
    if (maxId) u.searchParams.set("max_id", maxId);
    const j = await fetch(u, { headers: h, credentials: "include" }).then((r) => r.json());
    (j.items || []).forEach((it) => out.push(norm(it)));
    if (!j.more_available) break;
    maxId = j.next_max_id;
    await new Promise((r) => setTimeout(r, 800));
  }

  // reels that never hit the main feed
  const seen = new Set(out.map((p) => p.code));
  let cursor = null;
  for (let p = 0; p < 8; p++) {
    const body = new URLSearchParams({ target_user_id: uid, page_size: "50" });
    if (cursor) body.set("max_id", cursor);
    const j = await fetch("/api/v1/clips/user/", {
      method: "POST", credentials: "include",
      headers: { ...h, "content-type": "application/x-www-form-urlencoded" }, body,
    }).then((r) => r.json());
    (j.items || []).forEach((x) => {
      if (x.media && !seen.has(x.media.code)) out.push(norm(x.media));
    });
    if (!j.paging_info?.more_available) break;
    cursor = j.paging_info?.max_id;
    await new Promise((r) => setTimeout(r, 700));
  }

  out.sort((a, b) => b.taken_at - a.taken_at);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: "application/json" }));
  a.download = "ig_posts.json";
  a.click();
  return out.length;
})();
```

Instagram's CSP blocks `fetch` to localhost, so the blob download above is the
way the data leaves the page.

## 2. Download and sort

Drop `ig_posts.json` next to these scripts, then:

```bash
python3 scripts/instagram/organize.py 8
```

The argument is how many of the top reels (by play count) to mirror as local
mp4s. It writes images to `/public/gallery/<category>/`, videos to
`/public/gallery/video/`, and a `manifest.json` alongside the script. Existing
files are skipped, so re-runs only fetch what's new.

Captions are classified into categories after the boilerplate is stripped. This
matters: the shop pastes the same CTA footer and hashtag wall (`#bmw #tint
#ppf …`) onto nearly every post, so classifying raw captions labelled a Hyundai
Sonata as a BMW and put 77 of 106 posts in "tint". Only the real caption body
counts, plus short hand-picked hashtag sets as a fallback.

Filenames are `YYYY-MM-DD_vehicle_category_SHORTCODE[_n].jpg`.

## 3. Regenerate the typed index

```bash
python3 scripts/instagram/gen_ts.py
```

Writes `lib/gallery.ts` (`IG_POSTS`, `FEATURED_REELS`, `TOP_POSTS`,
`postsByCategory`). Don't hand-edit that file — it's generated.

## Picking images for the site

Reel **cover frames carry burned-in captions** ("HOW MUCH TINT BEETLE"), which
look like clickbait in a gallery. For hero/service/gallery slots pull from the
carousel posts (`type: "carousel"`) — those are clean photography. Reel covers
are fine inside the reels rail, where they're actually videos.
