const ENTRIES = [
  {
    dates: '2025 — Present',
    role: 'Full-Stack Developer',
    org: 'Independent · Personal & Team Projects',
    text: 'Building web platforms end-to-end — AI Mock Interviewer, TaskFlow, and the ICPC portal. Front and back, shipping and iterating.',
  },
  {
    dates: '2024 — 2025',
    role: 'Contributor',
    org: 'ICPC USICT · Competitive Programming',
    text: 'Contributed to the ICPC USICT portal — authentication, contests, and platform features alongside a small team.',
  },
  {
    dates: 'Ongoing',
    role: 'Student, Computer Science',
    org: 'Undergraduate Program',
    text: 'Coursework in algorithms, systems, databases, and applied AI, paired with independent building on the side.',
  },
];

export default function ExperienceArticle() {
  return (
    <section id="experience" className="pt-12">
      <div className="rule-double" />
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">THE CAREER CHRONICLE</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE C1</div>
      </div>
      <h3 className="mt-2 font-headline text-3xl font-black leading-tight tracking-tight text-ink ink-print sm:text-4xl">
        Developing Through the Years
      </h3>

      <div className="mt-6 divide-y divide-ink/60 border-y border-ink">
        {ENTRIES.map((e) => (
          <div key={e.role + e.dates} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-2">
              <div className="font-sans text-[11px] tracking-editorial text-ink-muted">{e.dates}</div>
            </div>
            <div className="md:col-span-4">
              <div className="font-headline text-lg font-bold text-ink">{e.role}</div>
              <div className="font-meta text-base italic text-ink-soft">{e.org}</div>
            </div>
            <div className="md:col-span-6">
              <p className="font-serif text-[0.98rem] leading-[1.65] text-ink-soft">{e.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
