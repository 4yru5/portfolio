/* ============================================================================
   GSAP scroll scenes — home page only (plan §5).
   Two pinned scenes (statement, CTF), plus the timeline line that draws down.
   Everything is wrapped in gsap.matchMedia so it is skipped for
   prefers-reduced-motion and on coarse pointers where pinning feels wrong;
   the markup stays fully readable without it (progressive enhancement).
   Loaded lazily and only on the home page by Base/index.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    fine: '(min-width: 720px)',
  },
  (ctx) => {
    const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
    if (!motion) return;

    /* ---- Scene 6: timeline line draws down as you scroll ---- */
    const line = document.querySelector<HTMLElement>('[data-timeline-line]');
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: '#timeline',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );
    }

    return () => {
      /* matchMedia cleanup handled by GSAP; SplitText reverts automatically */
    };
  }
);

// keep pinned triggers honest after fonts/images settle
window.addEventListener('load', () => ScrollTrigger.refresh());
