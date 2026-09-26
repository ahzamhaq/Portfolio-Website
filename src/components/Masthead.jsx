import { Fleuron } from './PaperDecor.jsx';

const NAV = [
  { label: 'ABOUT', href: '#top-story' },
  { label: 'WORK', href: '#work' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

function Sunburst({ className = 'h-9 w-9' }) {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="-20 -20 40 40" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {rays.map((a) => (
          <line key={a} x1="0" y1="-7" x2="0" y2={a % 45 === 0 ? -17 : -12} transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r="4" fill="currentColor" />
    </svg>
  );
}

export function Monogram({ className = 'h-9 w-9' }) {
  return (
    <span className={`inline-flex items-center justify-center font-display text-3xl leading-none ${className}`} aria-hidden>
      AH
    </span>
  );
}

function Manicule({ flip = false }) {
  return (
    <svg viewBox="0 0 40 20" className="h-5 w-10" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g fill="currentColor">
        <path d="M2 9 H12 L14 6 H24 L26 8 H33 L37 10 L33 12 H26 L24 14 H14 L12 11 H2 Z" />
      </g>
      <g stroke="#dcc9a1" strokeWidth="0.8" fill="none">
        <path d="M14 8 H23 M14 12 H23" />
      </g>
    </svg>
  );
}

export default function Masthead() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const [weekday, ...rest] = today.replace(',', '').split(' ');

  return (
    <header className="relative pt-2">
      {/* top strip: issue info · special edition + monogram · date */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div className="font-sans text-[10px] leading-[1.6] tracking-editorial text-ink sm:text-[11px]">
          <div>VOL. 01 · NO. 01</div>
          <div>NEW DELHI · WEB</div>
        </div>

        <div className="flex flex-col items-center text-ink">
          <div className="font-sans text-[10px] tracking-editorial sm:text-[11px]">SPECIAL EDITION</div>
          <div className="mt-1 flex items-center gap-3">
            <span className="hidden text-ink-muted sm:inline"><Fleuron className="h-3 w-3" /></span>
            <Monogram />
            <span className="hidden text-ink-muted sm:inline"><Fleuron className="h-3 w-3" /></span>
          </div>
        </div>

        <div className="flex items-start justify-end gap-3 text-right font-sans text-[10px] leading-[1.6] tracking-editorial text-ink sm:text-[11px]">
          <div>
            <div>{weekday.toUpperCase()},</div>
            <div>{rest.join(' ').toUpperCase()}</div>
          </div>
          <Sunburst className="hidden h-9 w-9 text-ink-soft sm:block" />
        </div>
      </div>

      {/* nameplate */}
      <h1 className="masthead-title mt-3 text-center text-[2.1rem] text-ink ink-print min-[420px]:text-[2.7rem] sm:text-[4rem] md:text-[5.2rem] lg:text-[5.9rem]">
        <span className="the">The</span> Ahzam Haque
      </h1>

      <div className="mt-2 text-center font-headline text-[11px] tracking-[0.32em] text-ink sm:text-base">
        COMPUTER SCIENCE · SOFTWARE · AI
      </div>
      <div className="mt-1 text-center font-meta text-sm italic text-ink-soft sm:text-base">
        The Chronicle of a Developer in Progress · Price: One Curious Reader
      </div>

      {/* navigation with pointing hands */}
      <nav className="mt-5 flex items-center gap-3 border-y-[3px] border-double border-ink py-2 text-ink">
        <span className="hidden sm:block"><Manicule /></span>
        <ul className="nav-serif flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] sm:justify-around sm:text-[15px]">
          {NAV.map((item, i) => (
            <li key={item.href} className="flex items-center gap-3">
              <a href={item.href} className="transition-colors hover:text-accent-burgundy">
                {item.label}
              </a>
              {i < NAV.length - 1 && <span className="hidden text-ink-faded sm:inline">·</span>}
            </li>
          ))}
        </ul>
        <span className="hidden sm:block"><Manicule flip /></span>
      </nav>
    </header>
  );
}
