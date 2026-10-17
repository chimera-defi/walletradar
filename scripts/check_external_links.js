#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * External link audit for the data docs.
 *
 *   bun scripts/check_external_links.js            # report only, exit 0
 *   bun scripts/check_external_links.js --strict   # exit 1 when any link is broken
 *   bun scripts/check_external_links.js --tsv out.tsv
 *
 * Classes: ok (2xx), blocked (403/429/5xx-challenge, not proof of breakage),
 * moved (final host differs from the requested host), broken (404/410/DNS/timeout).
 * Placeholders (example.com, localhost, provider.com, github.com/org/repo) and the site's own
 * domain are skipped; the site's internal links are covered by frontend `bun run check-links`.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_HOST = /(^|\.)(example\.com|localhost|provider\.com|walletradar\.org)$|^127\./;
const SKIP_URL = /^https:\/\/github\.com\/org\/repo\/?$/;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36';

function extractUrls(text) {
  const found = text.match(/https?:\/\/[^\s)\]>"'`|,;<]+/g) || [];
  return [...new Set(found.map((u) => u.replace(/[.:*]+$/, '')))];
}

function shouldSkip(url) {
  if (SKIP_URL.test(url)) return true;
  try {
    return SKIP_HOST.test(new URL(url).hostname);
  } catch {
    return true;
  }
}

function stripWww(host) {
  return host.replace(/^www\./, '');
}

function classify(requested, status, finalUrl) {
  if (status >= 200 && status < 400) {
    try {
      const a = stripWww(new URL(requested).hostname);
      const b = stripWww(new URL(finalUrl).hostname);
      if (a !== b) return 'moved';
    } catch {
      /* fall through */
    }
    return 'ok';
  }
  if (status === 403 || status === 429 || status === 401 || status === 999) return 'blocked';
  if (status >= 500) return 'blocked';
  return 'broken';
}

function listFiles() {
  const out = [];
  const add = (dir, re) => {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) return;
    for (const f of fs.readdirSync(abs)) if (re.test(f)) out.push(path.join(dir, f));
  };
  add('.', /\.md$/);
  add('articles', /\.md$/);
  add('docs', /\.md$/);
  add('data', /\.json$/);
  return out;
}

async function check(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA } });
    return { status: res.status, finalUrl: res.url };
  } catch {
    return { status: 0, finalUrl: url };
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]);
      }
    })
  );
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const tsvIdx = args.indexOf('--tsv');
  const tsvPath = tsvIdx >= 0 ? args[tsvIdx + 1] : null;
  const byUrl = new Map();
  for (const rel of listFiles()) {
    for (const u of extractUrls(fs.readFileSync(path.join(ROOT, rel), 'utf8'))) {
      if (shouldSkip(u)) continue;
      if (!byUrl.has(u)) byUrl.set(u, new Set());
      byUrl.get(u).add(rel);
    }
  }
  const urls = [...byUrl.keys()];
  console.log(`Checking ${urls.length} external URLs...`);
  const rows = await pool(urls, 24, async (u) => {
    const r = await check(u);
    return { url: u, files: [...byUrl.get(u)].join(' '), status: r.status, finalUrl: r.finalUrl, cls: classify(u, r.status, r.finalUrl) };
  });
  const counts = {};
  for (const r of rows) counts[r.cls] = (counts[r.cls] || 0) + 1;
  console.log(counts);
  for (const cls of ['broken', 'moved']) {
    for (const r of rows.filter((x) => x.cls === cls)) {
      console.log(`${cls.toUpperCase()}\t${r.status}\t${r.url}${cls === 'moved' ? ` -> ${r.finalUrl}` : ''}\t${r.files}`);
    }
  }
  if (tsvPath) {
    fs.writeFileSync(tsvPath, rows.map((r) => [r.cls, r.status, r.url, r.finalUrl, r.files].join('\t')).join('\n') + '\n');
  }
  if (strict && counts.broken) process.exit(1);
}

module.exports = { extractUrls, shouldSkip, classify };

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
