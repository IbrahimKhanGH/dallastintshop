# Gallery media

Photos and reels from [@thedallastintshop](https://instagram.com/thedallastintshop),
downloaded and sorted by `scripts/instagram/`. 106 posts → 145 images + 8 reels.

Filename format: `YYYY-MM-DD_vehicle_category_SHORTCODE[_n].jpg`
The `SHORTCODE` maps back to the post: `instagram.com/reel/<SHORTCODE>/`.
The `_n` suffix is the position within a carousel.

| Folder | Contents |
| --- | --- |
| `tint/` | Window tint jobs |
| `ppf/` | Paint protection film |
| `wrap/` | Vinyl / colour-change wraps |
| `ceramic-coating/` | Ceramic coating |
| `paint-correction/` | Paint correction & polishing |
| `powder-coating/` | Powder-coated wheels, calipers, trim |
| `wheels/` | Wheel-focused posts |
| `shop/` | Shop-floor and finished-car shots with no specific service named |
| `video/` | The 8 most-watched reels, mirrored as mp4 |

Captions are classified on the caption body only. The boilerplate CTA footer and
the copy-pasted hashtag wall are stripped first — they name `#bmw`, `#tint` and
`#ppf` on nearly every post regardless of the car or the job.

`shop/` is the catch-all for posts whose captions never name a service
("This CT6V turned out great!"). The photos are fine; only the label is vague.

**Most of these images are reel cover frames with burned-in caption text.** The
clean photography lives in the nine carousel posts — see `IG_POSTS` in
`lib/gallery.ts` and filter on `type: "carousel"`. Use those for hero, service
card and gallery slots; keep reel covers in the reels rail.

Regenerate with `scripts/instagram/` — see the README there.
