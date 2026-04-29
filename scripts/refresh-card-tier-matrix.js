#!/usr/bin/env node
/* eslint-disable no-console */

// SECURITY NOTE: extractDataset() uses vm.runInContext to evaluate a code snippet
// extracted via regex from the minified JS bundle at ccompare.cards. Node's vm module
// is NOT a security sandbox and can be escaped. This is an accepted risk for a
// local/scheduled data-refresh tool that runs with explicit intent. Do not run this
// script in a context where the upstream URL could be attacker-controlled, and do not
// grant it elevated secrets beyond what is needed for writing CRYPTO_CARDS_TIERS.md.
// Tracked for future replacement with a pure JSON/AST parser approach.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT = path.join(ROOT, 'CRYPTO_CARDS_TIERS.md');
const HOME_URL = 'https://ccompare.cards/';
const LAST_UPDATED_LINE_RE = /^\*\*Last Updated:\*\* .+$/m;
const DEFAULT_INCLUDE_KEYS = [
  'bleap',
  'deblock',
  'spritz',
  'pyra',
  'cypher',
  'rebind',
  'uglycash',
  'holyheld',
  'krak',
];

function usage() {
  console.log([
    'Usage: node scripts/refresh-card-tier-matrix.js [options]',
    '',
    'Options:',
    '  --write                 Write CRYPTO_CARDS_TIERS.md (default: true)',
    '  --dry-run               Print matrix to stdout, do not write file',
    '  --offline               Validate existing CRYPTO_CARDS_TIERS.md without fetching (CI-safe)',
    '  --out <path>            Output file path (default: CRYPTO_CARDS_TIERS.md)',
    '  --all                   Include all active cards from ccompare dataset',
    '  --include <keys>        Comma-separated card keys to include',
    '  --help                  Show this help',
    '',
    'Examples:',
    '  node scripts/refresh-card-tier-matrix.js',
    '  node scripts/refresh-card-tier-matrix.js --dry-run',
    '  node scripts/refresh-card-tier-matrix.js --offline',
    '  node scripts/refresh-card-tier-matrix.js --include bleap,deblock,krak',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = {
    write: true,
    dryRun: false,
    offline: false,
    all: false,
    out: DEFAULT_OUT,
    include: [...DEFAULT_INCLUDE_KEYS],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (token === '--dry-run') {
      args.dryRun = true;
      args.write = false;
      continue;
    }
    if (token === '--offline') {
      args.offline = true;
      args.write = false;
      continue;
    }
    if (token === '--write') {
      args.write = true;
      continue;
    }
    if (token === '--all') {
      args.all = true;
      continue;
    }
    if (token === '--out') {
      const next = argv[i + 1];
      if (!next) throw new Error('--out requires a value');
      args.out = path.isAbsolute(next) ? next : path.join(ROOT, next);
      i += 1;
      continue;
    }
    if (token === '--include') {
      const next = argv[i + 1];
      if (!next) throw new Error('--include requires a comma-separated value');
      args.include = next.split(',').map((value) => value.trim()).filter(Boolean);
      i += 1;
      continue;
    }
    throw new Error(`Unknown option: ${token}`);
  }

  return args;
}

function ensureAbsoluteUrl(base, next) {
  if (/^https?:\/\//i.test(next)) return next;
  if (next.startsWith('/')) {
    const url = new URL(base);
    return `${url.protocol}//${url.host}${next}`;
  }
  return new URL(next, base).toString();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function fetchText(url, redirects = 4) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'walletradar-tier-refresh/1.0',
      accept: 'text/html,application/javascript,*/*',
    },
    redirect: 'manual',
  });

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    if (redirects <= 0) throw new Error(`Too many redirects for ${url}`);
    const location = response.headers.get('location');
    if (!location) throw new Error(`Redirect without location for ${url}`);
    return fetchText(ensureAbsoluteUrl(url, location), redirects - 1);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }

  return response.text();
}

function parseBundleUrl(homeHtml) {
  const match = homeHtml.match(/\/assets\/index-[^"']+\.js/);
  if (!match) {
    throw new Error('Could not locate bundled script URL from ccompare.cards homepage');
  }
  return ensureAbsoluteUrl(HOME_URL, match[0]);
}

function extractDataset(bundle) {
  // Current bundles expose a "coming soon" list using Object.values(<datasetVar>).filter(...)
  // and keep the card data object in <datasetVar>={...}. We resolve that variable dynamically.
  const valuesMatch = /Object\.values\(([A-Za-z_$][A-Za-z0-9_$]*)\)\.filter\(e=>e\.tiers/.exec(bundle);
  if (!valuesMatch) {
    throw new Error('Could not locate ccompare dataset variable from bundle');
  }

  const datasetVar = valuesMatch[1];
  const escapedVar = escapeRegExp(datasetVar);
  const assignmentRegex = new RegExp(
    `${escapedVar}=\\{[\\s\\S]*?\\},[A-Za-z_$][A-Za-z0-9_$]*=Object\\.values\\(${escapedVar}\\)`
  );
  const assignmentMatch = assignmentRegex.exec(bundle);
  if (!assignmentMatch) {
    throw new Error(`Could not locate ${datasetVar} dataset payload in bundle`);
  }

  const suffixRegex = new RegExp(`,[A-Za-z_$][A-Za-z0-9_$]*=Object\\.values\\(${escapedVar}\\)$`);
  const snippet = assignmentMatch[0].replace(suffixRegex, '');
  const context = {};
  vm.createContext(context);
  const program = `var ${snippet};`;
  let evaluated = false;
  for (let i = 0; i < 25; i += 1) {
    try {
      vm.runInContext(program, context, { timeout: 15000 });
      evaluated = true;
      break;
    } catch (error) {
      const missing = /([A-Za-z_$][A-Za-z0-9_$]*) is not defined/.exec(error.message);
      if (!missing) throw error;
      context[missing[1]] = {};
    }
  }

  if (!evaluated) {
    throw new Error('Failed to evaluate ccompare dataset payload');
  }

  if (!context[datasetVar] || typeof context[datasetVar] !== 'object') {
    throw new Error('Failed to evaluate ccompare card dataset');
  }

  return context[datasetVar];
}

function normalizeFxFee(tier) {
  const value = String(tier.fxFee || 'N/A');
  if (/month\s*free/i.test(value) && /month\s*free/i.test(String(tier.atmFee || ''))) {
    return '0% (verify)';
  }
  return value;
}

function toTierRows(dataset, keys) {
  const rows = [];

  for (const key of keys) {
    const card = dataset[key];
    if (!card || !Array.isArray(card.tiers)) continue;

    card.tiers.forEach((tier, index) => {
      const tierName = String(tier.name || '').trim() || 'Standard';
      const countries = Array.isArray(tier.countries) ? tier.countries.length : 0;
      const source = tier.sourceUrl || card.tiers[0]?.sourceUrl || '';
      const atm = [tier.atmLimit, tier.atmFee].filter(Boolean).join(' ; ') || 'N/A';
      const cardForm = tier.cards || `${tier.physical || 'N/A'} / ${tier.virtual || 'N/A'}`;

      rows.push({
        card: card.name,
        tier: tierName,
        network: tier.network || 'N/A',
        kyc: tier.kyc || 'N/A',
        countries: `${countries} listed`,
        annualFee: tier.annualFee || 'N/A',
        issuanceFee: tier.issuanceFee || 'N/A',
        txFee: tier.txFee || 'N/A',
        fxFee: normalizeFxFee(tier),
        atm,
        conversionFee: tier.cryptoConversionFee || 'N/A',
        cashback: tier.cashback || 'N/A',
        cashbackCap: tier.cashbackCap || 'N/A',
        rewards: tier.cashbackCurrency || 'N/A',
        cardForm,
        appleGooglePay: tier.applePay || 'N/A',
        custody: tier.type || 'N/A',
        status: tier.status || 'N/A',
        source,
        _order: index,
      });
    });
  }

  rows.sort((a, b) => a.card.localeCompare(b.card) || a._order - b._order || a.tier.localeCompare(b.tier));
  return rows;
}

function clean(value) {
  return String(value || 'N/A').replace(/\|/g, '\\|');
}

function renderMarkdown(rows, { includeAll }) {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const lines = [];
  lines.push('# Crypto Card Tier Matrix');
  lines.push('');
  lines.push('Companion table for richer per-tier card data that does not fit cleanly in the main comparison table.');
  lines.push('');
  lines.push(
    includeAll
      ? 'Scope in this version: all active programs from `ccompare.cards`.'
      : 'Scope in this version: cards imported/refreshed from the April 23, 2026 `ccompare.cards` third review intake.'
  );
  lines.push('');
  lines.push('## Tier Dataset (Third Review Intake)');
  lines.push('');
  lines.push('| Card | Tier | Network | KYC | Countries | Annual Fee | Issuance | Tx Fee | FX Fee | ATM (Limit ; Fee) | Conversion Fee | Cashback | Cap | Rewards | Card Form | Apple/Google Pay | Custody | Status | Source |');
  lines.push('| ---- | ---- | ------- | --- | --------- | ---------- | -------- | ------ | ------ | ----------------- | -------------- | -------- | --- | ------- | --------- | ---------------- | ------- | ------ | ------ |');

  for (const row of rows) {
    const source = row.source ? `[source](${row.source})` : 'N/A';
    lines.push(
      `| ${clean(row.card)} | ${clean(row.tier)} | ${clean(row.network)} | ${clean(row.kyc)} | ${clean(row.countries)} | ${clean(row.annualFee)} | ${clean(row.issuanceFee)} | ${clean(row.txFee)} | ${clean(row.fxFee)} | ${clean(row.atm)} | ${clean(row.conversionFee)} | ${clean(row.cashback)} | ${clean(row.cashbackCap)} | ${clean(row.rewards)} | ${clean(row.cardForm)} | ${clean(row.appleGooglePay)} | ${clean(row.custody)} | ${clean(row.status)} | ${source} |`
    );
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- This matrix is a supplemental view; canonical ranking remains in `CRYPTO_CARDS.md`.');
  lines.push('- Tier and country data can change quickly; always verify on issuer terms pages.');
  lines.push('- Rows marked `Status = Active` are upstream claims from source material, not legal availability guarantees in every jurisdiction.');
  lines.push('');
  lines.push(`**Last Updated:** ${date}`);

  return `${lines.join('\n')}\n`;
}

function normalizeForMaterialDiff(content) {
  return content.replace(LAST_UPDATED_LINE_RE, '**Last Updated:** <normalized>');
}

function hasMaterialDiff(existing, next) {
  return normalizeForMaterialDiff(existing) !== normalizeForMaterialDiff(next);
}

const EXPECTED_COLUMNS = ['Card', 'Tier', 'Network', 'KYC', 'Countries', 'Status', 'Source'];

function offlineValidate(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`--offline: ${path.relative(ROOT, filePath)} does not exist. Run without --offline to generate it.`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  if (!content.includes('**Last Updated:**')) {
    throw new Error('--offline: missing "**Last Updated:**" line in tier matrix');
  }

  const headerLine = lines.find((line) => line.startsWith('|') && line.includes('Card') && line.includes('Tier'));
  if (!headerLine) {
    throw new Error('--offline: could not find table header row');
  }

  const headerCols = headerLine.split('|').map((col) => col.trim()).filter(Boolean);
  const missing = EXPECTED_COLUMNS.filter((col) => !headerCols.includes(col));
  if (missing.length > 0) {
    throw new Error(`--offline: missing expected columns: ${missing.join(', ')}`);
  }

  // Data rows are pipe-delimited lines that are NOT the header and NOT the separator (---|---).
  const headerIdx = lines.indexOf(headerLine);
  const sepIdx = lines.findIndex((l, i) => i > headerIdx && /^\|[\s|:-]+\|$/.test(l));
  const dataRows = lines.filter((_, i) => {
    if (i <= (sepIdx >= 0 ? sepIdx : headerIdx)) return false;
    return lines[i].startsWith('|') && !/^\|[\s|:-]+\|$/.test(lines[i]);
  });

  if (dataRows.length === 0) {
    throw new Error('--offline: tier matrix table has no data rows');
  }

  console.log([
    `offline validation passed: ${path.relative(ROOT, filePath)}`,
    `  columns: ${headerCols.length} (all ${EXPECTED_COLUMNS.length} required columns present)`,
    `  data rows: ~${dataRows.length}`,
  ].join('\n'));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  if (args.offline) {
    offlineValidate(args.out);
    return;
  }

  const homeHtml = await fetchText(HOME_URL);
  const bundleUrl = parseBundleUrl(homeHtml);
  const bundle = await fetchText(bundleUrl);
  const dataset = extractDataset(bundle);

  const includeKeys = args.all
    ? Object.entries(dataset)
        .filter(([, value]) => Array.isArray(value.tiers) && value.tiers.some((tier) => tier.status !== 'Coming Soon'))
        .map(([key]) => key)
    : args.include;

  const rows = toTierRows(dataset, includeKeys);
  const markdown = renderMarkdown(rows, { includeAll: args.all });
  let changed = null;

  if (args.dryRun) {
    process.stdout.write(markdown);
  } else if (args.write) {
    if (fs.existsSync(args.out)) {
      const existing = fs.readFileSync(args.out, 'utf8');
      changed = hasMaterialDiff(existing, markdown);
      if (changed) {
        fs.writeFileSync(args.out, markdown);
      }
    } else {
      changed = true;
      fs.writeFileSync(args.out, markdown);
    }
  }

  const writeResult = args.dryRun
    ? 'mode: dry-run'
    : changed === false
      ? `no material changes: ${path.relative(ROOT, args.out)}`
      : `wrote: ${path.relative(ROOT, args.out)}`;

  const summary = [
    `bundle: ${bundleUrl}`,
    `dataset cards: ${Object.keys(dataset).length}`,
    `included keys: ${includeKeys.length}`,
    `tier rows: ${rows.length}`,
    writeResult,
  ].join('\n');

  if (args.dryRun) {
    console.error(summary);
  } else {
    console.log(summary);
  }
}

main().catch((error) => {
  console.error(`refresh-card-tier-matrix failed: ${error.message}`);
  process.exit(1);
});
