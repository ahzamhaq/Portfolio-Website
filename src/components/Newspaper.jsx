import { motion } from 'framer-motion';
import Masthead from './Masthead.jsx';
import MainStory from './MainStory.jsx';
import AboutArticle from './AboutArticle.jsx';
import FeaturedProject from './FeaturedProject.jsx';
import ProjectArticles from './ProjectArticles.jsx';
import ExperienceArticle from './ExperienceArticle.jsx';
import EducationArticle from './EducationArticle.jsx';
import TechnologyDesk from './TechnologyDesk.jsx';
import Achievements from './Achievements.jsx';
import Contact from './Contact.jsx';
import { PaperFilterDefs, PaperOverlays } from './PaperDecor.jsx';

export default function Newspaper({ visible }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full"
    >
      <PaperFilterDefs />

      <div className="mx-auto max-w-6xl px-3 sm:px-8 lg:px-14">
        {/* Relative positioning ring — carries corner-lift shadows outside the torn mask */}
        <div className="relative my-4 sm:my-10">
          {/* Corner-lift shadows sit under the paper, outside the mask so they aren't clipped */}
          <div className="paper-corner paper-corner--tl" />
          <div className="paper-corner paper-corner--tr" />
          <div className="paper-corner paper-corner--bl" />
          <div className="paper-corner paper-corner--br" />

          {/* Drop shadow wrapper — so the torn silhouette casts a real shadow */}
          <div className="paper-shadow relative">
          <div className="paper-torn-strong">
            <div className="paper-surface paper-vignette relative overflow-hidden px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
              {/* Broad discoloration layer */}
              <div className="paper-aging" />

              {/* Decorative overlays (stains, creases, stamps) */}
              <PaperOverlays />

              {/* Actual content — sits above overlays via z-20 */}
              <div className="relative z-20">
                <Masthead />
                <MainStory />
                <AboutArticle />
                <FeaturedProject />
                <ProjectArticles />
                <ExperienceArticle />
                <EducationArticle />
                <TechnologyDesk />
                <Achievements />
                <Contact />

                <footer className="mt-10 border-t border-ink pt-3 text-center font-sans text-[10px] tracking-editorial text-ink-muted">
                  PRINTED ON THE WEB · SET IN PLAYFAIR, LORA & INTER · © {new Date().getFullYear()} AHZAM HAQUE
                </footer>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
