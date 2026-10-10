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
console.log('Build output OK');
