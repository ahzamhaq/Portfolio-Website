const RECORDS = [
  'Built and shipped four full-stack web applications, in use publicly.',
  'Contributed to the ICPC USICT platform as part of a small team.',
  'Ongoing self-directed work in AI, developer tooling, and applied web engineering.',
];

export default function Achievements() {
  return (
    <section id="record" className="pt-10">
      <div className="rule-thin" />
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">THE RECORD</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE D2</div>
      </div>

      <ul className="mt-3 divide-y divide-ink/40 border-y border-ink">
        {RECORDS.map((r, i) => (
          <li key={i} className="grid grid-cols-12 gap-4 py-3">
            <div className="col-span-2 font-headline text-xl font-black text-ink">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="col-span-10 font-serif text-[1rem] leading-[1.6] text-ink-soft">{r}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
