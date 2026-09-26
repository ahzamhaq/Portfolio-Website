import ProjectPhoto from './ProjectPhoto.jsx';
import { projects } from '../data/projects.js';
import { Monogram } from './Masthead.jsx';

const GLANCE = [
  ['ROLE', 'Software Developer'],
  ['STUDIES', 'B.Tech, Computer Science'],
  ['FOCUS', 'Web · AI · Tooling'],
  ['STATUS', 'Open to work'],
];

function ProjectArticle({ p }) {
  return (
    <article className="flex h-full flex-col">
      <h4 className="font-headline text-[1.05rem] font-black uppercase leading-[1.08] tracking-[0.02em] text-ink ink-print">
        {p.headline}
      </h4>
      <div className="mt-1 font-meta text-[14px] italic text-ink-soft">{p.title}</div>

      <div className="mt-2">
        <ProjectPhoto fig={p.fig} title={p.title} className="aspect-[16/10]" />
      </div>

      <p className="mt-2 font-serif text-[12px] leading-[1.5] text-ink-soft">{p.dek}</p>

      <div className="mt-2 font-sans text-[10px] tracking-[0.04em] text-ink">
        <span className="text-ink-muted">TECH:</span> {p.tech.join(' · ')}
      </div>

      <div className="mt-auto pt-2 font-sans text-[10px] tracking-editorial text-ink">
        {p.links.site && (
          <a href={p.links.site} target="_blank" rel="noreferrer" className="border-b border-ink hover:text-accent-burgundy">
            READ STORY →
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectArticles() {
  return (
    <section className="mt-8">
      <div className="border-t-[3px] border-double border-ink pt-3">
        <div className="flex items-baseline justify-between font-sans text-[10px] tracking-editorial text-ink">
          <span>FURTHER STORIES</span>
          <span className="text-ink-muted">PAGES B2–B3</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-6 border-t border-ink pt-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ink/60">
        {projects.map((p, i) => (
          <div key={p.slug} className={i === 0 ? 'lg:pr-4' : 'lg:px-4'}>
            <ProjectArticle p={p} />
          </div>
        ))}

        <aside className="flex flex-col lg:pl-4">
          <div className="font-sans text-[10px] tracking-editorial text-ink">AT A GLANCE</div>
          <dl className="mt-2 border-t border-ink/60">
            {GLANCE.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[4.2rem_1fr] items-baseline gap-2 border-b border-ink/30 py-2">
                <dt className="font-sans text-[9px] tracking-editorial text-ink-muted">{k}</dt>
                <dd className="font-serif text-[13px] leading-tight text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex justify-center pt-6 text-ink">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-ink/60 font-display">
              <Monogram className="h-12 w-16 text-4xl" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
