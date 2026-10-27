/* ============================================================================
   Theme toggle with an Apple-style circular reveal (plan §3).
   Uses a same-document View Transition where supported (Chrome, Safari,
   Firefox 144+); switches instantly where it is not. The dot grid flips with
   the theme because both read the same tokens.
   Any element with [data-theme-toggle] triggers it (menu-bar dot + ⌘K).
   ========================================================================== */

const root = document.documentElement;

function isDark(): boolean {
  return root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
}

function syncPressed() {
  const dark = isDark();
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((el) => {
    el.setAttribute('aria-pressed', String(dark));
    el.setAttribute(
      'title',
      dark ? 'switch to light' : 'switch to dark'
    );
  });
}

async function toggle(e?: MouseEvent) {
  const next = isDark() ? 'light' : 'dark';

  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode */
    }
    syncPressed();
  };

  const supportsVT =
    'startViewTransition' in document &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsVT) {
    apply();
    return;
  }

  // origin of the circular wipe = where the user clicked, else screen centre
  const x = e?.clientX ?? innerWidth / 2;
  const y = e?.clientY ?? innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const t = (document as Document & {
    startViewTransition: (cb: () => void) => { ready: Promise<void> };
  }).startViewTransition(apply);
  try {
    await t.ready;
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      {
        duration: 600,
        easing: 'cubic-bezier(.16,1,.3,1)',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  } catch {
    /* transition unsupported mid-flight */
  }
}

document.addEventListener('click', (e) => {
  const trigger = (e.target as HTMLElement)?.closest('[data-theme-toggle]');
  if (trigger) {
    e.preventDefault();
    toggle(e as MouseEvent);
  }
});

// keyboard: Enter/Space on a focused toggle
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = document.activeElement as HTMLElement | null;
  if (el?.hasAttribute('data-theme-toggle')) {
    e.preventDefault();
    toggle();
  }
});

// let other islands (⌘K) request a toggle
window.addEventListener('theme:toggle', () => toggle());

syncPressed();
