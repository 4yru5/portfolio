/* ============================================================================
   ⌘K command palette (plan §4).
   Jump to sections, toggle theme, copy email, download CV, open GitHub.
   Built as one accessible overlay: focus trap, Esc to close, ↑/↓ to move,
   type to filter, Enter to run. Also reachable from the menu-bar ⌘K button
   for touch users.
   ========================================================================== */

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  run: (close: () => void) => void;
};

const EMAIL = 'suryaravi.in@gmail.com'; // TODO: swap for the real address
const CV = 'https://4yru5.github.io/cv/';
const GITHUB = 'https://github.com/4yru5';

function go(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else location.hash = hash;
}

const commands: Cmd[] = [
  { id: 'home', label: 'Go to top', keywords: 'hero home', run: (c) => { go('#top'); c(); } },
  { id: 'focus', label: 'Focus areas', keywords: 'appsec api ai', run: (c) => { go('#focus'); c(); } },
  { id: 'ctf', label: 'LLM CTF highlight', keywords: 'ctf 5th', run: (c) => { go('#ctf'); c(); } },
  { id: 'projects', label: 'Projects & tools', keywords: 'work repos github', run: (c) => { go('#projects'); c(); } },
  { id: 'experience', label: 'Experience & news', keywords: 'timeline orbia', run: (c) => { go('#timeline'); c(); } },
  { id: 'writing', label: 'Writing', keywords: 'blog posts medium', run: (c) => { go('#writing'); c(); } },
  { id: 'contact', label: 'Contact', keywords: 'email footer', run: (c) => { go('#contact'); c(); } },
  { id: 'theme', label: 'Toggle theme', hint: 'light / dark', keywords: 'dark light mode', run: () => window.dispatchEvent(new Event('theme:toggle')) },
  {
    id: 'email',
    label: 'Copy email',
    hint: EMAIL,
    keywords: 'mail contact copy',
    run: async (c) => {
      try { await navigator.clipboard.writeText(EMAIL); toast('email copied'); }
      catch { location.href = `mailto:${EMAIL}`; }
      c();
    },
  },
  { id: 'cv', label: 'Download CV', hint: 'PDF', keywords: 'resume cv pdf', run: (c) => { window.open(CV, '_blank'); c(); } },
  { id: 'github', label: 'Open GitHub', hint: '@4yru5', keywords: 'repos code', run: (c) => { window.open(GITHUB, '_blank'); c(); } },
];

let overlay: HTMLDivElement | null = null;
let input: HTMLInputElement;
let list: HTMLUListElement;
let active = 0;
let filtered = commands;
let lastFocus: HTMLElement | null = null;

function toast(msg: string) {
  const t = document.createElement('div');
  t.className = 'cmdk-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-in'));
  setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, 1600);
}

function build() {
  overlay = document.createElement('div');
  overlay.className = 'cmdk';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Command palette');
  overlay.innerHTML = `
    <div class="cmdk__backdrop" data-close></div>
    <div class="cmdk__panel">
      <div class="cmdk__search">
        <span class="cmdk__prompt mono">&gt;</span>
        <input class="cmdk__input" type="text" placeholder="jump to, copy, toggle…"
               autocomplete="off" spellcheck="false" aria-label="Type a command" />
        <kbd class="cmdk__esc">esc</kbd>
      </div>
      <ul class="cmdk__list" role="listbox" aria-label="Commands"></ul>
    </div>`;
  document.body.appendChild(overlay);
  input = overlay.querySelector('.cmdk__input')!;
  list = overlay.querySelector('.cmdk__list')!;

  overlay.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).dataset.close !== undefined) close();
  });
  input.addEventListener('input', () => { filter(input.value); });
  input.addEventListener('keydown', onKey);
}

function render() {
  list.innerHTML = filtered
    .map(
      (c, i) => `
      <li class="cmdk__item ${i === active ? 'is-active' : ''}" role="option"
          id="cmdk-${c.id}" aria-selected="${i === active}" data-i="${i}">
        <span class="cmdk__label">${c.label}</span>
        ${c.hint ? `<span class="cmdk__hint mono">${c.hint}</span>` : ''}
      </li>`
    )
    .join('') || `<li class="cmdk__empty">no matches</li>`;

  list.querySelectorAll<HTMLLIElement>('.cmdk__item').forEach((li) => {
    li.addEventListener('mousemove', () => { active = Number(li.dataset.i); paint(); });
    li.addEventListener('click', () => run());
  });
}

function paint() {
  list.querySelectorAll<HTMLLIElement>('.cmdk__item').forEach((li, i) => {
    const on = i === active;
    li.classList.toggle('is-active', on);
    li.setAttribute('aria-selected', String(on));
    if (on) li.scrollIntoView({ block: 'nearest' });
  });
  input.setAttribute('aria-activedescendant', filtered[active] ? `cmdk-${filtered[active].id}` : '');
}

function filter(q: string) {
  const s = q.trim().toLowerCase();
  filtered = !s
    ? commands
    : commands.filter((c) => (c.label + ' ' + (c.keywords ?? '') + ' ' + (c.hint ?? '')).toLowerCase().includes(s));
  active = 0;
  render();
}

function run() {
  const cmd = filtered[active];
  if (cmd) cmd.run(close);
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); paint(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); paint(); }
  else if (e.key === 'Enter') { e.preventDefault(); run(); }
  else if (e.key === 'Escape') { e.preventDefault(); close(); }
}

export function open() {
  if (!overlay) build();
  lastFocus = document.activeElement as HTMLElement;
  filter('');
  overlay!.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  input.value = '';
  requestAnimationFrame(() => input.focus());
}

function close() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  lastFocus?.focus();
}

// global ⌘K / Ctrl-K, and "/" to search
document.addEventListener('keydown', (e) => {
  const inField =
    /^(input|textarea|select)$/i.test((e.target as HTMLElement)?.tagName ?? '') ||
    (e.target as HTMLElement)?.isContentEditable;
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    overlay?.classList.contains('is-open') ? close() : open();
  } else if (e.key === '/' && !inField && !overlay?.classList.contains('is-open')) {
    e.preventDefault();
    open();
  }
});

// menu-bar / footer buttons
document.addEventListener('click', (e) => {
  if ((e.target as HTMLElement)?.closest('[data-cmdk-open]')) { e.preventDefault(); open(); }
});
