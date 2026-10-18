#!/usr/bin/env node
/**
 * OG Image Generator for Wallet Radar
 * 
 * Generates page-specific Open Graph images for social sharing.
 * Images are 1200x630 pixels (Twitter/OG standard).
 * 
 * Usage: bun run generate-og
 */

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const { splitRow, parseTable, stripMarkdown } = require('../src/lib/table-parse.js');

const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || 'Wallet Radar';
const BRAND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://walletradar.org';
const BRAND_DOMAIN = (() => {
  try {
    return new URL(BRAND_BASE_URL).host;
  } catch {
    return 'walletradar.org';
  }
})();

// Configuration
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(__dirname, '../public');

// Colors (matching Wallet Radar theme)
const COLORS = {
  primary: '#3b82f6',      // Blue
  primaryDark: '#1d4ed8',  // Darker blue
  background: '#0f172a',   // Dark slate
  backgroundAlt: '#1e293b', // Slightly lighter
  text: '#ffffff',
  textMuted: '#94a3b8',
  accent: '#22c55e',       // Green for scores
  accentYellow: '#eab308', // Yellow
  border: '#334155',
};

// Wallet data for the images
// Every number and name below is read from the markdown tables in data/tables
// (SOFTWARE_WALLETS.md, HARDWARE_WALLETS.md, CRYPTO_CARDS.md, RAMPS.md, QR_PAYMENTS.md).
// Nothing is typed in, so a score or price change in a table shows up on the next run.
const ROOT_DIR = path.join(__dirname, '../..');
const TABLES_DIR = path.join(ROOT_DIR, 'data', 'tables');

/** First pipe table of a data/tables markdown file -> [{ ...cells by header, _struck }] */
function loadTable(file) {
  const lines = fs.readFileSync(path.join(TABLES_DIR, file), 'utf8').split('\n');
  const start = lines.findIndex((l) => l.startsWith('| ') && l.includes('Score'));
  if (start < 0) throw new Error(`No table with a Score column in ${file}`);
  const { header: headers, rows: raws } = parseTable(lines, start);
  const rows = [];
  for (const raw of raws) {
    if (raw.length !== headers.length) continue;
    const row = { _struck: raw[0].includes('~~') };
    headers.forEach((h, idx) => { row[h] = stripMarkdown(raw[idx]); });
    row.score = parseInt(row.Score, 10);
    rows.push(row);
  }
  return rows;
}

/** Active rows (not struck through), best score first. Ties keep table order. */
function ranked(file, nameKey) {
  return loadTable(file)
    .filter((r) => !r._struck && Number.isFinite(r.score))
    .map((r, i) => ({ r, i }))
    .sort((x, y) => y.r.score - x.r.score || x.i - y.i)
    .map(({ r }) => ({ ...r, name: r[nameKey] }));
}

/** Region cell without its leading flag/globe emoji token (only a non-ASCII first token is dropped). */
function regionText(value) {
  return String(value).replace(/^[^\x00-\x7F]+\s*/, '');
}

function clip(value, max = 16) {
  const text = String(value || '-').replace(/\s*\([^)]*\)/g, '').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Drop emoji and symbols the canvas font cannot draw. */
function plain(value) {
  return String(value).replace(/[^\x20-\x7E]+/g, '').replace(/\s+/g, ' ').trim();
}

const SOFTWARE_ROWS = ranked('SOFTWARE_WALLETS.md', 'Wallet');
const HARDWARE_ROWS = ranked('HARDWARE_WALLETS.md', 'Wallet');
const CARD_ROWS = ranked('CRYPTO_CARDS.md', 'Card');
const RAMP_ROWS = ranked('RAMPS.md', 'Provider');
const QR_ROWS = ranked('QR_PAYMENTS.md', 'Provider');

/** Lowest exact USD price in the Price column (ranges and starred estimates are skipped), e.g. "$59+". */
/** Largest "N+" or "~N+" country count in the Coverage column, e.g. "~170+". */
function maxCountries(rows) {
  let best = null;
  rows.forEach((r) => {
    const m = /(~?)(\d+)\+/.exec(r.Coverage);
    if (m && (!best || Number(m[2]) > best.n)) best = { n: Number(m[2]), text: `${m[1]}${m[2]}+` };
  });
  return best ? best.text : 'n/a';
}

function lowestUsdPrice(rows) {
  const prices = rows
    .map((r) => /^~?\$([\d,]+)$/.exec(r.Price))
    .filter(Boolean)
    .map((m) => parseFloat(m[1].replace(/,/g, '')));
  return prices.length ? `$${Math.min(...prices)}+` : 'n/a';
}

const WALLET_DATA = {
  software: SOFTWARE_ROWS.slice(0, 5).map((r) => ({
    name: r.name, score: r.score, license: clip(plain(r.License)), funding: clip(plain(r.Funding)), status: r.Rec,
  })),
  hardware: HARDWARE_ROWS.slice(0, 5).map((r) => ({
    name: r.name, score: r.score, price: clip(r.Price.replace(/[‡†*]+/g, '')), security: clip(r['Secure Elem'].replace(/^✅ /, '')), status: r.Rec,
  })),
  cards: CARD_ROWS.slice(0, 5).map((r) => ({
    name: r.name, score: r.score, cashback: clip(r['Cash Back']), type: r.Type, region: clip(regionText(r.Region)), status: r.Rec,
  })),
  ramps: RAMP_ROWS.slice(0, 5).map((r) => ({
    name: r.name, score: r.score, type: r.Type, coverage: clip(r.Coverage), devUx: clip(r['Dev UX']), status: r.Rec,
  })),
  qrPayments: QR_ROWS.slice(0, 5).map((r) => ({
    name: r.name, score: r.score, type: r.Type, feeModel: clip(r['Fee Model']), devUx: clip(r['Dev UX']), status: r.Score.replace(/^\d+\s*/, '') || r.Status,
  })),
};

/**
 * Draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draw the Wallet Radar logo/branding
 */
function drawBranding(ctx) {
  // Logo area (left side)
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText(`📡 ${BRAND_NAME}`, 50, 55);
  
  // Tagline
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Developer-Focused Crypto Wallet Research', 50, 85);
}

/**
 * Draw a data table
 */
// Canvas fonts draw the status emoji grey or blank, so draw coloured dots instead.
const STATUS_COLORS = {
  '🟢': '#22c55e', '✅': '#22c55e', '🟡': '#eab308', '⚠️': '#eab308', '🔴': '#f87171', '❌': '#f87171', '⚪': '#e2e8f0',
};

function drawTable(ctx, headers, data, startY) {
  const startX = 50;
  const rowHeight = 50;
  const colWidths = headers.map((_, i) => {
    if (i === 0) return 220; // Name column
    return 140; // Other columns
  });
  
  // Table background
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableHeight = (data.length + 1) * rowHeight + 20;
  
  ctx.fillStyle = COLORS.backgroundAlt;
  roundRect(ctx, startX - 15, startY - 15, tableWidth + 30, tableHeight, 12);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  roundRect(ctx, startX - 15, startY - 15, tableWidth + 30, tableHeight, 12);
  ctx.stroke();
  
  // Header row
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = 'bold 16px Arial, sans-serif';
  let x = startX;
  headers.forEach((header, i) => {
    ctx.fillText(header, x, startY + 20);
    x += colWidths[i];
  });
  
  // Header separator
  ctx.strokeStyle = COLORS.border;
  ctx.beginPath();
  ctx.moveTo(startX - 10, startY + 35);
  ctx.lineTo(startX + tableWidth + 10, startY + 35);
  ctx.stroke();
  
  // Data rows
  ctx.font = '18px Arial, sans-serif';
  data.forEach((row, rowIndex) => {
    const y = startY + 70 + rowIndex * rowHeight;
    x = startX;
    
    Object.values(row).forEach((value, colIndex) => {
      // Special styling for score column
      if (colIndex === 1 && typeof value === 'number') {
        // Score with color coding
        if (value >= 90) {
          ctx.fillStyle = COLORS.accent;
        } else if (value >= 80) {
          ctx.fillStyle = '#22d3ee'; // Cyan
        } else if (value >= 70) {
          ctx.fillStyle = COLORS.accentYellow;
        } else {
          ctx.fillStyle = '#f87171'; // Red
        }
        ctx.font = 'bold 18px Arial, sans-serif';
      } else if (colIndex === 0) {
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 18px Arial, sans-serif';
      } else {
        ctx.fillStyle = COLORS.textMuted;
        ctx.font = '16px Arial, sans-serif';
      }
      
      if (headers[colIndex] === 'Status') {
        const dot = STATUS_COLORS[String(value).trim()];
        if (dot) {
          ctx.fillStyle = dot;
          ctx.beginPath();
          ctx.arc(x + 8, y - 6, 7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillText('-', x, y);
        }
      } else {
        ctx.fillText(String(value), x, y);
      }
      x += colWidths[colIndex];
    });
  });
}

/**
 * Draw footer with stats
 */
function drawFooter(ctx, stats) {
  const y = HEIGHT - 50;
  
  // Footer background
  ctx.fillStyle = COLORS.backgroundAlt;
  ctx.fillRect(0, y - 30, WIDTH, 80);
  
  // Stats
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '16px Arial, sans-serif';
  
  let x = 50;
  stats.forEach((stat, i) => {
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(stat.value, x, y + 5);
    
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(stat.label, x, y + 25);
    
    x += 200;
  });
  
  // URL
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillText(BRAND_DOMAIN, WIDTH - 200, y + 15);
}

/**
 * Generate Software Wallets OG Image
 */
function generateSoftwareWalletsImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, COLORS.background);
  gradient.addColorStop(1, '#0c1929');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Branding
  drawBranding(ctx);
  
  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('Software Wallet Comparison', 50, 160);
  
  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('EVM wallets scored on security, activity & developer experience', 50, 195);
  
  // Table
  const headers = ['Wallet', 'Score', 'License', 'Funding', 'Status'];
  drawTable(ctx, headers, WALLET_DATA.software, 230);
  
  // Footer
  drawFooter(ctx, [
    { value: String(SOFTWARE_ROWS.length), label: 'Wallets Scored' },
    { value: SOFTWARE_ROWS[0].name, label: `Top Pick (Score: ${SOFTWARE_ROWS[0].score})` },
    { value: 'Weekly', label: 'Data Updates' },
  ]);
  
  return canvas;
}

/**
 * Generate Hardware Wallets OG Image
 */
function generateHardwareWalletsImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Branding
  drawBranding(ctx);
  
  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('Hardware Wallet Comparison', 50, 160);
  
  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('Cold storage devices reviewed for security & open source firmware', 50, 195);
  
  // Table
  const headers = ['Wallet', 'Score', 'Price', 'Security', 'Status'];
  drawTable(ctx, headers, WALLET_DATA.hardware, 230);
  
  // Footer
  drawFooter(ctx, [
    { value: String(HARDWARE_ROWS.length), label: 'Devices Scored' },
    { value: HARDWARE_ROWS[0].name, label: `Top Pick (Score: ${HARDWARE_ROWS[0].score})` },
    { value: lowestUsdPrice(HARDWARE_ROWS), label: 'Lowest USD Price' },
  ]);
  
  return canvas;
}

/**
 * Generate Crypto Cards OG Image
 */
function generateCryptoCardsImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#14532d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Branding
  drawBranding(ctx);
  
  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('Crypto Credit Card Comparison', 50, 160);
  
  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('Crypto debit & credit cards compared for rewards & availability', 50, 195);
  
  // Table
  const headers = ['Card', 'Score', 'Cashback', 'Type', 'Region', 'Status'];
  drawTable(ctx, headers, WALLET_DATA.cards, 230);
  
  // Footer
  drawFooter(ctx, [
    { value: String(CARD_ROWS.length), label: 'Cards Scored' },
    { value: CARD_ROWS[0].name, label: `Top Pick (Score: ${CARD_ROWS[0].score})` },
    { value: clip(regionText(CARD_ROWS[0].Region), 14), label: 'Top Pick Region' },
  ]);
  
  return canvas;
}

/**
 * Generate default/homepage OG Image
 */
function generateDefaultImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, COLORS.primary);
  gradient.addColorStop(1, COLORS.primaryDark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Center content
  ctx.textAlign = 'center';
  
  // Logo/Icon
  ctx.font = '72px Arial';
  ctx.fillText('📡', WIDTH / 2, HEIGHT / 2 - 100);
  
  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 64px Arial, sans-serif';
  ctx.fillText(BRAND_NAME, WIDTH / 2, HEIGHT / 2);
  
  // Tagline
  ctx.font = '28px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('Developer-Focused Crypto Wallet Research', WIDTH / 2, HEIGHT / 2 + 55);
  
  // Stats row
  ctx.font = '20px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Software Wallets  •  Hardware Wallets  •  Crypto Cards', WIDTH / 2, HEIGHT / 2 + 120);
  
  // URL
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.fillText(BRAND_DOMAIN, WIDTH / 2, HEIGHT - 50);
  
  ctx.textAlign = 'left';
  
  return canvas;
}

/**
 * Save canvas to PNG file
 */
function saveCanvas(canvas, filename) {
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Generated: ${filepath}`);
}

/**
 * Generate Ramps OG Image (Table)
 */
function generateRampsImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Branding
  drawBranding(ctx);
  
  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('Crypto On/Off-Ramp Comparison', 50, 160);
  
  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('Providers scored on coverage, fees & developer experience', 50, 195);
  
  // Table
  const headers = ['Provider', 'Score', 'Type', 'Coverage', 'Dev UX'];
  const rampTableData = WALLET_DATA.ramps.map(r => [
    r.name,
    r.score.toString(),
    r.type,
    r.coverage,
    r.devUx,
  ]);
  drawTable(ctx, headers, rampTableData, 230);
  
  // Footer
  drawFooter(ctx, [
    { value: 'Compared', label: 'Providers' },
    { value: maxCountries(RAMP_ROWS), label: 'Most Countries Listed' },
    { value: 'Global', label: 'Coverage' },
  ]);
  
  return canvas;
}

/**
 * Generate QR Payments OG Image (Table)
 */
function generateQRPaymentsImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient (unique indigo for QR payments)
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#312e81');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Branding
  drawBranding(ctx);

  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('QR Payment Crypto Providers', 50, 160);

  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText(`${QR_ROWS.length} providers scored on fees, coverage & developer experience`, 50, 195);

  // Table
  const headers = ['Provider', 'Score', 'Type', 'Fee', 'Dev UX'];
  const qrTableData = WALLET_DATA.qrPayments.map(p => [
    p.name,
    p.score.toString(),
    p.type,
    p.feeModel,
    p.devUx,
  ]);
  drawTable(ctx, headers, qrTableData, 230);

  // Footer
  drawFooter(ctx, [
    { value: String(QR_ROWS.length), label: 'Providers Scored' },
    { value: QR_ROWS[0].name, label: `Top Pick (Score: ${QR_ROWS[0].score})` },
    { value: 'Global', label: 'Coverage' },
  ]);

  return canvas;
}

/**
 * Generate Explore Page OG Image
 * Shows the interactive comparison tool feature
 */
function generateExploreImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background gradient (unique purple-blue for explore)
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.5, '#1e1b4b');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Branding
  drawBranding(ctx);

  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.fillText('Explore & Compare', 50, 170);

  // Subtitle
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '22px Arial, sans-serif';
  ctx.fillText('Filter, sort, and compare wallets side-by-side', 50, 210);

  // Feature cards section
  const startY = 270;
  const cardWidth = 210;
  const cardHeight = 160;
  const cardGap = 15;

  // Feature cards data
  const features = [
    {
      icon: '💻',
      title: 'Software Wallets',
      count: 'Compared',
      desc: 'Browser & mobile wallets',
    },
    {
      icon: '🔐',
      title: 'Hardware Wallets',
      count: 'Compared',
      desc: 'Cold storage devices',
    },
    {
      icon: '💳',
      title: 'Crypto Cards',
      count: 'Compared',
      desc: 'Debit & credit cards',
    },
    {
      icon: '🔄',
      title: 'Ramps',
      count: 'Compared',
      desc: 'On/off-ramp providers',
    },
    {
      icon: '📱',
      title: 'QR Payments',
      count: 'Compared',
      desc: 'QR payment providers',
    },
  ];

  features.forEach((feature, i) => {
    const x = 50 + i * (cardWidth + cardGap);
    const y = startY;

    // Card background
    ctx.fillStyle = COLORS.backgroundAlt;
    roundRect(ctx, x, y, cardWidth, cardHeight, 12);
    ctx.fill();

    // Card border
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, cardWidth, cardHeight, 12);
    ctx.stroke();

    // Icon
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText(feature.icon, x + 20, y + 50);

    // Title
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(feature.title, x + 75, y + 45);

    // Count
    ctx.fillStyle = COLORS.accent;
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText(feature.count, x + 20, y + 105);

    // Description
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(feature.desc, x + 20, y + 135);
  });

  // Interactive features row
  const featuresY = startY + cardHeight + 50;
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText('🔍 Advanced Filtering', 50, featuresY);
  ctx.fillText('📊 Multi-Wallet Compare', 380, featuresY);
  ctx.fillText('⚡ Real-time Chain Data', 710, featuresY);

  // Footer
  drawFooter(ctx, [
    { value: 'All Options', label: 'Total' },
    { value: 'Side-by-Side', label: 'Comparison' },
    { value: 'Live TVL', label: 'DeFiLlama Data' },
  ]);

  return canvas;
}

/**
 * Generate the "How Wallet Radar works" article image.
 * The numbers are computed from SOFTWARE_WALLETS.md with the real scoring code, not typed in.
 */
function generateHowItWorksImage() {
  const { computeSoftwareScore } = require('../src/lib/scoring.js');
  const tablePath = path.join(__dirname, '../../data/tables/SOFTWARE_WALLETS.md');
  const row = fs.readFileSync(tablePath, 'utf8').split('\n').find((line) => line.includes('**Rabby**'));
  if (!row) throw new Error('Rabby row not found in SOFTWARE_WALLETS.md');
  const cells = splitRow(row);
  const info = computeSoftwareScore(cells);

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawBranding(ctx);

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 54px Arial, sans-serif';
  ctx.fillText('How Wallet Radar works', 50, 170);

  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText('Where the data comes from, how scores are computed,', 50, 215);
  ctx.fillText('and how to read the tables.', 50, 249);

  // Panel with one worked example
  const panelX = 50;
  const panelY = 290;
  const panelW = 1100;
  const panelH = 230;
  ctx.fillStyle = COLORS.backgroundAlt;
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.fill();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillText(`Rabby: ${info.score} / 100`, panelX + 30, panelY + 50);
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Computed from the visible table cells by the scoring code', panelX + 330, panelY + 48);

  const colW = 350;
  info.breakdown.forEach((entry, i) => {
    const col = i % 3;
    const rowIdx = Math.floor(i / 3);
    const x = panelX + 30 + col * (colW + 10);
    const y = panelY + 95 + rowIdx * 70;
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(entry.label, x, y);
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 16px Arial, sans-serif';
    const label = `${entry.score}/${entry.max}`;
    ctx.fillText(label, x + colW - 40 - ctx.measureText(label).width, y);
    ctx.fillStyle = COLORS.border;
    roundRect(ctx, x, y + 12, colW - 40, 8, 4);
    ctx.fill();
    ctx.fillStyle = COLORS.primary;
    roundRect(ctx, x, y + 12, Math.max(8, (colW - 40) * (entry.score / entry.max)), 8, 4);
    ctx.fill();
  });

  drawFooter(ctx, [
    { value: 'Sourced', label: 'Data' },
    { value: '0-100', label: 'Scores by script' },
    { value: 'Shareable', label: 'URL state' },
  ]);

  return canvas;
}

/**
 * Main execution
 */
async function main() {
  if (process.argv.includes('--only=how-wallet-radar-works')) {
    const articleDir = path.join(OUTPUT_DIR, 'og', 'articles');
    fs.mkdirSync(articleDir, { recursive: true });
    saveCanvas(generateHowItWorksImage(), 'og/articles/how-wallet-radar-works.png');
    return;
  }

  console.log(`🎨 Generating OG Images for ${BRAND_NAME}...\\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate all images (table images, explore, home, articles)
  console.log('📊 Generating table comparison images...');
  saveCanvas(generateSoftwareWalletsImage(), 'og-software-wallets-table.png');
  saveCanvas(generateHardwareWalletsImage(), 'og-hardware-wallets-table.png');
  saveCanvas(generateCryptoCardsImage(), 'og-crypto-cards-table.png');
  saveCanvas(generateRampsImage(), 'og-ramps-table.png');
  saveCanvas(generateQRPaymentsImage(), 'og-qr-payments-table.png');

  console.log('\n📰 Generating article images...');
  saveCanvas(generateHowItWorksImage(), 'og/articles/how-wallet-radar-works.png');

  console.log('\n🔍 Generating explore page image...');
  saveCanvas(generateExploreImage(), 'og-explore.png');

  // Only generate default image if it doesn't exist or --force flag is passed
  console.log('\n🏠 Checking default homepage image...');
  const defaultImagePath = path.join(OUTPUT_DIR, 'og-image.png');
  if (!fs.existsSync(defaultImagePath) || process.argv.includes('--force')) {
    saveCanvas(generateDefaultImage(), 'og-image.png');
  } else {
    console.log('⏭️  Skipped: og-image.png (already exists, use --force to regenerate)');
  }

  console.log('\n✨ All OG images generated successfully!');
  console.log('\nGenerated files:');
  console.log('  📊 Table pages: og-{software-wallets,hardware-wallets,crypto-cards}-table.png');
  console.log('  🔍 Explore page: og-explore.png');
  console.log('  🏠 Homepage: og-image.png');
  console.log('\nNext steps:');
  console.log('1. Review the generated images in /public/');
  console.log('2. Update seo.ts to map table pages to correct images');
  console.log('3. Test with Twitter Card Validator: https://cards-dev.twitter.com/validator');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
