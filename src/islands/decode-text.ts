/* ============================================================================
   <decode-text> — the SURYA ⇄ 4YRU5 motif (plan §2).
   4YRU5 is SURYA reversed in leetspeak. On load the text scrambles then
   resolves to `data-to`; on hover/focus it flips to `data-from` (the real
   name) and back. Pure vanilla JS, no GSAP — this runs in the hero, cheap.
   Respects prefers-reduced-motion: shows the resolved text immediately.
   ========================================================================== */

const GLYPHS = '4YRU5SA0X#/\\█▓<>$9271';

class DecodeText extends HTMLElement {
  private from = '';
  private to = '';
  private frame = 0;
  private raf = 0;

  connectedCallback() {
    this.from = this.getAttribute('data-from') ?? this.textContent?.trim() ?? '';
    this.to = this.getAttribute('data-to') ?? this.from;
    this.setAttribute('role', 'text');
    this.setAttribute('aria-label', this.from); // screen readers get the real word

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.textContent = this.to;
      return;
    }

    this.scrambleTo(this.to);

    this.addEventListener('pointerenter', () => this.scrambleTo(this.from));
    this.addEventListener('pointerleave', () => this.scrambleTo(this.to));
    this.addEventListener('focus', () => this.scrambleTo(this.from));
    this.addEventListener('blur', () => this.scrambleTo(this.to));
    this.tabIndex = 0;
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
  }

  private scrambleTo(target: string) {
    cancelAnimationFrame(this.raf);
    const start = (this.textContent || '').padEnd(target.length, ' ');
    const total = 22; // frames
    this.frame = 0;

    const tick = () => {
      const p = this.frame / total;
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const reveal = i / target.length;
        if (p >= reveal + 0.25) {
          out += target[i];
        } else if (p >= reveal) {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        } else {
          out += start[i] === ' ' ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : start[i];
        }
      }
      this.textContent = out;
      this.frame++;
      if (this.frame <= total) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.textContent = target;
      }
    };
    this.raf = requestAnimationFrame(tick);
  }
}

if (!customElements.get('decode-text')) {
  customElements.define('decode-text', DecodeText);
}
