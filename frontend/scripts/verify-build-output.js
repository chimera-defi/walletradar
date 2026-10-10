#!/usr/bin/env node
// Post-build check: the static export must contain the key pages and sitemap.
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'out');
const required = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'wallets/qr-payments/bitpay/index.html',
  'wallets/hardware/bitbox02/index.html',
  'explore/index.html',
];
const missing = required.filter((f) => !fs.existsSync(path.join(out, f)));
if (missing.length) {
  console.error('Static export is missing:\n  ' + missing.join('\n  '));
  process.exit(1);
}
const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
if (!sitemap.includes('<loc>')) {
  console.error('sitemap.xml has no <loc> entries');
  process.exit(1);
}

// Content check: the first built page of each dynamic route must have a real title,
// not the "Not Found" fallback (regression: sync `params` in Next 16 404'd every one).
const title = (file) => {
  const m = fs.readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
};
const bad = [];
for (const dir of ['wallets/software', 'wallets/hardware', 'wallets/cards', 'docs', 'articles']) {
  const base = path.join(out, dir);
  const slug = fs.existsSync(base) && fs.readdirSync(base).sort().find((n) => fs.existsSync(path.join(base, n, 'index.html')));
  if (!slug) { bad.push(`${dir}: no built pages`); continue; }
  const t = title(path.join(base, slug, 'index.html'));
  if (!t || /not found/i.test(t)) bad.push(`${dir}/${slug}: title "${t}"`);
}
// The 404 page is the one place "Not Found" is expected.
if (!fs.readFileSync(path.join(out, '404.html'), 'utf8').includes('Page Not Found')) bad.push('404.html: expected the "Page Not Found" content');
if (bad.length) {
  console.error('Dynamic route content check failed:\n  ' + bad.join('\n  '));
  process.exit(1);
}
console.log('Build output OK');
