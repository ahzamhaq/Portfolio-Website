const DESK = [
  { label: 'LANGUAGES', items: ['C++', 'JavaScript', 'TypeScript', 'Python'] },
  { label: 'FRONTEND', items: ['React', 'Next.js', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'BACKEND', items: ['Node.js', 'Express', 'REST APIs'] },
  { label: 'DATABASE', items: ['MongoDB', 'PostgreSQL'] },
  { label: 'TOOLS', items: ['Git', 'Docker', 'GitHub'] },
];

export default function TechnologyDesk() {
  return (
    <section id="skills" className="scroll-mt-6">
      <div className="flex items-baseline justify-between font-sans text-[10px] tracking-editorial text-ink">
        <span>TECHNOLOGY DESK</span>
        <span className="text-ink-muted">PAGE D1</span>
      </div>
      <div className="mt-2 space-y-1.5 border-t border-ink pt-2">
        {DESK.map((row) => (
          <div key={row.label}>
            <div className="font-sans text-[8.5px] tracking-editorial text-ink-muted">{row.label}</div>
            <div className="font-serif text-[12.5px] leading-tight text-ink">{row.items.join(' · ')}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
