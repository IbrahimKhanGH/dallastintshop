"""Classify, download and label the scraped @thedallastintshop media."""
import json, os, re, subprocess, sys, datetime, concurrent.futures as cf

SP = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(SP, "..", ".."))
DEST = os.path.join(ROOT, "public/gallery")
posts = json.load(open(os.path.join(SP, "ig_posts.json")))

# --- boilerplate stripping ----------------------------------------------
# Nearly every caption ends in the same CTA block + a hashtag wall that names
# #bmw, #tint and #ppf regardless of the car or the job. Classifying on raw
# captions labelled a Hyundai Sonata as a BMW, so the template comes off first.
DROP_LINE = [
    r"wraps?.{0,4}tint.{0,12}ppf",          # "🔥Wraps, Tint, & PPF!" footer
    r"call us at|\b\d{3}[-.]\d{3}[-.]\d{4}\b",
    r"630 south central|richardson\s*7?5?0?8?0?|suite 104",
    r"mon\s*-\s*sat|closed sun|\d+\s*am\s*-\s*\d+\s*pm",
    r"link in bio|dm us|dm me|get in contact|book (?:now|today)|swipe",
    r"^\W*$",                                 # "." / "-" spacer lines
    r"^\s*#",                                 # hashtag wall
]
DROP_RE = [re.compile(p, re.I) for p in DROP_LINE]

def clean(cap):
    out = []
    for line in cap.split("\n"):
        if any(r.search(line) for r in DROP_RE):
            continue
        line = re.sub(r"#\w+", "", line)                    # inline hashtags
        line = re.sub(r"@thedallastintshop", "", line, flags=re.I)
        line = re.sub(r"dallas tint shop", "", line, flags=re.I)  # signature
        if line.strip(" .|-—"):
            out.append(line)
    return "\n".join(out)

# --- classification ------------------------------------------------------
# (category, weight, pattern) — weights let a specific phrase beat a passing mention.
RULES = [
    ("ppf",             3, r"\bppf\b|paint protection|clear bra|self[- ]heal"),
    ("wrap",            3, r"\bwrap(?:ped|ping|s)?\b|color[- ]change|chrome delete|vinyl"),
    ("tint",            3, r"\btint(?:ed|ing|s)?\b|windshield|llumar|window film"
                           r"|(?:front|rear|side|back) windows?|\d{1,2}%\s*(?:vlt)?\b"),
    ("powder-coating",  3, r"powder[- ]coat\w*|caliper"),
    ("ceramic-coating", 3, r"ceramic coating|hydrophobic|9h\b"),
    ("paint-correction",3, r"paint correction|polish\w*|swirl|buff\w*"),
    ("audio",           3, r"\baudio\b|speaker|subwoofer|sound system"),
    ("wheels",          2, r"\bwheel(?:s)?\b|rims?\b"),
]
# "ceramic tint" is tint, not coating; strip that trap before scoring coatings.
def classify(cap):
    c = cap.lower()
    scores, tags = {}, []
    for name, w, pat in RULES:
        hits = len(re.findall(pat, c))
        if name == "ceramic-coating":
            hits -= len(re.findall(r"ceramic (?:window )?tint", c))
        if hits > 0:
            scores[name] = hits * w
            tags.append(name)
    if not scores:
        return "shop", []
    # hashtag-only mentions are weak signal; body mentions win
    body = re.split(r"#", c)[0]
    for name, w, pat in RULES:
        if name in scores and re.search(pat, body):
            scores[name] += 4
    primary = max(scores, key=scores.get)
    return primary, sorted(tags)

MAKES = {
    "rolls-royce": r"rolls[- ]royce|cullinan|ghost|wraith|phantom",
    "bentley": r"bentley|continental gt|bentayga",
    "lamborghini": r"lamborghini|lambo|urus|huracan|aventador",
    "ferrari": r"ferrari|488|f8|roma|sf90",
    "mclaren": r"mclaren|720s|765lt|artura",
    "porsche": r"porsche|911|taycan|cayenne|panamera|macan",
    "mercedes": r"mercedes|benz|amg|g[- ]?wagon|gle|gls|c63|e63|s580|maybach",
    "bmw": r"\bbmw\b|m340i|m3\b|m4\b|m5\b|x5m?\b|x7\b|i8\b",
    "audi": r"\baudi\b|rs[357]\b|q[578]\b",
    "tesla": r"tesla|model [sy3x]\b|cybertruck",
    "corvette": r"corvette|\bc8\b|z06",
    "cadillac": r"cadillac|escalade|blackwing|ct[456]\b",
    "dodge": r"dodge|hellcat|challenger|charger|trx\b|durango",
    "ford": r"\bford\b|mustang|f[- ]?150|raptor|bronco|shelby",
    "chevrolet": r"chevrolet|chevy|camaro|silverado|tahoe|suburban",
    "jeep": r"\bjeep\b|wrangler|grand cherokee|gladiator",
    "toyota": r"toyota|supra|tundra|tacoma|4runner|camry",
    "lexus": r"lexus|is[ -]?350|rx\b|gx\b|lx\b",
    "genesis": r"genesis|gv[678]0|g70|g80",
    "honda": r"honda|civic|accord|type r",
    "nissan": r"nissan|gt[- ]?r\b|\b370z\b|\b350z\b|altima",
    "subaru": r"subaru|wrx|sti\b",
    "volkswagen": r"volkswagen|\bvw\b|beetle|golf|jetta",
    "kia": r"\bkia\b|telluride|stinger|ev6",
    "hyundai": r"hyundai|elantra|sonata|palisade|ioniq",
    "land-rover": r"land rover|range rover|defender",
    "jaguar": r"jaguar|f[- ]type",
    "maserati": r"maserati|ghibli|levante",
    "rivian": r"rivian|r1[ts]",
    "lucid": r"lucid air",
    "gmc": r"\bgmc\b|sierra|yukon|denali",
    "ram": r"\bram\b 1500|ram trx",
    "infiniti": r"infiniti|q50|q60|qx\d\d",
    "acura": r"acura|\btlx\b|\bmdx\b|integra",
    "mazda": r"mazda|miata|cx[- ]?[59]",
}
def vehicle(cap):
    c = cap.lower()
    for make, pat in MAKES.items():
        if re.search(pat, c):
            return make
    return None

def slug(s, n=48):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:n].strip("-")

def headline(cap):
    """First meaningful line of the caption, cleaned of emoji/CTA noise."""
    for line in cap.split("\n"):
        # emoji → space, not empty: "car😱So" must not become "carSo"
        line = re.sub(r"[\U00010000-\U0010ffff☀-➿️‼]+", " ", line).strip()
        line = re.sub(r"\s+", " ", line)
        if len(line) < 4:
            continue
        if re.match(r"^(dm|call|link in bio|📲|book|text|📞|📌|\.|#)", line.lower()):
            continue
        if line.startswith("#"):
            continue
        return line.strip(" .|")
    return ""

# --- build the plan ------------------------------------------------------
plan, records = [], []
for p in posts:
    body = clean(p["caption"])
    cat, tags = classify(body)
    veh = vehicle(body)
    # The long hashtag wall (#cars #carporn #bmw …) is copy-pasted onto every
    # post and lies about the car. A short, hand-picked tag set does not, so
    # fall back to it only when the body gave us nothing.
    hashtags = re.findall(r"#(\w+)", p["caption"])
    if len(hashtags) <= 6:
        tagtext = " ".join(hashtags)
        if cat == "shop":
            cat, tags = classify(tagtext)
        veh = veh or vehicle(tagtext)
    date = datetime.date.fromtimestamp(p["taken_at"]).isoformat()
    base = f"{date}_{veh or 'car'}_{cat}_{p['code']}"
    kids = p["children"] or [{"image": p["image"], "video": p["video"]}]
    files = []
    for i, k in enumerate(kids, 1):
        if not k["image"]:
            continue
        fn = f"{base}.jpg" if len(kids) == 1 else f"{base}_{i}.jpg"
        rel = f"{cat}/{fn}"
        plan.append((k["image"], os.path.join(DEST, rel)))
        files.append(rel)
    records.append({
        "code": p["code"],
        "url": f"https://www.instagram.com/reel/{p['code']}/" if p["video"] else f"https://www.instagram.com/p/{p['code']}/",
        "date": date,
        "category": cat,
        "tags": tags,
        "vehicle": veh,
        "type": p["type"],
        "likes": p["likes"], "comments": p["comments"], "plays": p["plays"],
        "headline": headline(body),
        "caption": p["caption"],
        "files": files,
        "video": p["video"],
    })

# top reels by plays get a local mp4 too
TOP_N = int(sys.argv[1]) if len(sys.argv) > 1 else 8
by_plays = sorted(
    [r for r in records if r["video"]], key=lambda r: r["plays"] or 0, reverse=True
)
picked = {r["code"]: r for r in by_plays[:TOP_N]}

# The site filters the work grid by service, so every headline service needs
# playable video or its tab looks broken. Raw play counts alone gave eight
# reels with zero wraps in them, and wraps are a third of what the shop sells.
PER_CATEGORY = 2
for cat in ("tint", "ppf", "wrap"):
    for r in [x for x in by_plays if x["category"] == cat][:PER_CATEGORY]:
        picked.setdefault(r["code"], r)

top = list(picked.values())
for r in top:
    rel = f"video/{r['date']}_{r['vehicle'] or 'car'}_{r['category']}_{r['code']}.mp4"
    plan.append((r["video"], os.path.join(DEST, rel)))
    r["localVideo"] = rel

if os.environ.get("DRY"):
    import collections as _c
    print("categories:", dict(_c.Counter(r["category"] for r in records).most_common()))
    print("vehicles:", dict(_c.Counter(r["vehicle"] for r in records if r["vehicle"]).most_common()))
    print("no vehicle:", sum(1 for r in records if not r["vehicle"]), "| files:", len(plan))
    for r in records[:14]:
        print(f'  {r["category"]:<16} {str(r["vehicle"]):<12} {r["headline"][:64]!r}')
    print("--- shop bucket ---")
    for r in [x for x in records if x["category"] == "shop"][:12]:
        print(f'   {r["headline"][:72]!r}')
    sys.exit()

for _, path in plan:
    os.makedirs(os.path.dirname(path), exist_ok=True)

def fetch(job):
    url, path = job
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return ("skip", path)
    r = subprocess.run(["curl", "-sS", "-L", "--max-time", "120", "-o", path, url],
                       capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(path) or os.path.getsize(path) < 1000:
        return ("fail", f"{path}: {r.stderr[:120]}")
    return ("ok", path)

with cf.ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(fetch, plan))

ok = sum(1 for s, _ in results if s == "ok")
fail = [d for s, d in results if s == "fail"]
for r in records:
    r.pop("video", None)
json.dump(records, open(os.path.join(SP, "manifest.json"), "w"), indent=1)

print(f"downloaded {ok}/{len(plan)}  failed {len(fail)}")
for f in fail[:10]:
    print("  FAIL", f)
