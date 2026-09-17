const PERF_TEST_NO_EFFECTS = false;

// Shared SVG filter defs — stain-warp and stain-warp-sm distort the ring
// stains to look irregular/organic. Referenced by inline SVG stains below.
export function PaperFilterDefs() {
  if (PERF_TEST_NO_EFFECTS) return null;
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        {/* Large stain warp — coarse, organic distortion */}
        <filter id="stain-warp" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="5" seed="17" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="28"
            xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.8" />
        </filter>
        {/* Small stain warp — finer distortion for smaller rings and drips */}
        <filter id="stain-warp-sm" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="23" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="18"
            xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.6" />
        </filter>
        {/* Edge rough — kept for any future edge effects */}
        <filter id="edge-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="7" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="16" />
        </filter>
      </defs>
    </svg>
  );
}

// ── SVG Tea/Coffee Stain components ──────────────────────────────────────────
//
// Each stain is drawn with stroked ellipses + irregular arcs through
// feDisplacementMap (stain-warp / stain-warp-sm filters defined in PaperFilterDefs).
// Key visual characteristics:
//   • Main ring: stroked ellipse, broken/irregular via displacement
//   • Center: very faint fill (water mark, almost clear)
//   • Heavier arc at the bottom — gravity causes solids to pool at the base
//   • Inner secondary ring — second drying line / tide mark
//   • Adjacent overlap ring — mug set down twice
//   • Tiny satellite drip marks
// mix-blend-mode: multiply makes them appear absorbed into the paper.
//
// All coordinates are in local SVG viewBox space; positioning uses inline style.

function StainLarge() {
  // Main stain: right side, spanning the featured-project area
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 290"
      style={{
        position: 'absolute',
        top: '43%', right: '1%',
        width: '320px', height: '290px',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {/* Center wash — the ghost of the liquid that soaked through */}
      <ellipse cx="155" cy="140" rx="118" ry="104"
        fill="rgba(62,28,5,0.042)" filter="url(#stain-warp)" />

      {/* Primary deposit ring — main dried edge, thicker and irregular */}
      <ellipse cx="155" cy="140" rx="116" ry="102"
        fill="none"
        stroke="rgba(56,22,4,0.24)"
        strokeWidth="18"
        filter="url(#stain-warp)" />

      {/* Heavier lower arc — gravity pooling at the bottom of the ring */}
      <path
        d="M 44 168 C 82 248 232 246 268 165"
        fill="none"
        stroke="rgba(48,18,3,0.16)"
        strokeWidth="26"
        strokeLinecap="round"
        filter="url(#stain-warp)" />

      {/* Inner secondary ring — second tide mark as the liquid evaporated */}
      <ellipse cx="153" cy="138" rx="82" ry="72"
        fill="none"
        stroke="rgba(56,22,4,0.08)"
        strokeWidth="5"
        filter="url(#stain-warp)" />

      {/* Adjacent smaller ring — mug placed a second time, slightly offset */}
      <ellipse cx="236" cy="84" rx="55" ry="50"
        fill="rgba(62,28,5,0.025)"
        stroke="rgba(56,22,4,0.17)"
        strokeWidth="11"
        filter="url(#stain-warp-sm)" />

      {/* Satellite drip marks outside the main ring */}
      <circle cx="277" cy="140" r="5"   fill="rgba(50,18,3,0.14)" filter="url(#stain-warp-sm)" />
      <circle cx="268" cy="172" r="3.5" fill="rgba(50,18,3,0.11)" filter="url(#stain-warp-sm)" />
      <circle cx="42"  cy="150" r="3"   fill="rgba(50,18,3,0.10)" filter="url(#stain-warp-sm)" />
      <circle cx="240" cy="52"  r="2.5" fill="rgba(50,18,3,0.12)" filter="url(#stain-warp-sm)" />
    </svg>
  );
}

function StainSmall() {
  // Secondary stain: lower-left, asymmetric balance
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 145"
      style={{
        position: 'absolute',
        bottom: '13%', left: '5%',
        width: '160px', height: '145px',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        overflow: 'visible',
        opacity: 0.82,
      }}
    >
      {/* Water mark */}
      <ellipse cx="80" cy="72" rx="66" ry="57"
        fill="rgba(62,28,5,0.038)" filter="url(#stain-warp-sm)" />

      {/* Main ring */}
      <ellipse cx="80" cy="72" rx="64" ry="55"
        fill="none"
        stroke="rgba(56,22,4,0.21)"
        strokeWidth="13"
        filter="url(#stain-warp-sm)" />

      {/* Heavier lower arc */}
      <path
        d="M 22 88 C 50 132 112 130 138 86"
        fill="none"
        stroke="rgba(48,18,3,0.14)"
        strokeWidth="18"
        strokeLinecap="round"
        filter="url(#stain-warp-sm)" />

      {/* Inner tide mark */}
      <ellipse cx="78" cy="70" rx="44" ry="36"
        fill="none"
        stroke="rgba(56,22,4,0.07)"
        strokeWidth="4"
        filter="url(#stain-warp-sm)" />
    </svg>
  );
}

function StainTiny() {
  // Small cup ring: upper-left, very faint
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 90"
      style={{
        position: 'absolute',
        top: '17%', left: '5%',
        width: '100px', height: '90px',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        overflow: 'visible',
        opacity: 0.65,
      }}
    >
      <ellipse cx="50" cy="45" rx="42" ry="36"
        fill="rgba(62,28,5,0.025)" filter="url(#stain-warp-sm)" />

      <ellipse cx="50" cy="45" rx="40" ry="34"
        fill="none"
        stroke="rgba(56,22,4,0.18)"
        strokeWidth="9"
        filter="url(#stain-warp-sm)" />

      {/* Very thin inner line */}
      <ellipse cx="49" cy="44" rx="26" ry="21"
        fill="none"
        stroke="rgba(56,22,4,0.06)"
        strokeWidth="3"
        filter="url(#stain-warp-sm)" />
    </svg>
  );
}

// Decorative paper overlays — Phase 2.3: static pre-rendered stain images only.
// No SVG filters, no blend modes, no animation. Pointer-events: none throughout.
// PERF_TEST_NO_EFFECTS gates the old procedural stains only; static images are always on.
const stain = (src, style) => (
  <img
    aria-hidden
    src={src}
    draggable={false}
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      userSelect: 'none',
      display: 'block',
      ...style,
    }}
  />
);

export function PaperOverlays() {
  return (
    // overflow:visible so stains near edges aren't clipped by paper-surface's overflow:hidden
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}>

      {/* ── Large coffee ring — right-centre, spanning featured-project area ── */}
      {stain('/textures/stain-ring-lg.webp', {
        width: 340, height: 340,
        top: '41%', right: '2%',
        opacity: 0.38,
        transform: 'rotate(14deg)',
      })}

      {/* ── Large spill — lower-left, irregular absorbed patch ── */}
      {stain('/textures/stain-spill-lg.webp', {
        width: 380, height: 356,
        bottom: '8%', left: '1%',
        opacity: 0.32,
        transform: 'rotate(-8deg)',
      })}

      {/* ── Small ring — upper-left, subtle accent ── */}
      {stain('/textures/stain-ring-sm.webp', {
        width: 160, height: 160,
        top: '14%', left: '3%',
        opacity: 0.30,
        transform: 'rotate(5deg)',
      })}

      {/* ── Small splash cluster — mid-right, quiet accent ── */}
      {stain('/textures/stain-splash-sm.webp', {
        width: 130, height: 130,
        top: '62%', right: '6%',
        opacity: 0.32,
        transform: 'rotate(-22deg)',
      })}

      {/* ── Faint partial ring — lower-right, very subtle background variation ── */}
      {stain('/textures/stain-ring-faint.webp', {
        width: 260, height: 174,
        bottom: '22%', right: '4%',
        opacity: 0.28,
        transform: 'rotate(6deg)',
      })}

      {/* ── Second small ring — upper-right, very faint ── */}
      {stain('/textures/stain-ring-sm.webp', {
        width: 110, height: 110,
        top: '7%', right: '8%',
        opacity: 0.22,
        transform: 'rotate(-11deg)',
      })}

    </div>
  );
}

// Tiny inline ornament — used between headline sections and inside dividers.
export function Fleuron({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </g>
    </svg>
  );
}

// A pointing hand pointer glyph, editorial-style.
export function ManiculeRight({ className = 'h-4 w-6' }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10 L20 10" />
        <path d="M14 4 L22 10 L14 16" />
        <path d="M22 10 L30 10" strokeDasharray="2 2" />
      </g>
    </svg>
  );
}
