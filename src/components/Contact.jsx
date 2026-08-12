const LINKS = [
  { label: 'EMAIL', href: 'mailto:balmukundm2003@gmail.com', display: 'balmukundm2003@gmail.com' },
  { label: 'GITHUB', href: 'https://github.com/ahzamhaq', display: 'github.com/ahzamhaq' },
  { label: 'LINKEDIN', href: '#', display: 'linkedin.com/in/ahzamhaque' },
  { label: 'RESUME', href: '#', display: 'Download PDF' },
];

export default function Contact() {
  return (
    <section id="contact" className="pt-12">
      <div className="rule-double" />
      <div className="mt-6 text-center">
        <div className="section-label">FROM THE FRONT DESK</div>
        <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-ink ink-print sm:text-4xl">
          Contact the Editor
        </h3>
        <p className="mx-auto mt-2 max-w-xl font-meta text-base italic text-ink-soft">
          Letters, briefs, and small commissions are welcome. Replies arrive on paper — or, more realistically, by email.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-2xl border-y border-ink">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="grid grid-cols-12 items-baseline gap-3 border-b border-ink/40 py-3 last:border-b-0 hover:text-accent-burgundy"
          >
            <div className="col-span-3 font-sans text-[11px] tracking-editorial text-ink-muted">{l.label}</div>
            <div className="col-span-8 font-serif text-[1.05rem] text-ink">{l.display}</div>
            <div className="col-span-1 text-right font-sans text-xs tracking-editorial">→</div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="mx-auto h-px w-32 bg-ink" />
        <div className="mt-3 font-sans text-[11px] tracking-editorial text-ink-muted">END OF THE EDITION</div>
        <div className="mt-1 font-meta text-sm italic text-ink-soft">VOL. 01 · 2026</div>
        <div className="mx-auto mt-3 h-px w-32 bg-ink" />
      </div>
    </section>
  );
}
