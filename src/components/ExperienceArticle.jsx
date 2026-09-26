const ENTRIES = [
  {
    dates: '2025 — Present',
    role: 'Full-Stack Developer',
    org: 'Independent · Personal & Team Projects',
  },
  {
    dates: '2024 — 2025',
    role: 'Contributor',
    org: 'ICPC USICT · Competitive Programming',
  },
  {
    dates: 'Ongoing',
    role: 'Student, Computer Science',
    org: 'Undergraduate Program',
  },
];

export default function ExperienceArticle() {
  return (
    <section id="experience" className="scroll-mt-6">
      <div className="flex items-baseline justify-between font-sans text-[10px] tracking-editorial text-ink">
        <span>THE CAREER CHRONICLE</span>
        <span className="text-ink-muted">PAGE C1</span>
      </div>
      <div className="mt-2 divide-y divide-ink/30 border-t border-ink">
        {ENTRIES.map((e) => (
          <div key={e.role + e.dates} className="grid grid-cols-[4.6rem_1fr] gap-3 py-2">
            <div className="font-serif text-[11px] italic leading-tight text-ink-muted">{e.dates}</div>
            <div>
              <div className="font-headline text-[13px] font-bold leading-tight text-ink">{e.role}</div>
              <div className="font-meta text-[12px] italic leading-tight text-ink-soft">{e.org}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
