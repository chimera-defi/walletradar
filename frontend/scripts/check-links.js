#!/usr/bin/env node
/**
 * Link checker for the static export (frontend/out).
 *
 * Usage:
 *   node scripts/check-links.js            internal links, asset refs and #anchors
 *   node scripts/check-links.js --external also HEAD/GET every external https link (network)
 *
 * Exit code 1 when any internal link, asset or anchor is broken.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const checkExternal = process.argv.includes('--external');

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

async function checkExternalLinks() {
  const results = [];
  const urls = [...external.keys()].filter((u) => !/googletagmanager|google-analytics/.test(u));
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const url = queue.pop();
      let status = 0;
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 15000);
        let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': 'walletradar-linkcheck' } });
        if (res.status === 405 || res.status === 403 || res.status === 400) {
          res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': 'walletradar-linkcheck' } });
        }
        clearTimeout(t);
        status = res.status;
      } catch (e) {
        status = `ERR ${e.cause?.code || e.name}`;
      }
      if (typeof status !== 'number' || status >= 400) results.push({ url, status, pages: external.get(url).slice(0, 3) });
    }
  }
  await Promise.all(Array.from({ length: 10 }, worker));
  return results;
}

(async () => {
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
  if (checkExternal) {
    const bad = await checkExternalLinks();
    console.log(`\nEXTERNAL non-2xx/3xx (${bad.length}):`);
    for (const b of bad) console.log(`  ${b.status} ${b.url}   (e.g. ${b.pages.join(', ')})`);
  }
  process.exit(broken.length ? 1 : 0);
})();
