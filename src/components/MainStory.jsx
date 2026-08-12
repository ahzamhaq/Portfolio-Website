import Portrait from './Portrait.jsx';

export default function MainStory() {
  return (
    <section className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-12 md:gap-8 md:pt-10">
      {/* Left column — the story */}
      <div className="md:col-span-8">
        <div className="section-label">LEAD STORY</div>
        <h2 className="mt-2 font-headline text-[2.4rem] font-black leading-[0.95] tracking-tight text-ink ink-print sm:text-[3.4rem] md:text-[4.2rem]">
          Building things
          <br />
          for the digital world.
        </h2>
        <div className="mt-4 flex items-center gap-3 font-sans text-[11px] tracking-editorial text-ink-muted">
          <span>BY THE EDITOR</span>
          <span className="h-px flex-1 bg-ink-muted/40" />
          <span>FILED FROM THE WEB</span>
        </div>

        <div className="editorial-columns mt-6 font-serif text-[1.02rem] leading-[1.65] text-ink-soft md:columns-2">
          <p className="dropcap">
            Ahzam Haque is a Computer Science student and software developer building web applications, developer tools, and small AI-adjacent experiments. He works in the space where careful engineering meets useful, everyday products.
          </p>
          <p className="mt-4">
            His current interests include full-stack web systems, thoughtful interfaces, and applied machine intelligence — often, all three colliding in the same project.
          </p>
          <p className="mt-4">
            This edition serves as a working portfolio: a record of what has been built, what is being learnt, and what is being attempted next.
          </p>
        </div>
      </div>

      {/* Right column — the portrait */}
      <aside className="md:col-span-4">
        <Portrait caption="FIG. 00 — THE DEVELOPER, IN RESIDENCE" />
        <div className="mt-3 border-t border-ink pt-2 font-meta text-sm italic text-ink-soft">
          “Ship something small, honestly, on a weekday.”
        </div>
      </aside>
    </section>
  );
}
