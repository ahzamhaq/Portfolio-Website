"""
Paper edge strips v5 — jagged torn inner boundary.
Key insight from v4 diagnosis: range was only 20px because smoothing killed
the raw spikes. Here we use a different approach:
- Build the profile as a series of "torn segments" with random depths
- Each segment is 2-8px wide, with sharp jumps between segments
- Then blend over a very short window (2-3px) to avoid 1-pixel steps
- This gives the visual look of torn paper fiber tips
"""

from PIL import Image
import random, math

random.seed(13)

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


def torn_profile(length, min_px=14, max_px=62):
    """
    Build profile as torn "teeth":
    - A broad slow-moving base (the general undulation of the torn edge)
    - Sharp teeth: short runs at varying depths, with sudden transitions
    """
    # Step 1: broad base via very-smoothed noise
    raw = [random.gauss(0, 1) for _ in range(length)]
    # Heavy smooth for broad base
    base = raw[:]
    for _ in range(40):
        tmp = base[:]
        for i in range(1, length-1):
            tmp[i] = (base[i-1] + base[i] + base[i+1]) / 3
        base = tmp
    # Normalize base to [-1, 1]
    mx = max(abs(v) for v in base) or 1
    base = [v/mx for v in base]

    # Step 2: torn teeth — random segments of varying depth
    teeth = [0.0] * length
    i = 0
    while i < length:
        seg_w = random.randint(2, 9)          # width of this tooth/gap
        # tooth depth: random, can be shallow or deep
        tooth_val = random.choice([
            random.uniform(-1.0, -0.4),       # deep cut (more opaque further in)
            random.uniform(-0.4,  0.1),       # medium
            random.uniform( 0.1,  0.7),       # shallow (less opaque)
        ])
        for j in range(i, min(i+seg_w, length)):
            teeth[j] = tooth_val
        i += seg_w

    # Light smooth on teeth (3-tap, 1 pass) — just remove 1-pixel artifacts
    tmp = teeth[:]
    for i in range(1, length-1):
        tmp[i] = teeth[i-1]*0.2 + teeth[i]*0.6 + teeth[i+1]*0.2
    teeth = tmp

    # Combine: 50% base + 50% teeth
    amp   = (max_px - min_px) / 2
    mid_v = (max_px + min_px) / 2
    profile = []
    for i in range(length):
        v = base[i]*0.5 + teeth[i]*0.5
        depth = mid_v + v * amp
        profile.append(max(min_px, min(max_px, depth)))

    return profile


def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    profile = torn_profile(width, min_px=12, max_px=60)

    for x in range(width):
        depth = profile[x]
        for y in range(height):
            if y >= depth:
                break
            df = y / depth

            # Solid for outer 85%, then sharp fade at torn tip
            if df < 0.85:
                a = 255
            else:
                t = (df - 0.85) / 0.15
                a = int(255 * (1.0 - t**1.0))

            a = max(0, min(255, a + random.randint(-6, 6)))
            px[x, y] = (*color_at(df), a)
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
