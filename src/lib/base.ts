// Prefix an internal path with the site's base (e.g. "/portfolio/" on GitHub
// Pages, "/" on a root domain like Cloudflare). Keeps links/assets working
// regardless of where the site is mounted — change `base` in astro.config.mjs
// and every link below follows. Anchors ("#id") and the site root are handled.
export function withBase(path = ''): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (!path || path === '/') return base + '/';
  if (path.startsWith('#')) return `${base}/${path}`;
  return `${base}/${path.replace(/^\//, '')}`;
}
