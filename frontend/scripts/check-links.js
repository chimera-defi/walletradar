#!/usr/bin/env node
/**
 * Link checker for the static export (frontend/out).
 *
 * Usage:
 *   node scripts/check-links.js            internal links, asset refs and #anchors
 *
 * Exit code 1 when any internal link, asset or anchor is broken.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [
    path.join(OUT, clean),
    path.join(OUT, clean, 'index.html'),
    path.join(OUT, `${clean}.html`),
  ];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}

const idCache = new Map();
function idsFor(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set();
    for (const m of html.matchAll(/\s(?:id|name)="([^"]+)"/g)) ids.add(m[1]);
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

const pages = walk(OUT);
const broken = [];
const external = new Map();
let checked = 0;

for (const page of pages) {
  const rel = '/' + path.relative(OUT, page).replace(/index\.html$/, '');
  const html = fs.readFileSync(page, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  for (const ref of refs) {
    if (/^(mailto:|tel:|javascript:|data:|blob:)/.test(ref)) continue;
    if (/^https?:\/\//.test(ref) || ref.startsWith('//')) {
      const url = ref.startsWith('//') ? `https:${ref}` : ref;
      if (!external.has(url)) external.set(url, []);
      external.get(url).push(rel);
      continue;
    }
    checked++;
    const [pathPart, hash] = ref.split('#');
    let target;
    if (pathPart === '') target = page;
    else if (pathPart.startsWith('/')) target = resolveTarget(pathPart);
    else target = resolveTarget(path.posix.join(rel, pathPart));
    if (!target) {
      broken.push({ page: rel, ref, reason: 'missing target' });
      continue;
    }
    if (hash && target.endsWith('.html') && !idsFor(target).has(decodeURIComponent(hash))) {
      broken.push({ page: rel, ref, reason: 'missing anchor' });
    }
  }
}

{
  console.log(`pages: ${pages.length}, internal refs checked: ${checked}, unique external: ${external.size}`);
  if (broken.length) {
    console.log(`\nBROKEN INTERNAL (${broken.length}):`);
    const seen = new Set();
    for (const b of broken) {
      const key = `${b.ref}|${b.reason}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ${b.reason}: ${b.ref}   (e.g. on ${b.page})`);
    }
  } else {
    console.log('no broken internal links');
  }
  process.exit(broken.length ? 1 : 0);
}
