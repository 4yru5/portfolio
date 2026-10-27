# Surya Ravi — Portfolio

A calm, Apple-grade stage with a security researcher's desktop hidden inside.
Built from the *Plan & Architecture* spec: an Astro static site with a dot-grid
background, the **SURYA ⇄ 4YRU5** decode motif, a fake macOS menu bar, nine
single-scroll scenes, GSAP pinned scenes + draggable windows, a ⌘K palette, and
strict security headers.

## Stack

- **Astro 5** (static output) · TypeScript · plain CSS with design tokens
- **GSAP 3.13** (ScrollTrigger, SplitText, Draggable, Inertia) — home page only, lazy
- Native CSS scroll reveals + View Transitions, GSAP as the fallback/precision layer
- Self-hosted **Geist + Geist Mono** (Fontsource) · accent: **signal green**

## Commands

```bash
npm install        # install deps (native scripts for sharp/esbuild are pre-approved)
npm run dev        # http://localhost:4321
npm run build      # -> dist/ (static)
npm run preview    # serve the built site
npm run check      # astro + type + content check
node scripts/csp-hash.mjs   # print inline-script CSP hashes (only if moving CSP to headers)
```

## Structure

```
src/
  styles/     tokens.css · dot-grid.css · global.css
  content/    projects/*.mdx · writing/*.mdx · timeline.json   (typed, see content.config.ts)
  components/ MenuBar Hero Statement BentoFocus CtfHighlight ProjectWindow
              Projects Timeline Writing Desktop TerminalFooter
  islands/    theme-toggle · command-palette · decode-text · dot-grid
              draggable-windows · scroll-scenes   (vanilla TS custom elements / modules)
  layouts/    Base.astro        (head, pre-paint theme script, View Transitions, JSON-LD)
  pages/      index · work/[slug] · writing/ · writing/[slug] · 404 · rss.xml  (+ /cv redirect)
public/       _headers · .well-known/security.txt · robots.txt · favicon.svg · og/ · media/demos/
```

## Security

- CSP is emitted by Astro as a `<meta>` with per-build script/style hashes
  (`experimental.csp` in `astro.config.mjs`). `public/_headers` adds the
  header-only directives (`frame-ancestors`, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, COOP) + immutable asset caching.
- Target: A+ on securityheaders.com / Mozilla Observatory.

## Content — what to swap (currently realistic placeholders)

- **Projects** — `src/content/projects/*.mdx` (4 placeholders). One repo = one file.
  Add a `demo: /media/demos/<tool>.webm` line + drop the file to show a terminal demo
  instead of the static fallback.
- **Writing** — `src/content/writing/*.mdx`. Use `external:` to link out to Medium,
  or omit it and write the post inline.
- **Timeline** — `src/content/timeline.json` (2019→2026). Each entry needs a unique `id`.
- **Identity** — real email / PGP in `TerminalFooter.astro` + `command-palette.ts`,
  LinkedIn/Medium URLs in `Base.astro` (JSON-LD) and the footer, real CV at
  `public/Surya_Ravi_CV.pdf`, security contact in `security.txt`.
- **Domain** — set `SITE` in `astro.config.mjs` (currently `https://4yru5.dev`).

## Deploy

Static host (Cloudflare Workers static assets recommended for the `_headers`
support). Build in CI, deploy `dist/`. See the plan's §7 roadmap.
