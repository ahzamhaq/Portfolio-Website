"""
Paper edge strips v6.
Lesson from preview: teeth/spikes = wrong. Torn paper = bumpy continuous boundary.
Approach: multi-scale smooth noise only. No raw random jumps.
The inner boundary undulates with bumps 20-80px wide, depth varies 20-55px.
No spikes. No drips. The boundary is a continuous irregular curve.
"""

from PIL import Image
import random, math

random.seed(99)

STRIP_THICKNESS = 80

OUTER = (50,  26,   8)
MID   = (98,  60,  22)
INNER = (162, 112, 55)

def color_at(df):
    if df < 0.4:
        t = df / 0.4
        rgb = tuple(int(OUTER[i] + t*(MID[i]-OUTER[i])) for i in range(3))
    else:
        t = (df-0.4)/0.6
        rgb = tuple(int(MID[i] + t*(INNER[i]-MID[i])) for i in range(3))
    n = random.randint(-10, 10)
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


def torn_profile(length, min_px=22, max_px=54):
    """
    Three layers of smooth noise at different scales.
    All layers are smooth — no spikes.
    Scale 1: very broad (~150px bumps) — the big torn chunks
    Scale 2: medium (~40px bumps) — intermediate bumps
    Scale 3: fine (~10px bumps) — surface roughness (NOT spikes)
    """
    p1 = norm(smooth([random.gauss(0,1) for _ in range(length)], 150))
    p2 = norm(smooth([random.gauss(0,1) for _ in range(length)],  40))
    p3 = norm(smooth([random.gauss(0,1) for _ in range(length)],  10))

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
    profile = torn_profile(width, min_px=20, max_px=56)

    for x in range(width):
        depth = profile[x]
        for y in range(height):
            if y >= depth:
                break
            df = y / depth

            # Solid for outer 88%, quick fade at inner torn tip
            if df < 0.88:
                a = 255
            else:
                t = (df - 0.88) / 0.12
                a = int(255 * (1.0 - t))

            a = max(0, min(255, a + random.randint(-5, 5)))
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
