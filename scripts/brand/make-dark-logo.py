"""Derive the dark-background logo from the original artwork.

The original (public/brand/dallas-tint-shop-logo.png) has a transparent
background AND transparent letter fills: it is designed to sit on white,
where the fills read as white. On the site's black surfaces the fills
disappear with the background.

This fills ONLY the transparent areas fully enclosed by the artwork's own
outlines (the letter fills) with white — exactly how the logo renders on
white — and leaves everything outside the lettering transparent. No
shapes, colours or proportions change; nothing is redrawn.

  python3 scripts/brand/make-dark-logo.py
"""
from collections import deque
from PIL import Image

SRC = "public/brand/dallas-tint-shop-logo.png"
OUT = "public/brand/dallas-tint-shop-logo-dark.png"
SEE_THROUGH = 128  # alpha below this is treated as open background

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()

# Flood-fill the outside: every see-through pixel reachable from the border.
outside = bytearray(w * h)
q = deque()
for x in range(w):
    q.extend([(x, 0), (x, h - 1)])
for y in range(h):
    q.extend([(0, y), (w - 1, y)])
while q:
    x, y = q.popleft()
    i = y * w + x
    if outside[i] or px[x, y][3] >= SEE_THROUGH:
        continue
    outside[i] = 1
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not outside[ny * w + nx]:
            q.append((nx, ny))

# Everything not outside is inside the lettering: composite it over white,
# which is precisely what the artwork looks like on a white page (and keeps
# the anti-aliased inner edges smooth).
out = im.copy()
op = out.load()
for y in range(h):
    for x in range(w):
        if outside[y * w + x]:
            continue
        r, g, b, a = px[x, y]
        if a == 255:
            continue
        t = a / 255
        op[x, y] = (
            round(r * t + 255 * (1 - t)),
            round(g * t + 255 * (1 - t)),
            round(b * t + 255 * (1 - t)),
            255,
        )
out.save(OUT, optimize=True)
print("wrote", OUT, out.size)
