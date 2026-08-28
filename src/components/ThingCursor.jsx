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

const SIZE = 48;
const CRAWL_HOTSPOT = { x: 0.5, y: 0.15 };
const POINT_HOTSPOT = { x: 0.5, y: 0.05 };

// ── Physics ──────────────────────────────────────────────────────────────────

const MAX_SPEED = 680;          // px/s — keep responsive
const STEER_RATE = 8;           // velocity steering rate
const ARRIVE_RADIUS = 80;       // px: start decelerating inside this radius
const ARRIVE_THRESHOLD = 6;     // px: hard-snap when this close; prevents micro-jitter
const MOUSE_THRESHOLD = 1.5;    // px: ignore mouse movements smaller than this
// Per-frame displacement cap. At 60 fps, MAX_SPEED 680 → 680/60 ≈ 11 px/frame.
// At 30 fps (dt=0.033), 680×0.033 ≈ 22 px. Setting 22 px lets normal motion
// through at any refresh rate while capping actual spikes from GC pauses or
// compositor stalls. Previous value of 40 was above the normal maximum and
// therefore never fired — this value is intentionally just above normal max.
const MAX_FRAME_DIST = 22;      // px/frame hard cap

// ── Rotation ─────────────────────────────────────────────────────────────────
//
// The crawl images have fingers pointing roughly straight downward at 0°.
// Standard Math.atan2(vy, vx) gives 0 for rightward motion, so −π/2 aligns:
//   moving RIGHT  → atan2(0,1)  − π/2 = −π/2 → 90° CCW (fingers right)  ✓
//   moving DOWN   → atan2(1,0)  − π/2 =  0   → natural downward pose     ✓
//   moving LEFT   → atan2(0,−1) − π/2 =  π/2 → 90° CW                   ✓
//   moving UP     → atan2(−1,0) − π/2 = −π   → flipped up               ✓
//
const BASE_ROT_OFFSET = -Math.PI / 2;
const ROT_SMOOTH = 12;      // rad/s convergence rate (slightly snappier)
const ROT_MIN_SPEED = 25;   // px/s: freeze rotation below this speed

// Resting angle: fingers point downward (natural) = 0 rad.
// We snap to this on SETTLING so the final pose is always consistent.
const ROT_REST = 0;

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
const TURN_FRAME_MS = 45;
const CRAWL_MS_SLOW = 130;
const CRAWL_MS_FAST = 38;
const CRAWL_SPEED_MAX = 480;     // px/s: speed at which crawl hits max FPS

const MOUSE_STOP_MS = 120;       // ms idle before mouse is "stopped"
const TURN_ANGLE_RAD = 1.3;      // ~75° sudden direction change triggers turn
const TURN_MIN_SPEED = 220;      // px/s: don't trigger turn at low speed
// Minimum ms between successive TURNING entries — prevents rapid re-triggering
// during jitter or very fast back-and-forth mouse movement.
const TURN_COOLDOWN_MS = 220;

// ── Component ────────────────────────────────────────────────────────────────

export default function ThingCursor() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    // Preload every asset; holding references keeps the browser cache warm.
    const preloaded = ALL_ASSETS.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    document.documentElement.classList.add('thing-cursor-scope');

    // ── Mutable animation state — NO React setState, zero re-renders ─────────

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let lastMoveAt = 0;

    let thingX = mouseX;
    let thingY = mouseY;
    let velX = 0;
    let velY = 0;

    let rot = 0;
    let rotTarget = ROT_REST;

    let state = S.IDLE;
    let pointing = false;

    let stateFrameIdx = 0;
    let stateFrameAccum = 0;
    let crawlCycle = 0;
    let crawlIdx = 0;
    let crawlAccum = 0;

    // Direction memory for turn detection — reused to avoid per-frame allocation
    const lastDir = { x: 0, y: 0, set: false };
    // Timestamp of last TURNING entry — for cooldown
    let lastTurnAt = -Infinity;
    // When settling starts, we lock the rotTarget to ROT_REST so it's consistent.
    let settleStarted = false;

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

    const enterState = (next, now) => {
      if (state === next) return;

      // On SETTLING entry: lock rotTarget to natural resting angle so the
      // final idle pose is always consistent, never random/upside-down.
      if (next === S.SETTLING) {
        rotTarget = ROT_REST;
        settleStarted = true;
      }
      if (next === S.TURNING) {
        lastTurnAt = now ?? performance.now();
      }

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

      // Target indicator: REAL-TIME, no RAF, no smoothing
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${nx}px,${ny}px,0)`;
        dotRef.current.classList.remove('is-hidden');
      }
      if (rootRef.current) rootRef.current.classList.remove('is-hidden');

      // Physics target: only update when mouse actually moved
      const moved = Math.hypot(nx - prevMouseX, ny - prevMouseY);
      if (moved >= MOUSE_THRESHOLD) {
        mouseX = nx;
        mouseY = ny;
        prevMouseX = nx;
        prevMouseY = ny;
        lastMoveAt = performance.now();
        startLoop();
      }

      // Pointing detection
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
      // Clamp dt tightly — a single large spike (e.g. tab-switch, GC pause)
      // would otherwise let Thing jump a huge distance in one frame.
      const rawDt = (now - lastT) / 1000;
      const dt = Math.min(rawDt, 0.033);   // cap at ~30fps equivalent (~33ms)
      lastT = now;

      const mouseStopped = (now - lastMoveAt) > MOUSE_STOP_MS;
      const dx = mouseX - thingX;
      const dy = mouseY - thingY;
      const dist = Math.hypot(dx, dy);

      // ── Physics ──────────────────────────────────────────────────────────

      if (pointing) {
        // POINTING: snap directly to real mouse — no lag
        thingX = mouseX;
        thingY = mouseY;
        velX = 0;
        velY = 0;
      } else if (dist <= ARRIVE_THRESHOLD) {
        // Arrived: hard-snap, kill velocity — prevents any oscillation
        thingX = mouseX;
        thingY = mouseY;
        velX = 0;
        velY = 0;
      } else {
        // Chase: steer velocity toward target, decelerate in ARRIVE_RADIUS
        const invDist = 1 / dist;
        const nx = dx * invDist;
        const ny = dy * invDist;
        const arriveFactor = Math.min(1, dist / ARRIVE_RADIUS);
        const desiredVx = nx * MAX_SPEED * arriveFactor;
        const desiredVy = ny * MAX_SPEED * arriveFactor;

        const alpha = Math.min(1, STEER_RATE * dt);
        velX += (desiredVx - velX) * alpha;
        velY += (desiredVy - velY) * alpha;

        const sp = Math.hypot(velX, velY);
        if (sp > MAX_SPEED) {
          const inv = MAX_SPEED / sp;
          velX *= inv;
          velY *= inv;
        }

        // Compute raw displacement for this frame
        let moveX = velX * dt;
        let moveY = velY * dt;

        // Per-frame distance cap: Thing cannot move more than MAX_FRAME_DIST px
        // in a single tick. This prevents visible teleporting when dt spikes
        // (e.g. after a tab switch or GC pause) even though dt is already clamped.
        const moveDist = Math.hypot(moveX, moveY);
        if (moveDist > MAX_FRAME_DIST) {
          const scale = MAX_FRAME_DIST / moveDist;
          moveX *= scale;
          moveY *= scale;
        }

        thingX += moveX;
        thingY += moveY;
      }

      const speed = Math.hypot(velX, velY);
      const arrived = dist <= ARRIVE_THRESHOLD;

      // ── State machine ─────────────────────────────────────────────────────

      if (!pointing) {
        // Turn detection: only when moving fast enough and enough time has
        // passed since the last turn (cooldown prevents rapid re-triggering).
        if (speed > TURN_MIN_SPEED && (now - lastTurnAt) > TURN_COOLDOWN_MS) {
          const invSp = 1 / speed;
          const nx = velX * invSp;
          const ny = velY * invSp;
          if (lastDir.set) {
            const dot = Math.max(-1, Math.min(1, lastDir.x * nx + lastDir.y * ny));
            if (Math.acos(dot) > TURN_ANGLE_RAD && (state === S.CRAWLING || state === S.IDLE)) {
              enterState(S.TURNING, now);
            }
          }
          lastDir.x = nx;
          lastDir.y = ny;
          lastDir.set = true;
        }

        switch (state) {
          case S.IDLE:
            if (!mouseStopped || !arrived) {
              settleStarted = false;
              enterState(S.CRAWLING, now);
            }
            break;
          case S.CRAWLING:
            if (mouseStopped && arrived) enterState(S.SETTLING, now);
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
            enterState(S.IDLE, now);
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
            enterState(S.CRAWLING, now);
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

      if (!pointing) {
        if (!arrived && speed > ROT_MIN_SPEED && !settleStarted) {
          // During active movement: track movement direction
          rotTarget = Math.atan2(velY, velX) + BASE_ROT_OFFSET;
        }
        // When settleStarted is true, rotTarget was already locked to ROT_REST
        // in enterState(SETTLING) — do not override it here.
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
      // Stop the RAF when nothing needs animating:
      //   mouse stopped + Thing arrived + stable state + rotation converged.
      // Loop restarts automatically on the next mousemove.
      // For IDLE, schedule the next frame-tick via setTimeout.

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
        // POINTING: loop restarts on next mousemove
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
