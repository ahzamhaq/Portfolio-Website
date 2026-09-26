import ExperienceArticle from './ExperienceArticle.jsx';
import EducationArticle from './EducationArticle.jsx';
import TechnologyDesk from './TechnologyDesk.jsx';
import Achievements from './Achievements.jsx';

export default function RecordBand() {
  return (
    <section className="mt-8 border-t-[3px] border-double border-ink pt-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ink/60">
        <div className="lg:pr-4"><ExperienceArticle /></div>
        <div className="lg:px-4"><EducationArticle /></div>
        <div className="lg:px-4"><TechnologyDesk /></div>
        <div className="lg:pl-4"><Achievements /></div>
      </div>
    </section>
  );
}
