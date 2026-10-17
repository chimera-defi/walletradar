#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * External link audit for the data docs.
 *
 *   bun scripts/check_external_links.js            # report only, exit 0
 *   bun scripts/check_external_links.js --strict   # exit 1 when any link is broken
 *   bun scripts/check_external_links.js --tsv out.tsv
 *
 * Classes: ok (2xx), blocked (401/403/429/999/5xx, not proof of breakage),
 * moved (final base domain differs from the requested one; same-domain subdomain moves count as ok), broken (404/410/DNS/timeout).
 * Placeholders (example.com, localhost, provider.com, github.com/org/repo) and the site's own
 * domain are skipped; the site's internal links are covered by frontend `bun run check-links`.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_HOST = /(^|\.)(example\.com|localhost|provider\.com|walletradar\.org)$|^127\./;
const SKIP_URL = /^https:\/\/github\.com\/org\/repo\/?$/;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36';

function trimUrl(u) {
  let out = u.replace(/&amp;/g, '&');
  for (;;) {
    const before = out;
    out = out.replace(/[.:*\\_~;∆!?]+$/, '');
    // a trailing ")" belongs to the URL only when it balances an earlier "("
    if (out.endsWith(')') && (out.match(/\(/g) || []).length < (out.match(/\)/g) || []).length) out = out.slice(0, -1);
    if (out === before) return out;
  }
}

function extractUrls(text) {
  const found = text.match(/https?:\/\/[^\s\]>"'`|,<]+/g) || [];
  return [...new Set(found.map(trimUrl))];
}

function shouldSkip(url) {
  if (SKIP_URL.test(url)) return true;
  try {
    return SKIP_HOST.test(new URL(url).hostname);
  } catch {
    return true;
  }
}

// Last two labels (three for common second-level suffixes): stripe.com == docs.stripe.com.
function baseDomain(host) {
  const parts = host.replace(/^www\./, '').split('.');
  const sld = /^(co|com|org|net|gov|ac)$/.test(parts[parts.length - 2] || '') ? 3 : 2;
  return parts.slice(-sld).join('.');
}

function classify(requested, status, finalUrl) {
  if (status >= 200 && status < 400) {
    try {
      const a = baseDomain(new URL(requested).hostname);
      const b = baseDomain(new URL(finalUrl).hostname);
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

async function check(url, retried = false) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA } });
    if (res.status === 429 && !retried) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return check(url, true);
    }
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
  const tsvPath = tsvIdx >= 0 && args[tsvIdx + 1] && !args[tsvIdx + 1].startsWith('--') ? args[tsvIdx + 1] : null;
  if (tsvIdx >= 0 && !tsvPath) {
    console.error('--tsv needs a file path');
    process.exit(2);
  }
  const byUrl = new Map();
  for (const rel of listFiles()) {
    for (const u of extractUrls(fs.readFileSync(path.join(ROOT, rel), 'utf8'))) {
      if (shouldSkip(u)) continue;
      if (!byUrl.has(u)) byUrl.set(u, new Set());
      byUrl.get(u).add(rel);
    }
  }
  // Group by host so one host is hit serially (avoids GitHub/CDN 429s); hosts run in parallel.
  const urls = [...byUrl.keys()];
  const byHost = new Map();
  for (const u of urls) {
    const h = new URL(u).hostname;
    if (!byHost.has(h)) byHost.set(h, []);
    byHost.get(h).push(u);
  }
  console.log(`Checking ${urls.length} external URLs...`);
  const grouped = await pool([...byHost.values()], 24, async (list) => {
    const out = [];
    for (const u of list) {
      const r = await check(u);
      out.push({ url: u, files: [...byUrl.get(u)].join(' '), status: r.status, finalUrl: r.finalUrl, cls: classify(u, r.status, r.finalUrl) });
    }
    return out;
  });
  const rows = grouped.flat();
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

module.exports = { extractUrls, shouldSkip, classify, trimUrl };

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
