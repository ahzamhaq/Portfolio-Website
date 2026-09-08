"""
Paper edge strips — v4.
Goal: inner boundary is visibly jagged/torn, varying sharply per column.
The silhouette itself IS the edge — not a solid band.

Reference: irregular torn inner boundary, 20–55px deep depending on column,
with rapid column-to-column variation so the inner edge looks like torn fibers.
Outer 8–12px is always solid (the rim). Inner boundary is the irregular part.
"""

from PIL import Image
import random, math

random.seed(42)

STRIP_THICKNESS = 80  # matches Newspaper.jsx

# Colors
OUTER = (52,  28,  10)   # dark sepia rim
MID   = (100, 62,  24)   # warm brown mid
INNER = (165, 115, 58)   # lighter torn-fiber tip

def color_at(depth_frac):
    """depth_frac 0=outer rim, 1=innermost torn tip"""
    if depth_frac < 0.4:
        t = depth_frac / 0.4
        rgb = tuple(int(OUTER[i] + t * (MID[i] - OUTER[i])) for i in range(3))
    else:
        t = (depth_frac - 0.4) / 0.6
        rgb = tuple(int(MID[i] + t * (INNER[i] - MID[i])) for i in range(3))
    n = random.randint(-10, 10)
    return tuple(max(0, min(255, v + n)) for v in rgb)


def torn_profile(length, min_px=18, max_px=58):
    """
    Per-column depth that creates a ragged torn inner boundary.
    Uses multiple noise layers at different scales:
    - Very-low-freq: big undulations (wide torn chunks)
    - Low-freq: medium bumps
    - High-freq: sharp ragged spikes (the torn fibers)
    The high-freq component is key — it makes adjacent columns differ sharply.
    """
    def randn(n): return [random.gauss(0, 1) for _ in range(n)]

    def smooth(arr, w):
        out = arr[:]
        for i in range(len(arr)):
            lo, hi = max(0, i-w), min(len(arr), i+w+1)
            out[i] = sum(arr[lo:hi]) / (hi-lo)
        return out

    def norm(arr):
        mx = max(abs(v) for v in arr) or 1
        return [v/mx for v in arr]

    broad  = norm(smooth(randn(length), 100))  # very broad undulations
    medium = norm(smooth(randn(length),  20))  # medium bumps
    fine   = norm(smooth(randn(length),   3))  # sharp per-column variation
    raw_fine = [random.gauss(0,1) for _ in range(length)]  # unsmoothed spikes

    amp = (max_px - min_px) / 2
    mid = (max_px + min_px) / 2

    profile = []
    for i in range(length):
        # 35% broad + 25% medium + 25% fine + 15% raw spikes
        v = (broad[i]    * 0.35
           + medium[i]   * 0.25
           + fine[i]     * 0.25
           + raw_fine[i] * 0.15)
        depth = mid + v * amp
        profile.append(max(min_px, min(max_px, depth)))

    # Only very light smoothing — we want the jaggedness
    out = profile[:]
    for i in range(1, length-1):
        out[i] = profile[i-1]*0.15 + profile[i]*0.70 + profile[i+1]*0.15
    return out


def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    profile = torn_profile(width, min_px=16, max_px=58)

    for x in range(width):
        depth = profile[x]
        for y in range(height):
            if y >= depth:
                break
            df = y / depth  # 0=outer, 1=inner tip

            # Alpha: solid for outer 80%, then fade the inner 20% (torn fiber tips)
            if df < 0.80:
                a = 255
            else:
                t = (df - 0.80) / 0.20
                a = int(255 * (1.0 - t**1.2))

            # Add tiny noise to alpha to break up the solid band look
            a = max(0, min(255, a + random.randint(-8, 8)))
            col = color_at(df)
            px[x, y] = (*col, a)
    return img


def make_bottom_strip(width=1800, height=STRIP_THICKNESS):
    return make_top_strip(width, height).transpose(Image.FLIP_TOP_BOTTOM)

def make_left_strip(h=2400, width=STRIP_THICKNESS):
    return make_top_strip(h, width).transpose(Image.ROTATE_90)

def make_right_strip(h=2400, width=STRIP_THICKNESS):
    return make_top_strip(h, width).transpose(Image.ROTATE_270)


OUT = r"c:\Users\HP\Desktop\PROJECTS\Portfolio Website\public\textures"

for name, fn in [
    ("paper-edge-top.webp",    make_top_strip),
    ("paper-edge-bottom.webp", make_bottom_strip),
    ("paper-edge-left.webp",   make_left_strip),
    ("paper-edge-right.webp",  make_right_strip),
]:
    print(f"{name}...", end=" ", flush=True)
    img = fn()
    img.save(f"{OUT}\\{name}", "WEBP", lossless=True, quality=100)
    print(img.size)

print("Done.")
