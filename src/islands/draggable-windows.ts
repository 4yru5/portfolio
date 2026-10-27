/* ============================================================================
   Draggable macOS windows (plan §5) — Projects + After-hours desktop.
   GSAP Draggable with inertia; the focused window raises z-index; arrow keys
   nudge the focused window (keyboard-operable, plan §8). On coarse pointers
   and for reduced motion the windows stay in their tidy CSS grid and are not
   draggable — the content is identical either way.
   ========================================================================== */

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

let z = 10;

function enableDrag() {
  const windows = gsap.utils.toArray<HTMLElement>('[data-drag]');
  if (!windows.length) return;

  windows.forEach((win) => {
    const handle = win.querySelector<HTMLElement>('.win__bar') ?? win;
    win.style.touchAction = 'none';
    win.tabIndex = 0;

    const raise = () => { win.style.zIndex = String(++z); };
    win.addEventListener('pointerdown', raise);
    win.addEventListener('focus', raise);

    Draggable.create(win, {
      trigger: handle,
      type: 'x,y',
      inertia: true,
      edgeResistance: 0.72,
      bounds: win.closest('[data-drag-bounds]') ?? document.body,
      onPress: raise,
      cursor: 'grab',
      activeCursor: 'grabbing',
    });

    // keyboard nudge
    win.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 32 : 10;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else return;
      e.preventDefault();
      raise();
      gsap.to(win, { x: `+=${dx}`, y: `+=${dy}`, duration: 0.2, ease: 'power2.out' });
    });
  });
}

const mm = gsap.matchMedia();
mm.add('(min-width: 860px) and (prefers-reduced-motion: no-preference)', () => {
  enableDrag();
  return () => {
    Draggable.get('[data-drag]');
    gsap.utils.toArray<HTMLElement>('[data-drag]').forEach((w) => {
      const d = Draggable.get(w);
      if (d) d.kill();
      gsap.set(w, { clearProps: 'x,y,zIndex' });
    });
  };
});
