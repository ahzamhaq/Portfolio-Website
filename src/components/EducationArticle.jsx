export default function EducationArticle() {
  return (
    <section id="education" className="pt-10">
      <div className="rule-thin" />
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">EDUCATION DESK</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE C2</div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-6 border-t border-ink pt-4 md:grid-cols-2">
        <div>
          <div className="font-headline text-xl font-bold text-ink">B.Tech, Computer Science</div>
          <div className="font-meta text-base italic text-ink-soft">Undergraduate Program · Ongoing</div>
          <p className="mt-2 font-serif text-[0.95rem] leading-[1.65] text-ink-soft">
            Coursework across algorithms, data structures, operating systems, databases, and applied AI, complemented by independent building.
          </p>
        </div>
        <div>
          <div className="font-headline text-xl font-bold text-ink">Higher Secondary</div>
          <div className="font-meta text-base italic text-ink-soft">Science Stream</div>
          <p className="mt-2 font-serif text-[0.95rem] leading-[1.65] text-ink-soft">
            Foundations in mathematics and physics — the quiet groundwork that computing keeps asking for.
          </p>
        </div>
      </div>
    </section>
  );
}
