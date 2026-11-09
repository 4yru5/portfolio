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
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    fine: '(min-width: 720px)',
  },
  (ctx) => {
    const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
    if (!motion) return;

    /* ---- Scene 2: pinned statement, words light up one by one ---- */
    const statement = document.querySelector<HTMLElement>('[data-scene="statement"] .statement__text');
    if (statement) {
      const split = new SplitText(statement, { type: 'words', wordsClass: 'word' });
      gsap.set(split.words, { opacity: 0.16 });
      gsap.to(split.words, {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '[data-scene="statement"]',
          start: 'top top',
          end: '+=150%',
          pin: fine, // only pin on larger screens
          scrub: true,
        },
      });
    }

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
