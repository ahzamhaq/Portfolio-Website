const RECORDS = [
  'Built and shipped four full-stack web applications, in use publicly.',
  'Contributed to the ICPC USICT platform as part of a small team.',
  'Ongoing self-directed work in AI, developer tooling, and applied web engineering.',
];

export default function Achievements() {
  return (
    <section id="record" className="scroll-mt-6">
      <div className="flex items-baseline justify-between font-sans text-[10px] tracking-editorial text-ink">
        <span>THE RECORD</span>
        <span className="text-ink-muted">PAGE D2</span>
      </div>
      <ul className="mt-2 divide-y divide-ink/30 border-t border-ink">
        {RECORDS.map((r, i) => (
          <li key={i} className="grid grid-cols-[2rem_1fr] items-start gap-2 py-2">
            <div className="font-headline text-2xl font-black leading-none text-ink">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="font-serif text-[12px] leading-[1.45] text-ink-soft">{r}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
