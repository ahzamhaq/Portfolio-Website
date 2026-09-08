"""
Generate four paper-edge WebP strips for the newspaper portfolio.
Target: clearly visible worn/torn paper perimeter, ~30px ink band,
transparent center. No blur, no gradients, no SVG, no filters.
"""

from PIL import Image
import random
import math

random.seed(42)

# ── Palette ──────────────────────────────────────────────────────────────────
# Parchment base is #E8D5B0.  Edge tones are aged/darkened variants.
EDGE_COLORS = [
    (120,  80,  38),   # dark sepia
    (140,  95,  45),
    (160, 110,  55),
    (100,  65,  28),   # very dark worn spot
    (175, 125,  65),
    (155, 105,  50),
    ( 90,  55,  22),   # charcoal-brown
    (180, 140,  80),   # lighter aged tone
]

def pick_color(depth_frac):
    """depth_frac 0 = outermost (darkest) → 1 = innermost (lightest/fading)."""
    base = random.choice(EDGE_COLORS[:5])
    # lighten toward inner edge
    r = int(base[0] + depth_frac * 60)
    g = int(base[1] + depth_frac * 55)
    b = int(base[2] + depth_frac * 30)
    return min(r, 232), min(g, 200), min(b, 160)

def alpha_for_depth(depth_frac):
    """
    depth_frac 0 = outermost pixel, 1 = innermost edge pixel.
    Alpha ramps down toward inner edge (not a smooth gradient —
    we add heavy per-pixel noise on top to break it up).
    """
    base = max(0.0, 1.0 - depth_frac ** 0.9)
    noise = random.gauss(0, 0.18)
    return max(0, min(255, int((base + noise) * 220)))


# ── Per-column/row profile generator ─────────────────────────────────────────
def torn_profile(length, min_px=18, max_px=35, freq=0.07, roughness=0.55):
    """
    Return list[length] of floats: how many opaque edge pixels per
    column/row, using layered sine + noise to look torn/worn.
    No spikes, no drips: profile varies between min_px and max_px.
    """
    profile = []
    phase = random.uniform(0, math.tau)
    phase2 = random.uniform(0, math.tau)
    amp = (max_px - min_px) / 2
    mid = (max_px + min_px) / 2

    for i in range(length):
        wave  = amp * math.sin(freq * i + phase)
        wave2 = amp * roughness * math.sin(freq * 2.3 * i + phase2)
        nz    = random.gauss(0, amp * 0.35)
        px = mid + wave + wave2 + nz
        profile.append(max(min_px, min(max_px, px)))

    # Smooth a tiny bit (3-sample average) to avoid single-pixel spikes
    smoothed = profile[:]
    for i in range(1, length - 1):
        smoothed[i] = (profile[i-1] + profile[i] + profile[i+1]) / 3
    return smoothed


# ── Strip dimensions ──────────────────────────────────────────────────────────
# Strip height (for top/bottom) or width (for left/right).
# Must be >= max_px so transparent center always has room.
STRIP_THICKNESS = 56   # px  (matches the 56px in Newspaper.jsx)
MIN_PX = 22
MAX_PX = 34


def make_top_strip(width=1800, height=STRIP_THICKNESS):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px  = img.load()
    profile = torn_profile(width, MIN_PX, MAX_PX)

    for x in range(width):
        edge_px = profile[x]
        for y in range(height):
            if y < edge_px:
                depth_frac = y / edge_px          # 0=outer, 1=inner
                col = pick_color(depth_frac)
                a   = alpha_for_depth(depth_frac)
                # Extra density at very outer rim (y == 0,1)
                if y <= 1:
                    a = min(255, a + 40)
                px[x, y] = (*col, a)
    return img


def make_bottom_strip(width=1800, height=STRIP_THICKNESS):
    img  = make_top_strip(width, height)
    return img.transpose(Image.FLIP_TOP_BOTTOM)


def make_left_strip(height=2400, width=STRIP_THICKNESS):
    # Build as a top strip then rotate
    tmp = make_top_strip(height, width)
    return tmp.transpose(Image.ROTATE_90)   # 90° CCW → left edge


def make_right_strip(height=2400, width=STRIP_THICKNESS):
    tmp = make_top_strip(height, width)
    return tmp.transpose(Image.ROTATE_270)  # 90° CW → right edge


# ── Write ─────────────────────────────────────────────────────────────────────
OUT = r"c:\Users\HP\Desktop\PROJECTS\Portfolio Website\public\textures"

strips = {
    "paper-edge-top.webp":    make_top_strip(),
    "paper-edge-bottom.webp": make_bottom_strip(),
    "paper-edge-left.webp":   make_left_strip(),
    "paper-edge-right.webp":  make_right_strip(),
}

for name, img in strips.items():
    path = f"{OUT}\\{name}"
    img.save(path, "WEBP", lossless=True, quality=100)
    print(f"Saved {path}  ({img.size})")

print("Done.")
