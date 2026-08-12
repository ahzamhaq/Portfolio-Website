// Placeholder portrait area with subtle moving-photograph effect.
// Replace the inner content with an <img /> when a real portrait is available.
export default function Portrait({ caption = 'FIG. 00 — THE DEVELOPER, IN RESIDENCE' }) {
  return (
    <figure className="w-full">
      <div className="halftone newspaper-photo relative aspect-[4/5] w-full overflow-hidden border border-ink">
        <div className="portrait-drift absolute inset-0">
          {/* Stylised placeholder — clearly marked as a placeholder */}
          <svg viewBox="0 0 200 250" className="h-full w-full">
            <rect width="200" height="250" fill="#d9c9a3" />
            {/* soft backdrop vignette */}
            <radialGradient id="bg" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#c9b892" />
              <stop offset="100%" stopColor="#8a7a58" />
            </radialGradient>
            <rect width="200" height="250" fill="url(#bg)" />
            {/* shoulders */}
            <path d="M20 250 Q100 160 180 250 Z" fill="#3a2f22" />
            {/* neck */}
            <rect x="88" y="128" width="24" height="30" fill="#7a6547" />
            {/* head */}
            <ellipse cx="100" cy="100" rx="38" ry="46" fill="#8a7357" />
            {/* hair */}
            <path d="M62 92 Q70 46 100 46 Q130 46 138 92 Q130 74 100 74 Q70 74 62 92 Z" fill="#241a10" />
            {/* eyes — blink subtly */}
            <g className="portrait-blink">
              <ellipse cx="86" cy="102" rx="3" ry="2.5" fill="#1a1611" />
              <ellipse cx="114" cy="102" rx="3" ry="2.5" fill="#1a1611" />
            </g>
            {/* mouth */}
            <path d="M90 122 Q100 128 110 122" stroke="#1a1611" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        {/* subtle deckle border shadow */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]" />
        <div className="pointer-events-none absolute left-2 top-2 rounded-sm bg-paper/70 px-1.5 py-0.5 font-sans text-[9px] tracking-editorial text-ink-muted">
          PLACEHOLDER
        </div>
      </div>
      <figcaption className="mt-2 border-t border-ink pt-1 font-sans text-[10px] tracking-editorial text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
