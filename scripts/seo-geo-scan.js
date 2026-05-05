#!/usr/bin/env node

/**
 * SEO + GEO scan for Wallet Radar.
 *
 * Usage:
 *   node scripts/seo-geo-scan.js
 *   node scripts/seo-geo-scan.js --url https://walletradar.org
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { url: 'https://walletradar.org', timeoutMs: 20000 };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--url' && argv[i + 1]) {
      args.url = argv[i + 1].replace(/\/+$/, '');
      i += 1;
    } else if (arg === '--timeout' && argv[i + 1]) {
      args.timeoutMs = Number(argv[i + 1]) || args.timeoutMs;
      i += 1;
    }
  }
  return args;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'WalletRadar-SEO-GEO-Scan/1.0' },
    });
    const text = await res.text();
    return {
      ok: true,
      status: res.status,
      url: res.url,
      headers: Object.fromEntries(res.headers.entries()),
      text,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      url,
      headers: {},
      text: '',
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function getFirstMatch(text, regex) {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function analyzeHtmlPage(raw) {
  const title = getFirstMatch(raw, /<title[^>]*>([^<]*)<\/title>/i) || '';
  const description = getFirstMatch(raw, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || '';
  const canonical = getFirstMatch(raw, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || '';
  const lang = getFirstMatch(raw, /<html[^>]+lang=["']([^"']+)["']/i) || '';
  const ogLocale = getFirstMatch(raw, /<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']+)["']/i) || '';
  const h1Count = countMatches(raw, /<h1[\s>]/gi);
  const jsonLdCount = countMatches(raw, /application\/ld\+json/gi);
  const hreflangCount = countMatches(raw, /hreflang=/gi);
  const robots = getFirstMatch(raw, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) || '';
  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    lang,
    ogLocale,
    h1Count,
    jsonLdCount,
    hreflangCount,
    robots,
  };
}

function parsePrimaryTable(markdown) {
  const lines = markdown.split('\n');
  const headerIndex = lines.findIndex((line, index) => (
    line.trim().startsWith('|') &&
    index + 1 < lines.length &&
    /^\|[\s:|-]+\|$/.test(lines[index + 1].trim())
  ));
  if (headerIndex === -1) return { header: [], rows: [] };

  const header = lines[headerIndex]
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

  const rows = [];
  for (let i = headerIndex + 2; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break;
    const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
    if (cells.length === header.length) rows.push(cells);
  }
  return { header, rows };
}

function summarizeCounts(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function normalizeCardRegion(value) {
  const text = value.toLowerCase();
  if (text.includes('global')) return 'Global-ish';
  if (text.includes('us/eu')) return 'US+EU';
  if (text.includes('eu') || text.includes('eea') || text.includes('uk')) return 'EU/UK-ish';
  if (text.includes('us')) return 'US-only-ish';
  if (text.includes('brazil')) return 'Brazil';
  if (text.includes('latam') || text.includes('africa')) return 'LATAM/Africa';
  if (text.includes('au')) return 'Australia';
  if (text.includes('ca')) return 'Canada';
  return 'Other';
}

function formatTop(items, top = 8) {
  return items.slice(0, top).map((item) => `- ${item.label}: ${item.count}`).join('\n');
}

function getRootDir() {
  return path.resolve(__dirname, '..');
}

async function run() {
  const args = parseArgs(process.argv);
  const now = new Date().toISOString();
  const baseUrl = args.url.replace(/\/+$/, '');

  const pages = [
    '/',
    '/explore/',
    '/articles/',
    '/docs/',
    '/docs/crypto-cards/',
    '/docs/ramps/',
    '/docs/competitor-tracker/',
    '/docs/crypto-cards-tiers/',
    '/docs/affiliate-targets/',
  ];

  const pageChecks = [];
  for (const page of pages) {
    const result = await fetchWithTimeout(`${baseUrl}${page}`, args.timeoutMs);
    const seo = result.ok && result.status === 200 ? analyzeHtmlPage(result.text) : null;
    pageChecks.push({ page, result, seo });
  }

  const robots = await fetchWithTimeout(`${baseUrl}/robots.txt`, args.timeoutMs);
  const sitemap = await fetchWithTimeout(`${baseUrl}/sitemap.xml`, args.timeoutMs);
  const sitemapUrlCount = sitemap.ok ? countMatches(sitemap.text, /<url>/g) : 0;

  const rootDir = getRootDir();
  const cardsPath = path.join(rootDir, 'CRYPTO_CARDS.md');
  const rampsPath = path.join(rootDir, 'RAMPS.md');
  const cardsMd = fs.readFileSync(cardsPath, 'utf8');
  const rampsMd = fs.readFileSync(rampsPath, 'utf8');

  const cardsTable = parsePrimaryTable(cardsMd);
  const rampsTable = parsePrimaryTable(rampsMd);
  const cardsRegionIndex = cardsTable.header.indexOf('Region');
  const rampsCoverageIndex = rampsTable.header.indexOf('Coverage');

  const cardRegions = cardsRegionIndex >= 0
    ? cardsTable.rows.map((row) => row[cardsRegionIndex] || '').filter(Boolean)
    : [];
  const rampCoverage = rampsCoverageIndex >= 0
    ? rampsTable.rows.map((row) => row[rampsCoverageIndex] || '').filter(Boolean)
    : [];

  const regionSummary = summarizeCounts(cardRegions);
  const normalizedRegionSummary = summarizeCounts(cardRegions.map(normalizeCardRegion));
  const rampCoverageSummary = summarizeCounts(rampCoverage);

  const non200Pages = pageChecks.filter((p) => p.result.status !== 200);
  const missingCanonical = pageChecks.filter((p) => p.seo && !p.seo.canonical);
  const missingDescription = pageChecks.filter((p) => p.seo && p.seo.descriptionLength < 70);
  const missingLang = pageChecks.filter((p) => p.seo && !p.seo.lang);
  const noJsonLd = pageChecks.filter((p) => p.seo && p.seo.jsonLdCount === 0);
  const noHreflang = pageChecks.filter((p) => p.seo && p.seo.hreflangCount === 0);

  let report = '';
  report += `# SEO + GEO Scan\n\n`;
  report += `- Scanned At: ${now}\n`;
  report += `- Base URL: ${baseUrl}\n`;
  report += `- Scanner: \`scripts/seo-geo-scan.js\`\n\n`;

  report += `## HTTP + Crawlability\n\n`;
  report += `| Page | Status | Title | Canonical | JSON-LD |\n`;
  report += `| ---- | ------ | ----- | --------- | ------- |\n`;
  pageChecks.forEach(({ page, result, seo }) => {
    const title = seo ? (seo.titleLength > 0 ? `${seo.titleLength} chars` : 'missing') : 'n/a';
    const canonical = seo ? (seo.canonical ? 'yes' : 'missing') : 'n/a';
    const jsonLd = seo ? String(seo.jsonLdCount) : 'n/a';
    report += `| ${page} | ${result.status ?? 'ERR'} | ${title} | ${canonical} | ${jsonLd} |\n`;
  });
  report += '\n';

  report += `## Indexing Signals\n\n`;
  if (robots.ok) {
    const robotsHasSitemap = /sitemap:/i.test(robots.text);
    report += `- robots.txt: ${robots.status} (${robotsHasSitemap ? 'contains sitemap entries' : 'missing sitemap entries'})\n`;
  } else {
    report += `- robots.txt: fetch failed (${robots.error || 'unknown error'})\n`;
  }
  if (sitemap.ok) {
    report += `- sitemap.xml: ${sitemap.status} with ${sitemapUrlCount} URLs\n`;
  } else {
    report += `- sitemap.xml: fetch failed (${sitemap.error || 'unknown error'})\n`;
  }
  report += '\n';

  report += `## GEO Coverage Signals (Dataset)\n\n`;
  report += `### Crypto Cards Region Labels (${cardRegions.length} rows)\n\n`;
  report += `${formatTop(regionSummary)}\n\n`;
  report += `### Crypto Cards Region Buckets\n\n`;
  report += `${formatTop(normalizedRegionSummary)}\n\n`;
  report += `### Ramps Coverage Labels (${rampCoverage.length} rows)\n\n`;
  report += `${formatTop(rampCoverageSummary)}\n\n`;

  report += `## Flags\n\n`;
  if (non200Pages.length === 0) {
    report += `- No non-200 pages in the checked SEO path set.\n`;
  } else {
    non200Pages.forEach((entry) => {
      report += `- ${entry.page} returned ${entry.result.status ?? 'ERR'}\n`;
    });
  }
  if (missingCanonical.length > 0) {
    missingCanonical.forEach((entry) => {
      report += `- ${entry.page} missing canonical link\n`;
    });
  }
  if (missingDescription.length > 0) {
    missingDescription.forEach((entry) => {
      report += `- ${entry.page} meta description is short (${entry.seo.descriptionLength} chars)\n`;
    });
  }
  if (missingLang.length > 0) {
    missingLang.forEach((entry) => {
      report += `- ${entry.page} missing <html lang>\n`;
    });
  }
  if (noJsonLd.length > 0) {
    noJsonLd.forEach((entry) => {
      report += `- ${entry.page} has no JSON-LD schema block\n`;
    });
  }
  if (noHreflang.length > 0) {
    report += `- Hreflang tags are absent on checked pages (${noHreflang.length}/${pageChecks.filter((p) => p.seo).length})\n`;
  }
  report += '\n';

  report += `## Recommended Next Actions\n\n`;
  report += `1. Deploy any docs that still return 404 in production (especially competitor/affiliate intelligence pages).\n`;
  report += `2. Add locale alternates (hreflang) if multi-region SEO becomes a priority.\n`;
  report += `3. Re-run this scan after each deployment and track deltas in CI artifacts.\n`;

  process.stdout.write(report);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
