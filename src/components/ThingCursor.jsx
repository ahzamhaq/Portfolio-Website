import { useEffect, useRef } from 'react';

// ── Asset lists ──────────────────────────────────────────────────────────────

const IDLE_FRAMES = ['/idle_01.png', '/idle_02.png', '/idle_03.png'];
const CRAWL1_FRAMES = [
  '/crawl1_01.png', '/crawl1_02.png', '/crawl1_03.png',
  '/crawl1_04.png', '/crawl1_05.png', '/crawl1_06.png',
];
const CRAWL2_FRAMES = [
  '/crawl2_01.png', '/crawl2_02.png', '/crawl2_03.png',
  '/crawl2_04.png', '/crawl2_05.png', '/crawl2_06.png',
];
const TURN_FRAMES = [
  '/turn_01.png', '/turn_02.png', '/turn_03.png', '/turn_04.png',
  '/turn_05.png', '/turn_06.png', '/turn_07.png',
];
const SETTLE_FRAMES = [
  '/settle_01.png', '/settle_02.png', '/settle_03.png', '/settle_04.png',
];
const POINT_FRAME = '/pointing_01.png';

const ALL_ASSETS = [
  ...IDLE_FRAMES, ...CRAWL1_FRAMES, ...CRAWL2_FRAMES,
  ...TURN_FRAMES, ...SETTLE_FRAMES, POINT_FRAME,
];

// ── Layout ───────────────────────────────────────────────────────────────────

const SIZE = 40;
const CRAWL_HOTSPOT = { x: 0.5, y: 0.15 };
const POINT_HOTSPOT = { x: 0.5, y: 0.05 };

// ── Physics ──────────────────────────────────────────────────────────────────

const MAX_SPEED = 700;          // px/s
const STEER_RATE = 6;           // velocity lerp rate — lower = more crawl lag
const ARRIVE_RADIUS = 90;       // px: start decelerating inside this radius
const ARRIVE_THRESHOLD = 4;     // px: hard-snap Thing to target when this close
const MOUSE_THRESHOLD = 1.5;    // px: ignore mouse movements smaller than this

// ── Rotation ─────────────────────────────────────────────────────────────────
//
// The crawl images (e.g. crawl1_03) have fingers pointing roughly straight
// downward at natural (0 °) orientation. Standard Math.atan2(vy, vx) gives 0
// for rightward motion, so we need −π/2 to make "right motion → fingers right".
//
// Verify:
//   moving RIGHT  (vy=0, vx=1): atan2(0,1) − π/2 = −π/2 → 90° CCW from natural ✓
//   moving DOWN   (vy=1, vx=0): atan2(1,0) − π/2 =  0   → natural pose       ✓
//   moving LEFT   (vy=0, vx=−1): atan2(0,−1) − π/2 = π/2 → 90° CW           ✓
//   moving UP     (vy=−1, vx=0): atan2(−1,0) − π/2 = −π  → flipped up        ✓
//
const BASE_ROT_OFFSET = -Math.PI / 2;
const ROT_SMOOTH = 10;      // rad/s convergence rate
const ROT_MIN_SPEED = 30;   // px/s: freeze rotation below this speed

// ── State machine ────────────────────────────────────────────────────────────

const S = {
  IDLE: 'IDLE',
  CRAWLING: 'CRAWLING',
  TURNING: 'TURNING',
  SETTLING: 'SETTLING',
  POINTING: 'POINTING',
};

const IDLE_FRAME_MS = 520;
const SETTLE_FRAME_MS = 70;
const TURN_FRAME_MS = 40;
const CRAWL_MS_SLOW = 140;
const CRAWL_MS_FAST = 40;
const CRAWL_SPEED_MAX = 500;     // px/s: speed at which crawl hits max FPS

const MOUSE_STOP_MS = 100;       // ms idle before mouse is "stopped"
const TURN_ANGLE_RAD = 1.2;      // ~70° sudden direction change triggers turn
const TURN_MIN_SPEED = 200;      // px/s: don't trigger turn at low speed

// ── Component ────────────────────────────────────────────────────────────────

export default function ThingCursor() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    // Preload every asset once; hold references so the browser cache keeps them.
    const preloaded = ALL_ASSETS.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    document.documentElement.classList.add('thing-cursor-scope');

    // ── Mutable animation state — NO React setState, zero re-renders ─────────

    // Real mouse position — updated immediately on every mousemove
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let lastMoveAt = 0;   // 0 = mouse hasn't moved yet this session

    // Thing's animated position + velocity
    let thingX = mouseX;
    let thingY = mouseY;
    let velX = 0;
    let velY = 0;

    // Rotation
    let rot = 0;
    let rotTarget = 0;

    // State machine
    let state = S.IDLE;
    let pointing = false;

    // Per-state animation accumulators
    let stateFrameIdx = 0;
    let stateFrameAccum = 0;
    let crawlCycle = 0;
    let crawlIdx = 0;
    let crawlAccum = 0;

    // Direction memory for turn detection
    let lastDir = null;

    let currentSrc = '';
    let lastT = 0;
    let raf = null;
    let loopRunning = false;
    let idleTimer = null;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const setSrc = (src) => {
      if (src !== currentSrc && imgRef.current) {
        imgRef.current.src = src;
        currentSrc = src;
      }
    };

    const enterState = (next) => {
      if (state === next) return;
      state = next;
      stateFrameIdx = 0;
      stateFrameAccum = 0;
    };

    const startLoop = () => {
      if (loopRunning) return;
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      loopRunning = true;
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // ── Mouse event listeners ─────────────────────────────────────────────────

    const onMove = (e) => {
      const nx = e.clientX;
      const ny = e.clientY;

      // ── Target indicator: REAL-TIME, no RAF, no smoothing ────────────────
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${nx}px,${ny}px,0)`;
        dotRef.current.classList.remove('is-hidden');
      }
      if (rootRef.current) rootRef.current.classList.remove('is-hidden');

      // ── Physics target: only update when mouse actually moved ────────────
      const moved = Math.hypot(nx - prevMouseX, ny - prevMouseY);
      if (moved >= MOUSE_THRESHOLD) {
        mouseX = nx;
        mouseY = ny;
        prevMouseX = nx;
        prevMouseY = ny;
        lastMoveAt = performance.now();
        startLoop();
      }

      // ── Pointing detection ───────────────────────────────────────────────
      const hit = e.target?.closest?.(
        'a,button,[role="button"],input[type="submit"],input[type="button"],[data-cursor="pointer"]'
      );
      const nowPointing = !!hit;
      if (nowPointing !== pointing) {
        pointing = nowPointing;
        enterState(pointing ? S.POINTING : S.CRAWLING);
        startLoop();
      }
    };

    const onLeave = () => {
      if (rootRef.current) rootRef.current.classList.add('is-hidden');
      if (dotRef.current) dotRef.current.classList.add('is-hidden');
    };

    const onEnter = () => {
      if (rootRef.current) rootRef.current.classList.remove('is-hidden');
      if (dotRef.current) dotRef.current.classList.remove('is-hidden');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);

    // ── Main animation loop ───────────────────────────────────────────────────

    const tick = (now) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const mouseStopped = (now - lastMoveAt) > MOUSE_STOP_MS;
      const dx = mouseX - thingX;
      const dy = mouseY - thingY;
      const dist = Math.hypot(dx, dy);

      // ── Physics ──────────────────────────────────────────────────────────

      if (pointing) {
        // Pointing: snap directly to real mouse position — no lag
        thingX = mouseX;
        thingY = mouseY;
        velX = 0;
        velY = 0;
      } else if (dist <= ARRIVE_THRESHOLD) {
        // Arrived: hard snap, stop all movement — prevents oscillation
        thingX = mouseX;
        thingY = mouseY;
        velX = 0;
        velY = 0;
      } else {
        // Chase: accelerate toward target, decelerate in ARRIVE_RADIUS
        const nx = dx / dist;
        const ny = dy / dist;
        const arriveFactor = Math.min(1, dist / ARRIVE_RADIUS);
        const desiredVx = nx * MAX_SPEED * arriveFactor;
        const desiredVy = ny * MAX_SPEED * arriveFactor;

        const alpha = Math.min(1, STEER_RATE * dt);
        velX += (desiredVx - velX) * alpha;
        velY += (desiredVy - velY) * alpha;

        const sp = Math.hypot(velX, velY);
        if (sp > MAX_SPEED) {
          velX = (velX / sp) * MAX_SPEED;
          velY = (velY / sp) * MAX_SPEED;
        }

        thingX += velX * dt;
        thingY += velY * dt;
      }

      const speed = Math.hypot(velX, velY);
      const arrived = dist <= ARRIVE_THRESHOLD;

      // ── State machine ─────────────────────────────────────────────────────

      if (!pointing) {
        if (speed > TURN_MIN_SPEED) {
          const nx = velX / speed;
          const ny = velY / speed;
          if (lastDir) {
            const dot = Math.max(-1, Math.min(1, lastDir.x * nx + lastDir.y * ny));
            if (Math.acos(dot) > TURN_ANGLE_RAD && (state === S.CRAWLING || state === S.IDLE)) {
              enterState(S.TURNING);
            }
          }
          lastDir = { x: nx, y: ny };
        }

        switch (state) {
          case S.IDLE:
            if (!mouseStopped || !arrived) enterState(S.CRAWLING);
            break;
          case S.CRAWLING:
            if (mouseStopped && arrived) enterState(S.SETTLING);
            break;
          default:
            break;
        }
      }

      // ── Frame selection ───────────────────────────────────────────────────

      let src = currentSrc;

      if (state === S.POINTING) {
        src = POINT_FRAME;

      } else if (state === S.IDLE) {
        stateFrameAccum += dt * 1000;
        if (stateFrameAccum >= IDLE_FRAME_MS) {
          stateFrameAccum -= IDLE_FRAME_MS;
          stateFrameIdx = (stateFrameIdx + 1) % IDLE_FRAMES.length;
        }
        src = IDLE_FRAMES[stateFrameIdx];

      } else if (state === S.SETTLING) {
        stateFrameAccum += dt * 1000;
        if (stateFrameAccum >= SETTLE_FRAME_MS) {
          stateFrameAccum -= SETTLE_FRAME_MS;
          if (stateFrameIdx < SETTLE_FRAMES.length - 1) {
            stateFrameIdx++;
          } else {
            enterState(S.IDLE);
          }
        }
        src = SETTLE_FRAMES[Math.min(stateFrameIdx, SETTLE_FRAMES.length - 1)];

      } else if (state === S.TURNING) {
        stateFrameAccum += dt * 1000;
        if (stateFrameAccum >= TURN_FRAME_MS) {
          stateFrameAccum -= TURN_FRAME_MS;
          if (stateFrameIdx < TURN_FRAMES.length - 1) {
            stateFrameIdx++;
          } else {
            crawlCycle = 1 - crawlCycle;
            crawlIdx = 0;
            crawlAccum = 0;
            enterState(S.CRAWLING);
          }
        }
        src = TURN_FRAMES[Math.min(stateFrameIdx, TURN_FRAMES.length - 1)];

      } else if (state === S.CRAWLING) {
        const t = Math.min(1, speed / CRAWL_SPEED_MAX);
        const frameMs = CRAWL_MS_SLOW + (CRAWL_MS_FAST - CRAWL_MS_SLOW) * t;
        crawlAccum += dt * 1000;
        while (crawlAccum >= frameMs) {
          crawlAccum -= frameMs;
          crawlIdx++;
          const frames = crawlCycle === 0 ? CRAWL1_FRAMES : CRAWL2_FRAMES;
          if (crawlIdx >= frames.length) {
            crawlIdx = 0;
            crawlCycle = 1 - crawlCycle;
          }
        }
        src = (crawlCycle === 0 ? CRAWL1_FRAMES : CRAWL2_FRAMES)[crawlIdx];
      }

      setSrc(src);

      // ── Rotation ──────────────────────────────────────────────────────────

      // Only recalculate when Thing is actually moving (prevents jitter while stationary)
      if (!pointing && !arrived && speed > ROT_MIN_SPEED) {
        rotTarget = Math.atan2(velY, velX) + BASE_ROT_OFFSET;
      }

      let rotDelta = rotTarget - rot;
      while (rotDelta > Math.PI) rotDelta -= Math.PI * 2;
      while (rotDelta < -Math.PI) rotDelta += Math.PI * 2;
      rot += rotDelta * Math.min(1, ROT_SMOOTH * dt);

      // ── DOM update ────────────────────────────────────────────────────────

      if (rootRef.current) {
        const h = (state === S.POINTING) ? POINT_HOTSPOT : CRAWL_HOTSPOT;
        const useRot = (state === S.POINTING) ? 0 : rot;
        rootRef.current.style.transform =
          `translate3d(${thingX}px,${thingY}px,0) ` +
          `rotate(${useRot}rad) ` +
          `translate(${-SIZE * h.x}px,${-SIZE * h.y}px)`;
      }

      // ── Loop continuation ─────────────────────────────────────────────────
      //
      // Stop the RAF when nothing is animating:
      //   • mouse hasn't moved
      //   • Thing has arrived at target
      //   • state is stable (IDLE or POINTING)
      //   • rotation has converged
      //
      // The loop restarts automatically on the next mousemove. For IDLE state
      // the next idle frame is scheduled via setTimeout so breathing continues.

      const rotSettled = Math.abs(rotDelta) < 0.002;
      const canRest =
        mouseStopped && arrived && rotSettled &&
        (state === S.IDLE || state === S.POINTING);

      if (canRest) {
        loopRunning = false;
        raf = null;
        if (state === S.IDLE) {
          const msUntilNext = IDLE_FRAME_MS - stateFrameAccum;
          idleTimer = setTimeout(() => {
            idleTimer = null;
            if (!loopRunning) startLoop();
          }, msUntilNext);
        }
        // POINTING: no timer needed — loop restarts on next mousemove
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    // ── Cleanup ───────────────────────────────────────────────────────────────

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      if (raf !== null) cancelAnimationFrame(raf);
      if (idleTimer !== null) clearTimeout(idleTimer);
      loopRunning = false;
      document.documentElement.classList.remove('thing-cursor-scope');
      preloaded.length = 0;
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="thing-cursor is-hidden" aria-hidden>
        <img
          ref={imgRef}
          alt=""
          draggable={false}
          width={SIZE}
          height={SIZE}
          className="thing-cursor__img"
        />
      </div>
      <div ref={dotRef} className="thing-cursor-dot is-hidden" aria-hidden />
    </>
  );
}
