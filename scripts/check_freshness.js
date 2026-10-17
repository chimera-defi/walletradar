#!/usr/bin/env node
/**
 * Freshness check for the comparison tables (issue #20).
 * Reads the "**Last Updated:** Month D, YYYY" line of each table file and
 * reports age in days. Warns past 30 days; --strict exits 1 past 90 days.
 *
 *   bun scripts/check_freshness.js [--strict] [--today YYYY-MM-DD]
 */
const fs = require('node:fs');
const path = require('node:path');

const FILES = ['SOFTWARE_WALLETS.md', 'HARDWARE_WALLETS.md', 'CRYPTO_CARDS.md', 'RAMPS.md', 'QR_PAYMENTS.md'];
const WARN_DAYS = 30;
const FAIL_DAYS = 90;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

function parseLastUpdated(text) {
  const m = text.match(/\*\*Last Updated:\*\*\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month < 0) return null;
  return new Date(Date.UTC(Number(m[3]), month, Number(m[2])));
}

function ageDays(date, today) {
  return Math.floor((today.getTime() - date.getTime()) / 86400000);
}

function classify(age) {
  if (age === null) return 'missing';
  if (age > FAIL_DAYS) return 'stale';
  if (age > WARN_DAYS) return 'warn';
  return 'fresh';
}

function main(argv) {
  const strict = argv.includes('--strict');
  const ti = argv.indexOf('--today');
  const today = ti >= 0 ? new Date(`${argv[ti + 1]}T00:00:00Z`) : new Date();
  const root = path.join(__dirname, '..');
  let fresh = 0;
  let bad = 0;
  for (const f of FILES) {
    const d = parseLastUpdated(fs.readFileSync(path.join(root, f), 'utf8'));
    const age = d ? ageDays(d, today) : null;
    const status = classify(age);
    if (status === 'fresh') fresh++;
    if (status === 'stale' || status === 'missing') bad++;
    console.log(`${status.padEnd(7)} ${f}${age === null ? '' : ` (${age}d)`}`);
  }
  console.log(`${fresh}/${FILES.length} tables fresh (<=${WARN_DAYS}d)`);
  return strict && bad > 0 ? 1 : 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { parseLastUpdated, ageDays, classify };
