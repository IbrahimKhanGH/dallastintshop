"""Build the favicon and Apple touch icon from the logo's own "D".

The full wordmark (about 4.3:1) turns to mush at 16-32px, so the icon uses
one letter of it instead: the "D" of DALLAS, lifted pixel for pixel from
the dark logo (public/brand/dallas-tint-shop-logo-dark.png), with its black
outline. Nothing is redrawn. It sits on the site's black with a brand-red
bar along the bottom.

The letters' outlines touch, so the D is isolated by flood-filling its
white face, then growing that shape just enough to take in its outline.

  python3 scripts/brand/make-favicon.py
"""
from collections import deque
from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = "public/brand/dallas-tint-shop-logo-dark.png"
OUTPUTS = {"app/icon.png": 64, "app/apple-icon.png": 180}
BG = (5, 5, 5, 255)  # brand-black
RED = (193, 18, 31, 255)  # brand-red
SEED = (230, 60)  # a pixel on the D's white face
MAX_X = 335  # the A starts right of this; keeps the fill off it

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()


def is_face(p):
    return p[3] > 100 and min(p[:3]) > 110


face = Image.new("L", im.size, 0)
fp = face.load()
seen = {SEED}
q = deque([SEED])
while q:
    x, y = q.popleft()
    fp[x, y] = 255
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        n = (x + dx, y + dy)
        if 0 <= n[0] < MAX_X and 0 <= n[1] < h and n not in seen and is_face(px[n]):
            seen.add(n)
            q.append(n)

# Grow the face to cover the outline, then soften the cut edge.
mask = face.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MaxFilter(9))
mask = mask.filter(ImageFilter.GaussianBlur(0.8))
letter = im.copy()
letter.putalpha(ImageChops.multiply(im.split()[3], mask))
letter = letter.crop(letter.getbbox())

for path, size in OUTPUTS.items():
    scale = 4  # draw large, downsample once for clean edges
    s = size * scale
    tile = Image.new("RGBA", (s, s), BG)
    bar = round(s * 0.09)
    ImageDraw.Draw(tile).rectangle([0, s - bar, s, s], fill=RED)
    fit = s * 0.80 / max(letter.size)
    d = letter.resize((round(letter.width * fit), round(letter.height * fit)), Image.LANCZOS)
    tile.alpha_composite(d, ((s - d.width) // 2, (s - bar - d.height) // 2))
    tile.resize((size, size), Image.LANCZOS).save(path)
    print(f"wrote {path} ({size}x{size})")
