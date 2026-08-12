// Shared SVG filter defs (used by coffee stains for uneven soak-in edges).
export function PaperFilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id="stain-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="10" />
        </filter>
        <filter id="edge-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="7" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="16" />
        </filter>
      </defs>
    </svg>
  );
}

// Decorative paper overlays: creases, coffee stain, faint ring, ink splatter, and small stamps.
// Positioned absolutely inside the paper container. Non-interactive (pointer-events: none).
export function PaperOverlays() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Creases */}
      <div className="crease-v" />
      <div className="crease-h" />

      {/* Main coffee stain — bleeds across the featured project area */}
      <div
        className="coffee-stain"
        style={{ width: '340px', height: '300px', top: '46%', right: '4%' }}
      />
      {/* Faint outer ring near the main stain */}
      <div
        className="coffee-ring"
        style={{ width: '160px', height: '140px', top: '42%', right: '2%' }}
      />

      {/* Small faint ring elsewhere */}
      <div
        className="coffee-ring"
        style={{ width: '90px', height: '80px', top: '18%', left: '6%', opacity: 0.5 }}
      />

      {/* A few ink splatters */}
      <div className="ink-splat" style={{ top: '20%', right: '18%', width: 5, height: 5 }} />
      <div className="ink-splat" style={{ top: '55%', left: '10%', width: 4, height: 4, opacity: 0.7 }} />
      <div className="ink-splat" style={{ top: '75%', right: '22%', width: 7, height: 7, opacity: 0.8 }} />
      <div className="ink-splat" style={{ top: '78%', right: '20%', width: 3, height: 3 }} />

      {/* PRINTED ON THE WEB stamp (top-left) */}
      <div className="stamp-circle" style={{ top: '18px', left: '18px' }}>
        Printed<br />on the<br />Web
      </div>

      {/* Small monogram crest (bottom-right) */}
      <div className="stamp-circle" style={{ bottom: '22px', right: '22px', width: 70, height: 70, transform: 'rotate(6deg)' }}>
        A · H<br />MMXXVI
      </div>

      {/* Extra ink splatters near the main stain */}
      <div className="ink-splat" style={{ top: '52%', right: '30%', width: 3, height: 3, opacity: 0.6 }} />
      <div className="ink-splat" style={{ top: '60%', right: '8%', width: 5, height: 5, opacity: 0.65 }} />
      <div className="ink-splat" style={{ top: '64%', right: '35%', width: 2, height: 2 }} />

      {/* Page-corner marker top-right — a small folded corner cue */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, right: 0, width: 46, height: 46,
          background: 'linear-gradient(225deg, rgba(200, 170, 110, 0.9) 0%, rgba(200, 170, 110, 0.9) 48%, transparent 50%)',
          boxShadow: '-2px 2px 4px rgba(0,0,0,0.15)',
          mixBlendMode: 'multiply',
          opacity: 0.75,
        }}
      />

      {/* Handwritten annotation, faint */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '9%', right: '4%',
          transform: 'rotate(-6deg)',
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '13px',
          color: 'rgba(90, 40, 20, 0.55)',
          mixBlendMode: 'multiply',
          letterSpacing: '0.02em',
        }}
      >
        vol. i — keep.
      </div>
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
