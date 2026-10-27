// Print the sha256 CSP hashes for every inline <script> in the built site.
// Run after `npm run build`, then paste the theme-script hash into public/_headers.
//   node scripts/csp-hash.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';
const seen = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) scan(p);
  }
}

function scan(file) {
  const html = readFileSync(file, 'utf8');
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const body = m[1];
    if (!body.trim()) continue;
    const hash = 'sha256-' + createHash('sha256').update(body, 'utf8').digest('base64');
    if (!seen.has(hash)) seen.set(hash, { file, preview: body.trim().slice(0, 60).replace(/\s+/g, ' ') });
  }
}

try {
  walk(DIST);
} catch {
  console.error('No dist/ — run `npm run build` first.');
  process.exit(1);
}

if (!seen.size) {
  console.log('No inline scripts found.');
} else {
  console.log('Inline <script> hashes (add to script-src in public/_headers):\n');
  for (const [hash, info] of seen) {
    console.log(`  '${hash}'   // ${info.preview}…`);
  }
}
