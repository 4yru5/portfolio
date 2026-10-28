# Surya Ravi — Portfolio

This is my personal portfolio website. I'm a security researcher, and this is
the one link I can hand to anyone — a recruiter, a team, a stranger on the
internet — to say *here's who I am, here's what I break, and here's what I've
built.* It's a single scrolling page: you start at my name and end at a way to
contact me, passing my focus areas, my LLM CTF highlight, my projects, my
timeline, and a glimpse of the person outside the work.

### Why it looks the way it does

I build and break software for a living, so I wanted the site itself to feel
like a well-made piece of software rather than a résumé in a web page:

- **A desktop you can poke at.** The fake macOS menu bar, the draggable
  windows, the ⌘K command palette and the little terminal in the footer all say
  "this person lives in tools" without me having to write it down. It's an
  interface, not a brochure.
- **The 4YRU5 ⇄ SURYA motif.** My handle is my name reversed in leetspeak.
  Letting it *decode* on screen is a quiet nod to what security work is —
  seeing the hidden thing inside the ordinary one.
- **Calm by default, playful on purpose.** The layout is restrained and
  Apple-ish so the content leads; the play (the Rubik's cube, the kaomoji, the
  terminal easter egg) is concentrated in one "after hours" section so it reads
  as personality, not noise.
- **Fast, private, and secure — because that's the job.** Static site, no
  tracking, self-hosted fonts, a strict Content-Security-Policy and real
  security headers. A reviewer who inspects the site finds it practises what I
  research. Everything also respects "reduce motion" and works by keyboard.

Under the hood it's an Astro static site built from the *Plan & Architecture*
spec: a dot-grid background, nine single-scroll scenes, GSAP pinned animations
plus draggable windows, the ⌘K palette, and strict security headers.

### The sections, in plain terms

1. **Menu bar** (always on top) — brand logo, section links, a live India
   clock, the ⌘K button and the light/dark toggle.
2. **Hero** — my name decoding from 4YRU5 to SURYA, a one-line intro, focus
   tags, and buttons to my CV and GitHub.
3. **Statement** — one sentence, lit up word by word: *"I study how systems
   fail and how trust breaks."*
4. **Focus areas** — a four-tile grid (appsec, API, AI/LLM, threat exposure),
   each with a tiny live demo of the kind of bug it covers.
5. **CTF highlight** — my large-language-model capture-the-flag result, with a
   replayed (safe, redacted) chat and a link to the write-up.
6. **Projects** — my tools as draggable windows; click a title to open its case
   study. Falls back to a tidy stack on phones.
7. **Timeline** — my track record from 2019 to now, as a line that draws itself
   as you scroll.
8. **Writing** — write-ups and notes; some open here, some link out (e.g. the
   LLM CTF post on Medium). Has an RSS feed.
9. **After hours** — the person behind the work: a solvable Rubik's cube, a
   chess puzzle, a "now playing" widget, and other toys.
10. **Contact / footer** — a big wordmark, a working mini-terminal (try
    `help`), copy-my-email, and links to my CV, LinkedIn and security.txt.

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
