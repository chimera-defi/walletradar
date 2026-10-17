#!/usr/bin/env node
// Post-build step: turn frontend/redirects/*.json into static redirect stubs in out/
// plus out/amplify-redirects.json (Amplify customRules format) for the operator.
// Format of each file: [{ "from": "/old/", "to": "/new/#anchor", "reason": "..." }]
// See docs/REDIRECTS.md.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'out');
const redirectsDir = path.join(root, 'redirects');
const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://walletradar.org').replace(/\/+$/, '');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pagePath = (p) => path.join(out, p.replace(/^\/+|\/+$/g, ''), 'index.html');
const errors = [];

if (!fs.existsSync(out)) {
  console.error('build-redirects: out/ not found; run next build first');
  process.exit(1);
}

const entries = [];
const files = fs.existsSync(redirectsDir) ? fs.readdirSync(redirectsDir).filter((f) => f.endsWith('.json')).sort() : [];
for (const f of files) {
  let list;
  try {
    list = JSON.parse(fs.readFileSync(path.join(redirectsDir, f), 'utf8'));
  } catch (e) {
    errors.push(`${f}: invalid JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(list)) { errors.push(`${f}: expected an array`); continue; }
  list.forEach((e, i) => entries.push({ ...e, file: f, i }));
}

const seen = new Set();
const rules = [];
for (const e of entries) {
  const tag = `${e.file}[${e.i}]`;
  if (typeof e.from !== 'string' || typeof e.to !== 'string' || !e.from.startsWith('/') || !e.to.startsWith('/') || !e.from.endsWith('/')) {
    errors.push(`${tag}: "from" must be a path starting and ending with "/", and "to" a path starting with "/"`);
    continue;
  }
  if (e.from.includes('#') || e.from.includes('?')) { errors.push(`${tag}: "from" must not contain # or ?`); continue; }
  if (seen.has(e.from)) { errors.push(`${tag}: duplicate "from" ${e.from}`); continue; }
  seen.add(e.from);
  const toPath = e.to.split('#')[0].split('?')[0];
  if (toPath === e.from) { errors.push(`${tag}: "to" equals "from"`); continue; }
  if (fs.existsSync(pagePath(e.from)) && !fs.readFileSync(pagePath(e.from), 'utf8').includes('data-redirect-stub')) { errors.push(`${tag}: "from" ${e.from} is a real page in out/`); continue; }
  const targetFile = pagePath(toPath);
  if (!fs.existsSync(targetFile)) { errors.push(`${tag}: target ${toPath} does not exist in out/`); continue; }
  if (fs.readFileSync(targetFile, 'utf8').includes('data-redirect-stub')) { errors.push(`${tag}: target ${toPath} is itself a stub`); continue; }

  const m = fs.readFileSync(targetFile, 'utf8').match(/<title>([^<]*)<\/title>/i);
  const title = m ? m[1].trim() : 'Redirecting';
  const canonical = baseUrl + toPath;
  const html = `<!DOCTYPE html>
<html lang="en" data-redirect-stub>
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${esc(canonical)}">
<meta http-equiv="refresh" content="0; url=${esc(e.to)}">
<script>location.replace(${JSON.stringify(e.to).replace(/</g, '\\u003c')});</script>
</head>
<body>
<p>This page has moved to <a href="${esc(e.to)}">${esc(e.to)}</a>.</p>
</body>
</html>
`;
  const dest = pagePath(e.from);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  const bare = e.from.replace(/\/+$/, '');
  rules.push({ source: bare, target: e.to, status: '301' });
  rules.push({ source: e.from, target: e.to, status: '301' });
}

if (errors.length) {
  console.error('build-redirects failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}
fs.writeFileSync(path.join(out, 'amplify-redirects.json'), JSON.stringify(rules, null, 2) + '\n');
console.log(`build-redirects: ${seen.size} stub(s), ${rules.length} Amplify rule(s)`);
