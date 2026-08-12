// Editorial "photograph" for a project — placeholder illustration.
// Replace inner SVG with an <img /> screenshot when available.
export default function ProjectPhoto({ fig, title, className = 'aspect-[16/10]' }) {
  return (
    <figure className="w-full">
      <div className={`halftone newspaper-photo relative w-full overflow-hidden border border-ink ${className}`}>
        <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <rect width="400" height="250" fill="#d9c9a3" />
          {/* editorial rectangles evoking a UI screenshot */}
          <rect x="20" y="20" width="360" height="18" fill="#3a2f22" />
          <rect x="20" y="50" width="120" height="180" fill="#5a4f3f" />
          <rect x="150" y="50" width="230" height="60" fill="#8a7357" />
          <rect x="150" y="120" width="230" height="16" fill="#8a7357" />
          <rect x="150" y="144" width="180" height="10" fill="#8a7357" />
          <rect x="150" y="162" width="150" height="10" fill="#8a7357" />
          <rect x="150" y="190" width="80" height="24" fill="#3a2f22" />
        </svg>
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.35)]" />
      </div>
      <figcaption className="mt-2 border-t border-ink pt-1 font-sans text-[10px] tracking-editorial text-ink-muted">
        {fig} — {title.toUpperCase()}
      </figcaption>
    </figure>
  );
}
