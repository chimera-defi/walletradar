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

// Sitemap integrity: unique <loc>s, every HTML <loc> is a built page, no redirect stub is listed.
const pageFor = (u) => {
  const p = new URL(u).pathname.replace(/^\/+|\/+$/g, '');
  return path.join(out, p, 'index.html');
};
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].trim());
const siteProblems = [];
const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
if (dupes.length) siteProblems.push('duplicate <loc>: ' + [...new Set(dupes)].join(', '));
for (const l of locs) {
  if (/\.(xml|txt)$/.test(new URL(l).pathname)) continue; // non-HTML entries (merchant feed, llms.txt)
  const f = pageFor(l);
  if (!fs.existsSync(f)) { siteProblems.push(`<loc> has no built page: ${l}`); continue; }
  if (fs.readFileSync(f, 'utf8').includes('data-redirect-stub')) siteProblems.push(`<loc> is a redirect stub: ${l}`);
}

// Redirects: every entry has a stub that points at an existing page; amplify-redirects.json parses.
const redirectsDir = path.join(__dirname, '..', 'redirects');
const entries = fs.existsSync(redirectsDir)
  ? fs.readdirSync(redirectsDir).filter((f) => f.endsWith('.json')).flatMap((f) => JSON.parse(fs.readFileSync(path.join(redirectsDir, f), 'utf8')))
  : [];
for (const e of entries) {
  const stub = path.join(out, e.from.replace(/^\/+|\/+$/g, ''), 'index.html');
  if (!fs.existsSync(stub)) { siteProblems.push(`redirect stub missing for ${e.from}`); continue; }
  if (!fs.readFileSync(stub, 'utf8').includes('data-redirect-stub')) siteProblems.push(`${e.from} exists but is not a redirect stub`);
  const target = path.join(out, e.to.split('#')[0].split('?')[0].replace(/^\/+|\/+$/g, ''), 'index.html');
  if (!fs.existsSync(target)) siteProblems.push(`redirect target missing for ${e.from} -> ${e.to}`);
}
try {
  const rules = JSON.parse(fs.readFileSync(path.join(out, 'amplify-redirects.json'), 'utf8'));
  if (!Array.isArray(rules) || rules.length !== entries.length * 2) siteProblems.push(`amplify-redirects.json: expected ${entries.length * 2} rules`);
} catch (e) {
  siteProblems.push('amplify-redirects.json missing or invalid: ' + e.message);
}
if (siteProblems.length) {
  console.error('Sitemap/redirect check failed:\n  ' + siteProblems.join('\n  '));
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
