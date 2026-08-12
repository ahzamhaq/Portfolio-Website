import { motion } from 'framer-motion';
import { Fleuron } from './PaperDecor.jsx';

export default function ClosedNewspaper({ onOpen }) {
  return (
    <motion.div
      key="closed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, #2b1a0c 0%, #120a04 70%, #08050200 100%), #0b0704',
      }}
    >
      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        <div className="section-label" style={{ color: '#8a7357' }}>SPECIAL EDITION · 2026</div>

        {/* Wrapper carries the soft realistic shadow onto the "surface" below */}
        <motion.button
          onClick={onOpen}
          aria-label="Open the newspaper"
          whileHover={{ scale: 1.012, rotate: -0.3, y: -2 }}
          whileTap={{ scale: 0.99 }}
          initial={{ y: 30, opacity: 0, rotate: -1.8 }}
          animate={{ y: 0, opacity: 1, rotate: -0.8 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="folded-paper paper-torn group relative mx-auto flex h-[520px] w-[360px] max-w-[86vw] flex-col items-center justify-between rounded-[2px] px-6 py-8 text-ink sm:h-[560px] sm:w-[420px] cursor-open"
          style={{ transformOrigin: 'center' }}
        >
          <div className="w-full">
            <div className="rule-thin w-full" />
            <div className="pt-3 text-[10px] font-sans tracking-editorial text-ink-muted">
              VOL. 01 · NO. 01 · ESTABLISHED 2026
            </div>
            <h1 className="mt-4 font-headline text-[2.15rem] font-black leading-[0.95] tracking-tight text-ink ink-print sm:text-[2.6rem]">
              THE AHZAM
              <br />
              HAQUE
            </h1>
            <div className="mt-3 rule-double w-full" />
            <div className="pt-2 font-meta text-[0.95rem] italic text-ink-soft">
              A Special Developer Edition
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="section-label">CHRONICLE</div>
            <div className="flex items-center gap-2 text-ink-muted">
              <span className="h-px w-16 bg-ink" />
              <Fleuron className="h-3 w-3" />
              <span className="h-px w-16 bg-ink" />
            </div>
            <div className="font-display text-[1.4rem] leading-tight text-ink">A · H</div>
            <div className="flex items-center gap-2 text-ink-muted">
              <span className="h-px w-16 bg-ink" />
              <Fleuron className="h-3 w-3" />
              <span className="h-px w-16 bg-ink" />
            </div>
            <div className="section-label">MMXXVI</div>
          </div>

          <div className="w-full">
            <div className="rule-thin w-full" />
            <div className="pt-3 text-[11px] font-sans tracking-editorial text-ink-muted">
              CLICK TO OPEN THE EDITION
            </div>
            <div className="hint-bob mt-2 text-ink-muted">▾</div>
          </div>
        </motion.button>

        <p className="max-w-md font-meta text-sm italic" style={{ color: '#8a7357' }}>
          A single, hand-set edition — assembled for readers who prefer their portfolios printed.
        </p>
      </div>
    </motion.div>
  );
}
