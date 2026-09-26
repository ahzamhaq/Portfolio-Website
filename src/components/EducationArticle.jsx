export default function EducationArticle() {
  return (
    <section id="education" className="scroll-mt-6">
      <div className="flex items-baseline justify-between font-sans text-[10px] tracking-editorial text-ink">
        <span>EDUCATION DESK</span>
        <span className="text-ink-muted">PAGE C2</span>
      </div>
      <div className="mt-2 space-y-3 border-t border-ink pt-2">
        <div>
          <div className="font-headline text-[13px] font-bold leading-tight text-ink">B.Tech, Computer Science</div>
          <div className="font-meta text-[12px] italic text-ink-soft">Undergraduate Program · Ongoing</div>
          <p className="mt-1 font-serif text-[12px] leading-[1.5] text-ink-soft">
            Coursework across algorithms, data structures, operating systems, databases, and applied AI, complemented by independent building.
          </p>
        </div>
        <div>
          <div className="font-headline text-[13px] font-bold leading-tight text-ink">Higher Secondary</div>
          <div className="font-meta text-[12px] italic text-ink-soft">Science Stream</div>
          <p className="mt-1 font-serif text-[12px] leading-[1.5] text-ink-soft">
            Foundations in mathematics and physics — the quiet groundwork that computing keeps asking for.
          </p>
        </div>
      </div>
    </section>
  );
}
