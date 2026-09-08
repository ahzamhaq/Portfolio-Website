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
        <div className="newspaper-stack" style={{ position: 'relative', isolation: 'isolate' }}>

          {/* SHEET C — farthest back. Offset right+down, rotated slightly clockwise.
              Colour slightly darker/more aged than front sheet.
              Peeking out from right edge and bottom edge of main sheet.
              Has its own subtle clip-path for a mildly irregular (not dramatically torn) perimeter. */}
          <div className="sheet sheet-c" aria-hidden />

          {/* SHEET B — middle sheet. Offset left+down, rotated slightly counter-clockwise.
              Colour slightly lighter/warmer than Sheet C.
              Peeks out from left edge and bottom.
              Has its own subtle clip-path. */}
          <div className="sheet sheet-b" aria-hidden />

          {/* SHEET A — front sheet. The main newspaper. NO clip-path, NO torn edges.
              Sits flat on top. All content lives here. */}
          <div className="sheet sheet-a">
            {/* subtle edge darkening overlay — stays inside, rendered as box-shadow */}
            <div className="sheet-edge-aging" aria-hidden />
            <div className="paper-surface paper-vignette relative overflow-hidden px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
              <div className="paper-aging" />
              <PaperOverlays />
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
    </motion.main>
  );
}
