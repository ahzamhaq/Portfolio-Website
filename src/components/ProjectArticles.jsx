import ProjectPhoto from './ProjectPhoto.jsx';
import { projects } from '../data/projects.js';

function ProjectArticle({ p, size = 'md' }) {
  return (
    <article className="flex h-full flex-col">
      <div className="section-label">{p.section}</div>
      <h4 className={`mt-1 font-headline font-black leading-[1.02] tracking-tight text-ink ink-print ${
        size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
      }`}>
        {p.headline}
      </h4>
      <div className="mt-1 font-meta text-base italic text-ink-soft">{p.title}</div>

      <div className="mt-3">
        <ProjectPhoto fig={p.fig} title={p.title} className={size === 'lg' ? 'aspect-[16/9]' : 'aspect-[4/3]'} />
      </div>

      <p className="mt-3 font-serif text-[0.95rem] leading-[1.65] text-ink-soft">{p.dek}</p>

      <div className="mt-3 border-t border-ink pt-2">
        <div className="section-label">TECHNOLOGY</div>
        <div className="mt-1 font-serif text-sm text-ink-soft">{p.tech.join(' · ')}</div>
      </div>

      <div className="mt-auto pt-3 font-sans text-xs tracking-editorial text-ink">
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
    <section className="pt-10">
      <div className="rule-thin" />
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="section-label">FURTHER STORIES</div>
        <div className="font-sans text-[10px] tracking-editorial text-ink-muted">PAGES B2–B3</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 border-t border-ink pt-6 md:grid-cols-12 md:gap-6">
        {/* Left large column */}
        <div className="border-b border-ink pb-6 md:col-span-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <ProjectArticle p={projects[0]} size="lg" />
        </div>

        {/* Right two stacked columns */}
        <div className="grid grid-cols-1 gap-6 md:col-span-6 md:grid-cols-2 md:gap-6">
          <div className="border-b border-ink pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <ProjectArticle p={projects[1]} />
          </div>
          <div>
            <ProjectArticle p={projects[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}
