/* ============================================================================
   Dot-grid cursor spotlight (plan §3).
   Fine pointers only, off for reduced motion. Writes --mx/--my on the
   .dot-grid::after layer so per-frame updates never restyle page content.
   ========================================================================== */

const grid = document.querySelector<HTMLElement>('.dot-grid');

if (
  grid &&
  matchMedia('(pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  addEventListener(
    'pointermove',
    (e) => {
      grid.style.setProperty('--mx', `${e.clientX}px`);
      grid.style.setProperty('--my', `${e.clientY}px`);
    },
    { passive: true }
  );
}
