// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Hosting target. GitHub Pages project site for now → served from a /portfolio
// sub-path. To move to a root custom domain later (Cloudflare), set SITE to the
// domain and BASE to '/' (every internal link uses withBase(), so they follow).
const SITE = 'https://4yru5.github.io';
const BASE = '/portfolio';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [mdx(), sitemap()],
  // /cv keeps a stable URL even when the PDF filename changes (plan §4).
  redirects: {
    '/cv': 'https://4yru5.github.io/cv/',
  },
  build: {
    // Ship inline <style>/<script> as external files so a strict CSP
    // (no 'unsafe-inline') can be served from public/_headers (section 7).
    inlineStylesheets: 'never',
  },
  image: {
    // AVIF + WebP via sharp (section 6).
    responsiveStyles: true,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    // Built-in CSP: Astro hashes every inline <script>/<style> at build and
    // emits a <meta http-equiv="content-security-policy"> (plan §7). Header-only
    // directives (frame-ancestors, HSTS, etc.) stay in public/_headers.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "media-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
