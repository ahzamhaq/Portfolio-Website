import { useEffect, useRef, useState } from 'react';

/**
 * Thing-inspired custom cursor for the opened newspaper.
 * - Two SVG poses (crawling + pointing) drawn to match the reference:
 *   pale skin, dark contour, visible knuckle wrinkles, stitched cut marks, no arm.
 * - Follows the real mouse position with a tiny smoothing so it feels physical.
 * - Auto-switches to pointing over <a>, <button>, [role="button"] or [data-cursor="pointer"].
 * - Hidden on touch/coarse-pointer devices.
 * - Only mounts while the newspaper is open (see App.jsx).
 */
export default function ThingCursor() {
  const el = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [pointing, setPointing] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only activate on hover-capable, fine-pointer devices
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    document.documentElement.classList.add('thing-cursor-scope');

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible) setVisible(true);

      // Determine pointing state via the element under the cursor
      const node = e.target;
      if (node && node.closest) {
        const hit = node.closest('a, button, [role="button"], [data-cursor="pointer"]');
        setPointing(!!hit);
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);

    let raf;
    const loop = () => {
      // Small smoothing — 0.25 gives a subtle drag without noticeable lag
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;
      if (el.current) {
        // The hotspot lives near the fingertip of each pose (see SVGs).
        // The pose SVGs are laid out so that (16, 6) in a 48px box is the fingertip;
        // we translate the element so that point aligns with the mouse.
        const hotspotX = 16;
        const hotspotY = 6;
        el.current.style.transform = `translate3d(${pos.current.x - hotspotX}px, ${pos.current.y - hotspotY}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('thing-cursor-scope');
    };
  }, [visible]);

  return (
    <div ref={el} className={`thing-cursor ${visible ? '' : 'is-hidden'}`} aria-hidden>
      {/* Crawling pose */}
      <div className={`thing-cursor__pose thing-cursor__crawl ${pointing ? 'is-off' : 'is-on'}`}>
        <CrawlingHand />
      </div>
      {/* Pointing pose */}
      <div className={`thing-cursor__pose thing-cursor__point ${pointing ? 'is-on' : 'is-off'}`}>
        <PointingHand />
      </div>
    </div>
  );
}

/* ---------- Hand illustrations ---------- */
/* Both drawn at 48×48. Hotspot in ThingCursor is (16, 6) — fingertip of index. */

function CrawlingHand() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinC" cx="45%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#eec9c2" />
          <stop offset="60%" stopColor="#d9a89f" />
          <stop offset="100%" stopColor="#a8776f" />
        </radialGradient>
      </defs>

      {/* Hand palm + spread fingers, seen from above, as if crawling.
          Index finger extends up-left toward the fingertip hotspot (16, 6). */}
      <g stroke="#1a1210" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" fill="url(#skinC)">
        {/* Palm mass */}
        <path d="M12 22
                 C 10 26, 12 34, 18 38
                 C 26 42, 36 40, 40 34
                 C 44 28, 42 22, 36 20
                 C 30 18, 22 18, 18 19
                 C 14 20, 13 21, 12 22 Z" />
        {/* Index finger — the leading finger that touches the hotspot */}
        <path d="M18 20
                 C 17 15, 16.5 10, 16 6
                 C 15.8 5, 17.2 5, 17.4 6
                 C 18 10, 19 15, 20 20 Z" />
        {/* Middle finger */}
        <path d="M24 18
                 C 24 13, 24.5 9, 25 8
                 C 25.2 7.3, 26.6 7.3, 26.6 8
                 C 26.8 12, 27 16, 27 20 Z" />
        {/* Ring finger */}
        <path d="M30 18
                 C 31 14, 32 11, 33 10
                 C 33.4 9.4, 34.6 10, 34.4 10.6
                 C 33.8 14, 33 17, 32.5 20 Z" />
        {/* Little finger */}
        <path d="M35 20
                 C 36.5 17, 38 15, 39 15
                 C 39.6 15, 40 15.8, 39.6 16.4
                 C 38 19, 37 21, 36.5 22 Z" />
        {/* Thumb tucked under, right side */}
        <path d="M40 26
                 C 43 26, 45 28, 45 31
                 C 45 33, 43 34, 41 33
                 C 39 32, 38 30, 40 26 Z" />
      </g>

      {/* Knuckle wrinkles */}
      <g stroke="#1a1210" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M17 21 q0.7 -0.6 1.6 0" />
        <path d="M24 20 q0.8 -0.6 1.6 0" />
        <path d="M31 21 q0.8 -0.6 1.6 0" />
        <path d="M36 22 q0.8 -0.6 1.6 0" />
        {/* Palm creases */}
        <path d="M20 30 q4 -2 8 0" />
        <path d="M22 33 q4 2 8 0" opacity="0.6" />
      </g>

      {/* Stitched cut marks — the signature Thing detail */}
      <g stroke="#1a1210" strokeWidth="0.9" strokeLinecap="round" fill="none">
        {/* Stitch scar across the wrist stump (bottom edge) */}
        <path d="M16 39 L36 39" />
        <g strokeWidth="0.7">
          <path d="M18 38 L18 40" />
          <path d="M21 38 L21 40" />
          <path d="M24 38 L24 40" />
          <path d="M27 38 L27 40" />
          <path d="M30 38 L30 40" />
          <path d="M33 38 L33 40" />
        </g>
        {/* Diagonal stitched scar across the palm */}
        <path d="M22 24 L34 34" opacity="0.85" />
        <g strokeWidth="0.7" opacity="0.85">
          <path d="M23.5 23 L22.5 25" />
          <path d="M26 25.5 L25 27.5" />
          <path d="M28.5 28 L27.5 30" />
          <path d="M31 30.5 L30 32.5" />
          <path d="M33.5 33 L32.5 35" />
        </g>
        {/* Small stitch on the index finger */}
        <path d="M17.4 13 L18.6 13" />
        <path d="M17.8 12.2 L17.8 13.8" strokeWidth="0.6" />
        <path d="M18.2 12.2 L18.2 13.8" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

function PointingHand() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skinP" cx="45%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#eec9c2" />
          <stop offset="60%" stopColor="#d9a89f" />
          <stop offset="100%" stopColor="#a8776f" />
        </radialGradient>
      </defs>

      {/* Pointing hand — index finger extended up, others curled.
          Fingertip is at (16, 6), matching the shared hotspot. */}
      <g stroke="#1a1210" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" fill="url(#skinP)">
        {/* Palm / fist */}
        <path d="M12 24
                 C 10 30, 12 38, 18 40
                 C 26 42, 34 40, 36 34
                 C 38 28, 36 22, 30 20
                 C 24 19, 18 19, 15 21
                 C 13 22, 12 23, 12 24 Z" />
        {/* Index finger extended straight up-slight-left to fingertip (16, 6) */}
        <path d="M17 22
                 L 15.2 6
                 C 15.1 5, 17.4 5, 17.6 6
                 L 19 22 Z" />
        {/* Curled middle finger */}
        <path d="M20 22
                 C 22 18, 26 18, 26 22
                 C 26 25, 22 25, 20 24 Z" />
        {/* Curled ring finger */}
        <path d="M24 24
                 C 27 21, 32 22, 31 26
                 C 30 29, 26 29, 24 27 Z" />
        {/* Curled little finger */}
        <path d="M28 28
                 C 31 26, 35 27, 33 30
                 C 32 32, 29 32, 28 30 Z" />
        {/* Thumb wrapped across */}
        <path d="M14 28
                 C 12 30, 12 34, 16 34
                 C 20 34, 22 31, 20 28 Z" />
      </g>

      {/* Knuckle wrinkles + palm creases */}
      <g stroke="#1a1210" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M15.6 10 q0.9 -0.5 1.8 0" />
        <path d="M15.8 15 q0.9 -0.5 1.7 0" />
        <path d="M22 22 q1.2 -0.6 2.3 0" />
        <path d="M26 25 q1.2 -0.6 2.2 0" />
        <path d="M18 32 q5 -2 10 0" opacity="0.7" />
      </g>

      {/* Stitched cut marks */}
      <g stroke="#1a1210" strokeWidth="0.9" strokeLinecap="round" fill="none">
        {/* Wrist stump stitch (bottom) */}
        <path d="M15 40 L34 40" />
        <g strokeWidth="0.7">
          <path d="M17 39 L17 41" />
          <path d="M20 39 L20 41" />
          <path d="M23 39 L23 41" />
          <path d="M26 39 L26 41" />
          <path d="M29 39 L29 41" />
          <path d="M32 39 L32 41" />
        </g>
        {/* Diagonal palm scar */}
        <path d="M18 28 L30 34" opacity="0.85" />
        <g strokeWidth="0.7" opacity="0.85">
          <path d="M19.5 27 L18.5 29" />
          <path d="M22 28.5 L21 30.5" />
          <path d="M24.5 30 L23.5 32" />
          <path d="M27 31.5 L26 33.5" />
        </g>
        {/* Small stitch near the base of the index finger */}
        <path d="M15.8 20 L18.2 20" />
        <path d="M16.4 19.2 L16.4 20.8" strokeWidth="0.6" />
        <path d="M17.6 19.2 L17.6 20.8" strokeWidth="0.6" />
      </g>
    </svg>
  );
}
