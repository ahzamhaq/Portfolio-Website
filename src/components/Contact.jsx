const LINKS = [
  { label: 'EMAIL', href: 'mailto:balmukundm2003@gmail.com', display: 'balmukundm2003@gmail.com' },
  { label: 'GITHUB', href: 'https://github.com/ahzamhaq', display: 'github.com/ahzamhaq' },
  { label: 'LINKEDIN', href: '#', display: 'linkedin.com/in/ahzamhaque' },
  { label: 'RESUME', href: '#', display: 'Download PDF' },
];

export default function Contact() {
  return (
    <section id="contact" className="mt-8 scroll-mt-6 border-t-[3px] border-double border-ink pt-4">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_1.3fr_auto] md:gap-8">
        <div>
          <div className="font-sans text-[10px] tracking-editorial text-ink-muted">FROM THE FRONT DESK</div>
          <h3 className="mt-1 font-headline text-3xl font-black uppercase leading-none tracking-tight text-ink ink-print sm:text-4xl">
            Contact the Editor
          </h3>
          <p className="mt-2 font-meta text-[14px] italic leading-snug text-ink-soft">
            Letters, briefs, and small commissions are welcome. Replies arrive on paper — or, more realistically, by email.
          </p>
        </div>

        <div className="border-y border-ink">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="grid grid-cols-[5.5rem_1fr_auto] items-baseline gap-3 border-b border-ink/30 py-1.5 last:border-b-0 hover:text-accent-burgundy"
            >
              <span className="font-sans text-[10px] tracking-editorial text-ink-muted">{l.label}</span>
              <span className="font-serif text-[14px] text-ink">{l.display}</span>
              <span className="font-sans text-xs">→</span>
            </a>
          ))}
        </div>

        <div className="text-center md:border-l md:border-ink/60 md:pl-8">
          <div className="font-sans text-[10px] tracking-editorial text-ink-muted">END OF THE EDITION</div>
          <div className="mt-1 font-headline text-2xl font-black tracking-tight text-ink">VOL. 01 · 2026</div>
        </div>
      </div>
    </section>
  );
}
