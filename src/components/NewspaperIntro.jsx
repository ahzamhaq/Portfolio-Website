import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ClosedNewspaper from './ClosedNewspaper.jsx';

export default function NewspaperIntro({ onOpened }) {
  const [phase, setPhase] = useState('closed'); // closed → opening → done

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    setTimeout(() => {
      setPhase('done');
      onOpened?.();
    }, 1500);
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 'closed' && <ClosedNewspaper key="closed" onOpen={handleOpen} />}

      {phase === 'opening' && (
        <motion.div
          key="opening"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background:
              'radial-gradient(ellipse at center, #2b1a0c 0%, #120a04 70%, #08050200 100%), #0b0704',
            perspective: '2000px',
          }}
        >
          <div
            className="relative h-[560px] w-[420px] max-w-[86vw]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Revealed page behind — fades and gently scales up */}
            <motion.div
              className="paper-surface paper-torn absolute inset-0 -z-10 rounded-[2px]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                filter:
                  'drop-shadow(0 30px 40px rgba(0,0,0,0.6)) drop-shadow(0 8px 12px rgba(0,0,0,0.45))',
              }}
            />

            {/* Two folded halves rotating outward */}
            <motion.div
              className="folded-paper paper-torn absolute inset-y-0 left-0 w-1/2 origin-right rounded-l-[2px]"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -95, x: -14 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.55))',
              }}
            />
            <motion.div
              className="folded-paper paper-torn absolute inset-y-0 right-0 w-1/2 origin-left rounded-r-[2px]"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 95, x: 14 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.55))',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
