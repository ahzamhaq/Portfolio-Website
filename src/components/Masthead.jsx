import { Fleuron } from './PaperDecor.jsx';

const NAV = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Masthead() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="relative pt-6 sm:pt-10">
      {/* top metadata strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink pb-2 text-[10px] font-sans tracking-editorial text-ink-muted sm:text-[11px]">
        <span>VOL. 01 · NO. 01</span>
        <span className="hidden sm:block">EST. 2026 · NEW DELHI · WEB</span>
        <span>{today.toUpperCase()}</span>
      </div>

      {/* masthead */}
      <div className="pt-6 text-center">
        <div className="section-label">SPECIAL DEVELOPER EDITION</div>

        <div className="mx-auto mt-2 flex max-w-md items-center justify-center gap-3 text-ink-muted">
          <span className="h-px flex-1 bg-ink-muted/50" />
          <Fleuron className="h-3 w-3" />
          <span className="h-px flex-1 bg-ink-muted/50" />
        </div>

        <h1 className="mt-3 font-headline text-[3.2rem] font-black leading-[0.88] tracking-tight text-ink ink-print sm:text-[5.4rem] md:text-[7rem]">
          The Ahzam Haque
        </h1>

        <div className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-3 text-[11px] font-sans tracking-editorial text-ink-muted sm:text-xs">
          <span className="h-px flex-1 bg-ink-muted/50" />
          <span>COMPUTER SCIENCE · SOFTWARE · AI</span>
          <span className="h-px flex-1 bg-ink-muted/50" />
        </div>
        <div className="mt-2 font-meta text-sm italic text-ink-soft sm:text-base">
          The Chronicle of a Developer in Progress · Price: One Curious Reader
        </div>
      </div>

      {/* integrated navigation */}
      <nav className="mt-6 border-y-2 border-ink py-2">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[11px] tracking-editorial text-ink sm:gap-x-8 sm:text-xs">
          <li className="hidden text-ink-muted sm:inline"><Fleuron className="h-2.5 w-2.5" /></li>
          {NAV.map((item, i) => (
            <li key={item.href} className="flex items-center gap-4 sm:gap-8">
              <a href={item.href} className="hover:text-accent-burgundy transition-colors">
                {item.label}
              </a>
              {i < NAV.length - 1 && <span className="text-ink-faded">·</span>}
            </li>
          ))}
          <li className="hidden text-ink-muted sm:inline"><Fleuron className="h-2.5 w-2.5" /></li>
        </ul>
      </nav>
    </header>
  );
}
