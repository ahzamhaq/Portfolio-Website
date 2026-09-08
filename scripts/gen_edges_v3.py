"""
Generate four paper-edge WebP strips matching the reference screenshot.
Reference: chunky, deeply irregular torn paper perimeter — 40-70px deep tears,
warm dark sepia outer rim → lighter inner torn fiber tips. No blur/gradient/SVG.
Strip thickness: 80px (matching Newspaper.jsx).
"""

from PIL import Image
import random
import math

random.seed(77)

STRIP_THICKNESS = 80  # px — matches Newspaper.jsx


def edge_color(depth_frac):
    """depth_frac: 0=outermost (darkest) → 1=innermost torn tip (lightest)"""
    outer = (48,  26,  10)   # very dark sepia-brown
    mid   = (105, 65,  28)   # mid warm brown
    inner = (168, 118, 62)   # lighter warm fibre tip

    if depth_frac < 0.45:
        t = depth_frac / 0.45
        r = int(outer[0] + t * (mid[0] - outer[0]))
        g = int(outer[1] + t * (mid[1] - outer[1]))
        b = int(outer[2] + t * (mid[2] - outer[2]))
    else:
        t = (depth_frac - 0.45) / 0.55
        r = int(mid[0] + t * (inner[0] - mid[0]))
        g = int(mid[1] + t * (inner[1] - mid[1]))
        b = int(mid[2] + t * (inner[2] - mid[2]))

    noise = random.randint(-12, 12)
    return (
        max(0, min(255, r + noise)),
        max(0, min(255, g + noise)),
        max(0, min(255, b + noise)),
    )


def compute_alpha(y, edge_depth):
    """Solid from outer rim, quick fibrous fade over innermost 15%."""
    if y >= edge_depth:
        return 0

    depth_frac = y / edge_depth

    if depth_frac < 0.85:
        base = 255
    else:
        # soften torn fibre tips
        t = (depth_frac - 0.85) / 0.15
        base = int(255 * (1.0 - t ** 1.5))

    noise = random.gauss(0, 6)
    return max(0, min(255, int(base + noise)))


def torn_profile(length, min_px, max_px):
    """
    Chunky irregular torn profile. Three layers of smoothed noise combined:
    - Very broad (big torn chunks, reference-like)
    - Medium irregularity
    - Fine surface roughness
    Result clamped to [min_px, max_px].
    """
    def randn_list(n):
        return [random.gauss(0, 1) for _ in range(n)]

    def smooth(arr, w):
        out = arr[:]
        half = arr[:]
        for i in range(len(arr)):
            lo = max(0, i - w)
            hi = min(len(arr), i + w + 1)
            out[i] = sum(arr[lo:hi]) / (hi - lo)
        return out

    def normalize(arr):
        mx = max(abs(v) for v in arr) or 1
        return [v / mx for v in arr]

    p_broad  = normalize(smooth(randn_list(length), 80))   # broad chunks
    p_mid    = normalize(smooth(randn_list(length), 18))   # medium bumps
    p_fine   = normalize(smooth(randn_list(length),  4))   # fine roughness

    amp = (max_px - min_px) / 2
    mid = (max_px + min_px) / 2

    raw = []
    for i in range(length):
        v = p_broad[i] * 0.55 + p_mid[i] * 0.30 + p_fine[i] * 0.15
        raw.append(max(min_px, min(max_px, mid + v * amp)))

    # Final light 3-tap smooth to kill any remaining spikes
    out = raw[:]
    for i in range(1, length - 1):
        out[i] = (raw[i-1] + raw[i] + raw[i+1]) / 3
    return out


def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    # Tears go 42–76px deep into the 80px strip
    profile = torn_profile(width, min_px=42, max_px=76)

    for x in range(width):
        depth = profile[x]
        for y in range(height):
            if y < depth:
                df = y / depth
                col = edge_color(df)
                a   = compute_alpha(y, depth)
                px[x, y] = (*col, a)
    return img


def make_bottom_strip(width=1800, height=STRIP_THICKNESS):
    return make_top_strip(width, height).transpose(Image.FLIP_TOP_BOTTOM)


def make_left_strip(strip_h=2400, width=STRIP_THICKNESS):
    tmp = make_top_strip(strip_h, width)
    return tmp.transpose(Image.ROTATE_90)    # opaque at left (x=0)


def make_right_strip(strip_h=2400, width=STRIP_THICKNESS):
    tmp = make_top_strip(strip_h, width)
    return tmp.transpose(Image.ROTATE_270)   # opaque at right (x=width-1)


OUT = r"c:\Users\HP\Desktop\PROJECTS\Portfolio Website\public\textures"

print("top…",    end=" ", flush=True);   top    = make_top_strip();    print("done")
print("bottom…", end=" ", flush=True);   bottom = make_bottom_strip(); print("done")
print("left…",   end=" ", flush=True);   left   = make_left_strip();   print("done")
print("right…",  end=" ", flush=True);   right  = make_right_strip();  print("done")

for name, img in [
    ("paper-edge-top.webp",    top),
    ("paper-edge-bottom.webp", bottom),
    ("paper-edge-left.webp",   left),
    ("paper-edge-right.webp",  right),
]:
    path = f"{OUT}\\{name}"
    img.save(path, "WEBP", lossless=True, quality=100)
    print(f"Saved {name}  {img.size}")

print("All done.")
