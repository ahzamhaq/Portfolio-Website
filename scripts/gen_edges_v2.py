"""
Generate four paper-edge WebP strips matching the reference screenshot.
The reference shows: chunky, irregular torn/worn paper perimeter.
- Deep irregular "bite" silhouette — the inner boundary is very jagged
- Warm dark sepia at the outermost rim, lighter toward inner torn edge
- No blur, no gradient, no SVG, no filters
- Transparent center
"""

from PIL import Image
import random
import math

random.seed(77)

# ── Strip dimensions (match Newspaper.jsx: 56px thick) ───────────────────────
STRIP_THICKNESS = 56   # px

# ── Color palette — aged newspaper edge ──────────────────────────────────────
# Outermost rim: very dark sepia-brown (almost charcoal)
# Inner torn boundary: lighter, warmer

def edge_color(depth_frac):
    """
    depth_frac: 0.0 = outermost pixel (darkest), 1.0 = innermost torn pixel (lightest)
    Returns (R, G, B).
    """
    # Dark outer rim: #3A2010
    outer = (58, 32, 16)
    # Mid tone: #7A5028
    mid   = (122, 80, 40)
    # Inner torn edge: #B08050
    inner = (176, 128, 80)

    if depth_frac < 0.4:
        t = depth_frac / 0.4
        r = int(outer[0] + t * (mid[0] - outer[0]))
        g = int(outer[1] + t * (mid[1] - outer[1]))
        b = int(outer[2] + t * (mid[2] - outer[2]))
    else:
        t = (depth_frac - 0.4) / 0.6
        r = int(mid[0] + t * (inner[0] - mid[0]))
        g = int(mid[1] + t * (inner[1] - mid[1]))
        b = int(mid[2] + t * (inner[2] - mid[2]))

    # Add slight per-pixel variation for texture
    noise = random.randint(-10, 10)
    return (
        max(0, min(255, r + noise)),
        max(0, min(255, g + noise)),
        max(0, min(255, b + noise)),
    )


def alpha_at(y, edge_depth):
    """
    y: current pixel row (0 = outermost)
    edge_depth: torn profile depth for this column
    Returns alpha 0–255.
    """
    if y >= edge_depth:
        return 0  # transparent center

    depth_frac = y / edge_depth  # 0=outer, 1=inner torn boundary

    # Strong, mostly-opaque edge. Only fade the inner ~20% to blend torn boundary
    if depth_frac < 0.80:
        base_alpha = 255
    else:
        # Quick fade over the last 20% to soften torn fiber tips
        t = (depth_frac - 0.80) / 0.20
        base_alpha = int(255 * (1.0 - t * t))

    # Light noise so it's not a flat band
    noise = random.gauss(0, 8)
    return max(0, min(255, int(base_alpha + noise)))


# ── Torn profile generator ────────────────────────────────────────────────────
def torn_profile(length, min_px=28, max_px=52):
    """
    Return a list of floats (one per column/row) representing how deep the
    torn edge extends inward. Produces chunky irregular tears like the reference.

    Technique: layered noise at multiple frequencies.
    - Low-freq component: broad rises and falls (big torn chunks)
    - Mid-freq component: mid-size irregularity
    - High-freq component: fine fiber texture
    No single-pixel spikes; kept within [min_px, max_px].
    """
    amp_total = (max_px - min_px) / 2
    mid_val   = (max_px + min_px) / 2

    # Low freq (broad torn chunks)
    p1 = [random.gauss(0, 1) for _ in range(length)]
    # Mid freq
    p2 = [random.gauss(0, 1) for _ in range(length)]

    # Smooth p1 heavily (broad shapes)
    def smooth(arr, window):
        out = arr[:]
        for i in range(len(arr)):
            lo = max(0, i - window)
            hi = min(len(arr), i + window + 1)
            out[i] = sum(arr[lo:hi]) / (hi - lo)
        return out

    p1 = smooth(p1, 60)   # very broad chunks
    p2 = smooth(p2, 12)   # medium irregularity

    # Normalize each to [-1, 1]
    def norm(arr):
        mx = max(abs(v) for v in arr) or 1
        return [v / mx for v in arr]

    p1 = norm(p1)
    p2 = norm(p2)

    profile = []
    for i in range(length):
        # Combine: 60% broad + 30% mid + 10% fine noise
        val = (p1[i] * 0.60 + p2[i] * 0.30 + random.gauss(0, 0.10))
        depth = mid_val + val * amp_total
        depth = max(min_px, min(max_px, depth))
        profile.append(depth)

    # Light final smoothing to kill any single-pixel spikes
    out = profile[:]
    for i in range(2, length - 2):
        out[i] = (profile[i-2] + profile[i-1] + profile[i] + profile[i+1] + profile[i+2]) / 5

    return out


# ── Strip builders ────────────────────────────────────────────────────────────

def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    profile = torn_profile(width, min_px=28, max_px=height - 2)

    for x in range(width):
        edge_depth = profile[x]
        for y in range(height):
            if y < edge_depth:
                depth_frac = y / edge_depth
                col = edge_color(depth_frac)
                a   = alpha_at(y, edge_depth)
                px[x, y] = (*col, a)
    return img


def make_bottom_strip(width=1800, height=STRIP_THICKNESS):
    return make_top_strip(width, height).transpose(Image.FLIP_TOP_BOTTOM)


def make_left_strip(strip_h=2400, width=STRIP_THICKNESS):
    # Build as top strip (length=strip_h, thickness=width), then rotate
    tmp = make_top_strip(strip_h, width)
    return tmp.transpose(Image.ROTATE_90)   # 90° CCW → opaque at left


def make_right_strip(strip_h=2400, width=STRIP_THICKNESS):
    tmp = make_top_strip(strip_h, width)
    return tmp.transpose(Image.ROTATE_270)  # 90° CW → opaque at right


# ── Write ─────────────────────────────────────────────────────────────────────
OUT = r"c:\Users\HP\Desktop\PROJECTS\Portfolio Website\public\textures"

print("Generating top strip…")
top    = make_top_strip()
print("Generating bottom strip…")
bottom = make_bottom_strip()
print("Generating left strip…")
left   = make_left_strip()
print("Generating right strip…")
right  = make_right_strip()

strips = {
    "paper-edge-top.webp":    top,
    "paper-edge-bottom.webp": bottom,
    "paper-edge-left.webp":   left,
    "paper-edge-right.webp":  right,
}

for name, img in strips.items():
    path = f"{OUT}\\{name}"
    img.save(path, "WEBP", lossless=True, quality=100)
    print(f"Saved {path}  ({img.size})")

print("Done.")
