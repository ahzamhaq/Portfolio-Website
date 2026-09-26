import ProjectPhoto from './ProjectPhoto.jsx';
import { featuredProject as p } from '../data/projects.js';
import { ManiculeRight } from './PaperDecor.jsx';

export default function FeaturedProject() {
  return (
    <section id="work" className="scroll-mt-6 pt-8">
      <div className="border-t-[3px] border-double border-ink" />
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">{p.section}</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGE B1</div>
      </div>

      <h3 className="mt-2 font-headline text-[1.6rem] font-black uppercase leading-[1.05] tracking-[0.04em] text-ink ink-print sm:text-[2.1rem] md:text-[2.4rem]">
        {p.headline}
      </h3>
      <div className="mt-2 font-meta text-lg italic text-ink-soft">{p.title} — {p.dek}</div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <ProjectPhoto fig={p.fig} title={p.title} className="aspect-[16/10]" />
        </div>
        <div className="md:col-span-5">
          <div className="editorial-columns font-serif text-[1rem] leading-[1.7] text-ink-soft md:columns-1">
            {p.body.map((para, i) => (
              <p key={i} className={i === 0 ? 'dropcap' : 'mt-3'}>{para}</p>
            ))}
          </div>

          <div className="mt-5 border-t border-ink pt-3">
            <div className="section-label">TECHNOLOGY</div>
            <div className="mt-1 font-serif text-sm text-ink-soft">
              {p.tech.join(' · ')}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 font-sans text-xs tracking-editorial text-ink">
            <ManiculeRight className="h-3 w-6 text-ink-muted" />
            {p.links.site && (
              <a href={p.links.site} target="_blank" rel="noreferrer" className="border-b border-ink hover:text-accent-burgundy">
                READ STORY →
              </a>
            )}
            {p.links.repo && (
              <a href={p.links.repo} target="_blank" rel="noreferrer" className="border-b border-ink hover:text-accent-burgundy">
                SOURCE CODE →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
