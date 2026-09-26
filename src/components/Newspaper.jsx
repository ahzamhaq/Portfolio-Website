import { motion } from 'framer-motion';
import Masthead from './Masthead.jsx';
import MainStory from './MainStory.jsx';
import FeaturedProject from './FeaturedProject.jsx';
import ProjectArticles from './ProjectArticles.jsx';
import RecordBand from './RecordBand.jsx';
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
          <div className="sheet sheet-c" aria-hidden />
          <div className="sheet sheet-b" aria-hidden />

          <div className="sheet sheet-a">
            <div className="sheet-edge-aging" aria-hidden />
            <div className="paper-surface paper-vignette relative overflow-hidden px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
              <div className="paper-aging" />
              <PaperOverlays />
              <div className="paper-edge-layer paper-edge-layer--top" aria-hidden />
              <div className="paper-edge-layer paper-edge-layer--bottom" aria-hidden />
              <div className="paper-edge-layer paper-edge-layer--left" aria-hidden />
              <div className="paper-edge-layer paper-edge-layer--right" aria-hidden />

              <div className="relative z-20">
                <Masthead />
                <MainStory />
                <FeaturedProject />
                <ProjectArticles />
                <RecordBand />
                <Contact />

                <div className="pointer-events-none mt-6 flex justify-start">
                  <div className="stamp-round">
                    PRINTED<br />ON THE WEB<br />WITH CARE
                  </div>
                </div>
              </div>
            </div>
            <a href="#contact" className="index-tab" aria-label="Jump to index">
              <span>INDEX</span>
            </a>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
