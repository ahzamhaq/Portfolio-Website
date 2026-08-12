const DESK = [
  { label: 'LANGUAGES', items: ['C++', 'JavaScript', 'TypeScript', 'Python'] },
  { label: 'FRONTEND', items: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'BACKEND', items: ['Node.js', 'Express', 'REST APIs'] },
  { label: 'DATABASE', items: ['MongoDB', 'PostgreSQL'] },
  { label: 'TOOLS', items: ['Git', 'Docker', 'GitHub'] },
];

export default function TechnologyDesk() {
  return (
    <section id="skills" className="pt-12">
      <div className="rule-double" />
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">TECHNOLOGY DESK</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE D1</div>
      </div>

      <h3 className="mt-2 font-headline text-3xl font-black leading-tight tracking-tight text-ink ink-print sm:text-4xl">
        A Classified List of Instruments
      </h3>

      <div className="mt-6 border-y border-ink">
        {DESK.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 items-baseline gap-2 border-b border-ink/40 py-3 last:border-b-0 md:grid-cols-12 md:gap-6"
          >
            <div className="md:col-span-3">
              <div className="font-sans text-[11px] tracking-editorial text-ink-muted">{row.label}</div>
            </div>
            <div className="md:col-span-9">
              <div className="font-serif text-[1.05rem] text-ink">
                {row.items.join('  ·  ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
