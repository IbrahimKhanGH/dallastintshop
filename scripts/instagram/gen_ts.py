"""Generate lib/gallery.ts from the scraped manifest."""
import json, os, re

SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(SP, "..", ".."))
m = json.load(open(os.path.join(SP, "manifest.json")))

LABEL = {
    "tint": "Window Tint", "ppf": "Paint Protection Film", "wrap": "Vinyl Wrap",
    "ceramic-coating": "Ceramic Coating", "paint-correction": "Paint Correction",
    "powder-coating": "Powder Coating", "wheels": "Wheels", "audio": "Audio",
    "shop": "Shop Work",
}
VEHICLE = {
    "bmw": "BMW", "gmc": "GMC", "rolls-royce": "Rolls-Royce", "land-rover": "Land Rover",
    "mclaren": "McLaren", "volkswagen": "Volkswagen", "bentley": "Bentley",
}
def veh_label(v):
    return VEHICLE.get(v) or (v.title() if v else None)

def alt(r):
    """Human alt text — the shop's own words when usable, else a built phrase."""
    h = re.sub(r"\s+", " ", r["headline"]).strip()
    if 12 <= len(h) <= 110:
        return h
    car = veh_label(r["vehicle"])
    svc = LABEL[r["category"]].lower()
    if r["category"] == "shop":
        return f"{car} in the Dallas Tint Shop bay" if car else "Work in progress at Dallas Tint Shop"
    return f"{car} {svc} by Dallas Tint Shop" if car else f"{LABEL[r['category']]} by Dallas Tint Shop"

rows = []
for r in sorted(m, key=lambda x: x["date"], reverse=True):
    if not r["files"]:
        continue
    rows.append({
        "code": r["code"], "url": r["url"], "date": r["date"],
        "category": r["category"], "service": LABEL[r["category"]],
        "vehicle": veh_label(r["vehicle"]), "alt": alt(r),
        "likes": r["likes"] or 0, "plays": r["plays"],
        "images": ["/gallery/" + f for f in r["files"]],
        "video": ("/gallery/" + r["localVideo"]) if r.get("localVideo") else None,
    })

def ts(v, ind=4):
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, (int, float)): return str(v)
    if isinstance(v, list):
        return "[" + ", ".join(ts(x) for x in v) + "]"
    s = str(v).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'

lines = []
for r in rows:
    lines.append("  {")
    for k, v in r.items():
        lines.append(f"    {k}: {ts(v)},")
    lines.append("  },")

out = f'''/* AUTO-GENERATED from the shop's Instagram (@thedallastintshop) — {len(rows)} posts,
   {sum(len(r["images"]) for r in rows)} images, {sum(1 for r in rows if r["video"])} local reels.
   Media lives in /public/gallery/<category>/. Regenerate rather than hand-editing. */

export type IgCategory =
{chr(10).join('  | "' + c + '"' for c in sorted({r["category"] for r in rows}))};

export type IgPost = {{
  /** Instagram shortcode */
  code: string;
  /** Permalink to the original post */
  url: string;
  /** ISO date the post went up */
  date: string;
  category: IgCategory;
  /** Human-readable service name */
  service: string;
  vehicle: string | null;
  /** Alt text — the shop's own caption line where it reads well */
  alt: string;
  likes: number;
  plays: number | null;
  /** Local paths under /public */
  images: string[];
  /** Local mp4 for the highest-performing reels, else null */
  video: string | null;
}};

export const IG_POSTS: IgPost[] = [
{chr(10).join(lines)}
];

/** Reels we mirrored locally, most-watched first. */
export const FEATURED_REELS: IgPost[] = IG_POSTS.filter((p) => p.video).sort(
  (a, b) => (b.plays ?? 0) - (a.plays ?? 0)
);

/** Most-engaged posts overall — used for the Instagram strip. */
export const TOP_POSTS: IgPost[] = [...IG_POSTS].sort(
  (a, b) => (b.plays ?? 0) + b.likes * 20 - ((a.plays ?? 0) + a.likes * 20)
);

export function postsByCategory(category: IgCategory): IgPost[] {{
  return IG_POSTS.filter((p) => p.category === category);
}}
'''
open(os.path.join(ROOT, "lib/gallery.ts"), "w").write(out)
print("wrote lib/gallery.ts:", len(rows), "posts,",
      sum(len(r["images"]) for r in rows), "images,",
      sum(1 for r in rows if r["video"]), "videos")

# a few picks to wire into the page
print("\n-- top by category (for service cards) --")
seen = {}
for r in sorted(rows, key=lambda x: (x["plays"] or 0) + x["likes"] * 20, reverse=True):
    seen.setdefault(r["category"], []).append(r)
for c, v in seen.items():
    print(f'{c:<16} {v[0]["images"][0]:<62} {v[0]["alt"][:44]!r}')
print("\n-- featured reels --")
for r in [x for x in rows if x["video"]][:8]:
    print(f'{r["plays"]:>6} {r["video"]:<64} {r["alt"][:40]!r}')
