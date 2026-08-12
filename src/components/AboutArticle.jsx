export default function AboutArticle() {
  return (
    <section id="about" className="pt-12">
      <div className="rule-double" />
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">THE EDITOR&apos;S NOTE</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE A2</div>
      </div>

      <h3 className="mt-2 font-headline text-3xl font-black leading-tight tracking-tight text-ink ink-print sm:text-4xl">
        Meet the Developer
      </h3>
      <div className="mt-2 font-meta text-base italic text-ink-soft">
        A short introduction, printed here so the reader need not hunt for it.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="editorial-columns font-serif text-[1rem] leading-[1.7] text-ink-soft md:columns-2">
            <p>
              I am an undergraduate Computer Science student who spends most of his time building things — web platforms, small tools, and the occasional experiment with AI. I prefer projects that ship, over projects that only look good on a slide.
            </p>
            <p className="mt-3">
              I work most comfortably across the full stack: React and Next.js on the front, Node and Express on the back, MongoDB or PostgreSQL underneath. I have a soft spot for careful typography, honest error messages, and interfaces that respect the reader.
            </p>
            <p className="mt-3">
              Outside of code, I read, I write, and I keep an eye on how printed things — newspapers, magazines, books — hold together. This portfolio is set in that spirit.
            </p>
          </div>
        </div>

        <aside className="border-l border-ink pl-5 md:col-span-1">
          <div className="section-label">AT A GLANCE</div>
          <dl className="mt-3 space-y-2 font-serif text-sm text-ink-soft">
            <div className="flex justify-between border-b border-ink/30 pb-1">
              <dt className="font-sans tracking-editorial text-[10px] text-ink-muted">ROLE</dt>
              <dd>Software Developer</dd>
            </div>
            <div className="flex justify-between border-b border-ink/30 pb-1">
              <dt className="font-sans tracking-editorial text-[10px] text-ink-muted">STUDIES</dt>
              <dd>B.Tech, Computer Science</dd>
            </div>
            <div className="flex justify-between border-b border-ink/30 pb-1">
              <dt className="font-sans tracking-editorial text-[10px] text-ink-muted">FOCUS</dt>
              <dd>Web · AI · Tooling</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-sans tracking-editorial text-[10px] text-ink-muted">STATUS</dt>
              <dd>Open to work</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
