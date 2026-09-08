"""
Paper edge strips — final version.

Reference: worn/frayed parchment edge.
- Outer 0-6px: clearly darker warm sepia-brown (NOT near-black, NOT gray)
- Inner torn zone: parchment aging tones fading to transparent
- Shape: continuous bumpy torn boundary, 14-38px deep, no spikes
"""

from PIL import Image
import random

random.seed(55)

STRIP_THICKNESS = 80

# Correct color stops based on reference:
# Outermost: clear warm dark sepia — the "burned/aged" outer rim
OUTER = ( 95,  58,  18)   # warm dark sepia
MID   = (148, 100,  42)   # medium warm brown
INNER = (200, 162,  98)   # faded parchment-brown

def color_at(df):
    """df 0=outermost → 1=innermost torn tip"""
    if df < 0.25:
        t = df / 0.25
        rgb = tuple(int(OUTER[i] + t*(MID[i]-OUTER[i])) for i in range(3))
    else:
        t = (df-0.25)/0.75
        rgb = tuple(int(MID[i] + t*(INNER[i]-MID[i])) for i in range(3))
    n = random.randint(-8, 8)
    return tuple(max(0, min(255, v+n)) for v in rgb)


def smooth(arr, w):
    out = arr[:]
    for i in range(len(arr)):
        lo, hi = max(0, i-w), min(len(arr), i+w+1)
        out[i] = sum(arr[lo:hi]) / (hi-lo)
    return out

def norm(arr):
    mx = max(abs(v) for v in arr) or 1
    return [v/mx for v in arr]


def torn_profile(length, min_px=14, max_px=38):
    p1 = norm(smooth([random.gauss(0,1) for _ in range(length)], 120))
    p2 = norm(smooth([random.gauss(0,1) for _ in range(length)],  35))
    p3 = norm(smooth([random.gauss(0,1) for _ in range(length)],   8))

    amp = (max_px - min_px) / 2
    mid = (max_px + min_px) / 2

    profile = []
    for i in range(length):
        v = p1[i]*0.50 + p2[i]*0.35 + p3[i]*0.15
        profile.append(max(min_px, min(max_px, mid + v*amp)))
    return profile


def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    profile = torn_profile(width, min_px=14, max_px=38)

    for x in range(width):
        depth = profile[x]
        for y in range(height):
            if y >= depth:
                break
            df = y / depth

            if df < 0.75:
                a = 255
            else:
                t = (df - 0.75) / 0.25
                a = int(255 * (1.0 - t**1.3))

            a = max(0, min(255, a + random.randint(-6, 6)))
            px[x, y] = (*color_at(df), a)
    return img


def make_bottom_strip(w=1800, h=STRIP_THICKNESS):
    return make_top_strip(w, h).transpose(Image.FLIP_TOP_BOTTOM)

def make_left_strip(h=2400, w=STRIP_THICKNESS):
    return make_top_strip(h, w).transpose(Image.ROTATE_90)

def make_right_strip(h=2400, w=STRIP_THICKNESS):
    return make_top_strip(h, w).transpose(Image.ROTATE_270)


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
