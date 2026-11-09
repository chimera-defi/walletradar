#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Copy the weekly refresh JSON (data/activity.json, data/hardware-activity.json)
 * into the hand-kept wallet tables, so the site's Active column follows it.
 *
 * Rows are joined by GitHub repo (any github.com/owner/repo link in the row), or
 * by bold wallet name in tables that have a Stars column but no repo link.
 * Struck-through (~~) rows and rows with no matching repo (private) are left alone.
 * Updated columns, by header: Active/Activity/Status, Last Commit, Stars, Issues, Ratio.
 *
 * Usage: node scripts/apply_activity.js [--write]   (then: node scripts/sync_table_scores.js --write)
 */
const fs = require('fs');
const path = require('path');
const { splitRow, isSeparatorLine } = require('../frontend/src/lib/table-parse.js');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
  ['data/activity.json', ['data/tables/SOFTWARE_WALLETS.md', 'data/tables/SOFTWARE_WALLETS_DETAILS.md']],
  ['data/hardware-activity.json', ['data/tables/HARDWARE_WALLETS.md', 'data/tables/HARDWARE_WALLETS_DETAILS.md']],
];
const LABEL = { '✅': 'Active', '⚠️': 'Slow', '❌': 'Inactive' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_RE = /^[A-Z][a-z]{2} \d{1,2}, \d{4}/;
// A status token is a bare emoji, or an emoji plus an activity word (other labels such as "⚠️ Partial" are left alone).
const STATUS_RE = /^(✅|⚠️|❌|🔒)(\s*(Active|Slow|Inactive|Private)\b|\s*$)/;
// Repos whose status cells stay hand-kept (other columns still refresh). Give the reason.
const KEEP_STATUS = {
  'coinbase/coinbase-wallet-sdk': 'commits since the Jun 2025 release are docs; SDK superseded by Base Account SDK',
};

const fmtDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : null;
};
const num = (v) => (/^\d+$/.test(String(v)) ? Number(v) : null);

function loadEntries(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')).wallets || [];
}

/** Swap the leading status token, keeping its style (bare emoji or "emoji Label") and any note after it. */
function statusCell(old, emoji) {
  return old.replace(STATUS_RE, (_, _e, rest) => (rest.trim() ? `${emoji} ${LABEL[emoji]}` : emoji));
}

/** New cell values for one row, or null when the row has no match. */
function updateRow(cells, header, byRepo, byName) {
  const line = cells.join('|');
  if (cells[0].includes('~~')) return null;
  const repos = [...line.matchAll(/github\.com\/([\w.-]+\/[\w.-]+)/g)].map((m) => m[1].toLowerCase());
  const repo = repos.find((r) => byRepo.has(r));
  let w = repo && byRepo.get(repo);
  if (!w && repos.length === 0 && header.includes('Stars')) {
    const name = (/^\*\*([^*]+)\*\*/.exec(cells[0]) || [])[1];
    w = name && byName.get(name.trim());
  }
  if (!w) return null;
  const stars = num(w.stars);
  const issues = num(w.issues);
  const date = fmtDate(w.lastCommit);
  return cells.map((cell, i) => {
    const col = header[i];
    if (['Active', 'Activity', 'Status'].includes(col) && STATUS_RE.test(cell)) {
      return repo && KEEP_STATUS[repo] ? cell : statusCell(cell, w.status);
    }
    if (col === 'Last Commit' && date && DATE_RE.test(cell)) return cell.replace(DATE_RE, date);
    if (col === 'Stars' && stars !== null && cell !== '-') return stars.toLocaleString('en-US');
    if (col === 'Issues' && issues !== null && cell !== '-') return issues.toLocaleString('en-US');
    if (col === 'Ratio' && stars && issues !== null && cell !== '-') return `${((issues * 100) / stars).toFixed(1)}%`;
    return cell;
  });
}

/** Rewrite every table in `text`; returns { text, changed }. */
function applyToMarkdown(text, allEntries) {
  // Valid entries only: a known status emoji and a numeric daysAgo.
  const entries = allEntries.filter((w) => LABEL[w.status] && Number.isFinite(w.daysAgo));
  const byRepo = new Map(entries.map((w) => [String(w.repo).toLowerCase(), w]));
  const names = entries.map((w) => w.wallet);
  // Name join only for names that occur once (the hardware JSON repeats e.g. "Foundation Passport").
  const byName = new Map(entries.filter((w) => names.indexOf(w.wallet) === names.lastIndexOf(w.wallet)).map((w) => [w.wallet, w]));
  const lines = text.split('\n');
  let header = null;
  let changed = 0;
  lines.forEach((line, i) => {
    if (!line.trim().startsWith('|')) { header = null; return; }
    if (isSeparatorLine(line)) return;
    if (!header) { header = splitRow(line); return; }
    const cells = splitRow(line);
    const next = updateRow(cells, header, byRepo, byName);
    if (next && next.some((c, j) => c !== cells[j])) {
      lines[i] = `| ${next.join(' | ')} |`;
      changed += 1;
    }
  });
  return { text: lines.join('\n'), changed };
}

if (require.main === module) {
  const write = process.argv.includes('--write');
  for (const [json, docs] of TARGETS) {
    const entries = loadEntries(json);
    for (const doc of docs) {
      const file = path.join(ROOT, doc);
      const { text, changed } = applyToMarkdown(fs.readFileSync(file, 'utf8'), entries);
      console.log(`${doc}: ${changed} row(s) ${write ? 'updated' : 'would change'}`);
      if (write && changed) fs.writeFileSync(file, text);
    }
  }
}

module.exports = { applyToMarkdown, fmtDate };
