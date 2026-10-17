#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const {
  SCORING_METHODOLOGY_VERSION,
  computeSoftwareScore,
  computeHardwareScore,
  computeCardScore,
  computeRampScore,
  assignRecommendationBands,
  recommendationEmoji,
} = require('../frontend/src/lib/scoring.js');

const ROOT = path.resolve(__dirname, '..');

const TABLE_CONFIGS = [
  {
    label: 'software',
    file: path.join(ROOT, 'SOFTWARE_WALLETS.md'),
    header: '| Wallet | Score | Core | Rel/Mo | RPC | GitHub | Active | Chains | Devices | Testnets | License | API | Audits | Funding | Tx Sim | Scam | Account | ENS/Naming | HW | Best For | Rec |',
    compute: computeSoftwareScore,
    formatScore: (scoreInfo) => String(scoreInfo.score),
    updateCells: (cells, scoreInfo) => {
      cells[1] = String(scoreInfo.score);
      cells[20] = recommendationEmoji(scoreInfo.recommendation);
      return cells;
    },
  },
  {
    label: 'hardware',
    file: path.join(ROOT, 'HARDWARE_WALLETS.md'),
    header: '| Wallet | Score | GitHub | Air-Gap | Open Source | Secure Elem | Display | Price | Conn | Activity | Founded | Funding | Rec |',
    compute: computeHardwareScore,
    formatScore: (scoreInfo) => String(scoreInfo.score),
    updateCells: (cells, scoreInfo) => {
      cells[1] = String(scoreInfo.score);
      cells[12] = recommendationEmoji(scoreInfo.recommendation);
      return cells;
    },
  },
  {
    label: 'cards',
    file: path.join(ROOT, 'CRYPTO_CARDS.md'),
    header: '| Card | Score | Type | Custody | Biz | Region | Cash Back | Annual Fee | FX Fee | Rewards | Status | Best For | Rec |',
    separator: '| ---- | ----- | ---- | ------- | --- | ------ | --------- | ---------- | ------ | ------- | ------ | -------- | --- |',
    legacyHeaders: [
      '| Card | Score | Type | Custody | Biz | Region | Cash Back | Annual Fee | FX Fee | Rewards | Status | Best For |',
    ],
    compute: computeCardScore,
    formatScore: (scoreInfo) => String(scoreInfo.score),
    updateCells: (cells, scoreInfo) => {
      while (cells.length < 13) cells.push('');
      cells[1] = String(scoreInfo.score);
      cells[12] = recommendationEmoji(scoreInfo.recommendation);
      return cells;
    },
  },
  {
    label: 'ramps',
    file: path.join(ROOT, 'RAMPS.md'),
    header: '| Provider | Score | Type | On-Ramp | Off-Ramp | Coverage | Fee Model | Min Fee | Dev UX | Status | Founded | Funding | Best For | Rec |',
    separator: '| -------- | ----- | ---- | ------- | -------- | -------- | --------- | ------- | ------ | ------ | ------- | ------- | -------- | --- |',
    legacyHeaders: [
      '| Provider | Score | Type | On-Ramp | Off-Ramp | Coverage | Fee Model | Min Fee | Dev UX | Status | Founded | Funding | Best For |',
    ],
    compute: computeRampScore,
    formatScore: (scoreInfo) => String(scoreInfo.score),
    updateCells: (cells, scoreInfo) => {
      while (cells.length < 14) cells.push('');
      cells[1] = String(scoreInfo.score);
      cells[13] = recommendationEmoji(scoreInfo.recommendation);
      return cells;
    },
  },
];

const DETAIL_SNAPSHOT_CONFIGS = {
  software: {
    file: path.join(ROOT, 'SOFTWARE_WALLETS_DETAILS.md'),
    startMarker: '<!-- GENERATED_SOFTWARE_SNAPSHOT_START -->',
    endMarker: '<!-- GENERATED_SOFTWARE_SNAPSHOT_END -->',
    build(rows) {
      const topRows = rows.slice(0, 5);
      const summary = joinSummaryItems(
        topRows.slice(0, 4).map((row) => (
          `${extractName(row.cells[0])} (${row.score}, ${row.cells[19]}, ${recommendationEmoji(row.scoreInfo.recommendation)})`
        ))
      );

      return [
        this.startMarker,
        `> **Current generated snapshot:** ${summary}. Regenerated from [SOFTWARE_WALLETS.md](./SOFTWARE_WALLETS.md) by \`scripts/sync_table_scores.js\` using methodology \`${SCORING_METHODOLOGY_VERSION}\`.`,
        '',
        '### Current Top Rows (generated)',
        '| Rank | Wallet | Score | Best For | Rec |',
        '| ---- | ------ | ----- | -------- | --- |',
        ...topRows.map((row, index) => (
          `| ${index + 1} | **${extractName(row.cells[0])}** | ${row.score} | ${row.cells[19]} | ${recommendationEmoji(row.scoreInfo.recommendation)} |`
        )),
        this.endMarker,
      ].join('\n');
    },
  },
  hardware: {
    file: path.join(ROOT, 'HARDWARE_WALLETS_DETAILS.md'),
    startMarker: '<!-- GENERATED_HARDWARE_SNAPSHOT_START -->',
    endMarker: '<!-- GENERATED_HARDWARE_SNAPSHOT_END -->',
    build(rows) {
      const topRows = rows.slice(0, 5);
      const summary = joinSummaryItems(
        topRows.slice(0, 4).map((row) => (
          `${extractName(row.cells[0])} (${row.score}, ${row.cells[9]}, ${recommendationEmoji(row.scoreInfo.recommendation)})`
        ))
      );

      return [
        this.startMarker,
        `> **Current generated snapshot:** ${summary}. Regenerated from [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) by \`scripts/sync_table_scores.js\` using methodology \`${SCORING_METHODOLOGY_VERSION}\`.`,
        '',
        '### Current Top Rows (generated)',
        '| Rank | Wallet | Score | Activity | Rec |',
        '| ---- | ------ | ----- | -------- | --- |',
        ...topRows.map((row, index) => (
          `| ${index + 1} | **${extractName(row.cells[0])}** | ${row.score} | ${row.cells[9]} | ${recommendationEmoji(row.scoreInfo.recommendation)} |`
        )),
        this.endMarker,
      ].join('\n');
    },
  },
  cards: {
    file: path.join(ROOT, 'CRYPTO_CARDS_DETAILS.md'),
    startMarker: '<!-- GENERATED_CARDS_SNAPSHOT_START -->',
    endMarker: '<!-- GENERATED_CARDS_SNAPSHOT_END -->',
    build(rows) {
      const topRows = rows.slice(0, 5);
      const summary = joinSummaryItems(
        topRows.slice(0, 4).map((row) => (
          `${extractName(row.cells[0])} (${row.score}, ${row.cells[11]}, ${recommendationEmoji(row.scoreInfo.recommendation)})`
        ))
      );

      return [
        this.startMarker,
        `> **Current generated snapshot:** ${summary}. Regenerated from [CRYPTO_CARDS.md](./CRYPTO_CARDS.md) by \`scripts/sync_table_scores.js\` using methodology \`${SCORING_METHODOLOGY_VERSION}\`.`,
        '',
        '### Current Top Rows (generated)',
        '| Rank | Card | Score | Best For | Rec |',
        '| ---- | ---- | ----- | -------- | --- |',
        ...topRows.map((row, index) => (
          `| ${index + 1} | **${extractName(row.cells[0])}** | ${row.score} | ${row.cells[11]} | ${recommendationEmoji(row.scoreInfo.recommendation)} |`
        )),
        this.endMarker,
      ].join('\n');
    },
  },
  ramps: {
    file: path.join(ROOT, 'RAMPS_DETAILS.md'),
    startMarker: '<!-- GENERATED_RAMPS_SNAPSHOT_START -->',
    endMarker: '<!-- GENERATED_RAMPS_SNAPSHOT_END -->',
    build(rows) {
      const topRows = rows.slice(0, 5);
      const summary = joinSummaryItems(
        topRows.slice(0, 4).map((row) => (
          `${extractName(row.cells[0])} (${row.score}, ${row.cells[12]}, ${recommendationEmoji(row.scoreInfo.recommendation)})`
        ))
      );

      return [
        this.startMarker,
        `> **Current generated snapshot:** ${summary}. Regenerated from [RAMPS.md](./RAMPS.md) by \`scripts/sync_table_scores.js\` using methodology \`${SCORING_METHODOLOGY_VERSION}\`.`,
        '',
        '### Current Top Rows (generated)',
        '| Rank | Provider | Score | Best For | Rec |',
        '| ---- | -------- | ----- | -------- | --- |',
        ...topRows.map((row, index) => (
          `| ${index + 1} | **${extractName(row.cells[0])}** | ${row.score} | ${row.cells[12]} | ${recommendationEmoji(row.scoreInfo.recommendation)} |`
        )),
        this.endMarker,
      ].join('\n');
    },
  },
};

// Same grouping rules as getHardwareWalletCompanies() in frontend/src/lib/wallet-data.ts.
function hardwareCompanyName(walletName) {
  let company = walletName.split(' ')[0];
  if (walletName.startsWith('BC Vault')) company = 'BC Vault';
  if (walletName.toLowerCase().includes('coldcard')) company = 'Coldcard';
  if (walletName.toLowerCase().includes('trezor')) company = 'Trezor';
  if (walletName.includes('BitBox')) company = 'BitBox';
  return company;
}

const DETAIL_DERIVED_BLOCK_CONFIGS = {
  hardware: {
    file: path.join(ROOT, 'HARDWARE_WALLETS_DETAILS.md'),
    startMarker: '<!-- GENERATED_HARDWARE_COMPANIES_START -->',
    endMarker: '<!-- GENERATED_HARDWARE_COMPANIES_END -->',
    build(rows) {
      const companies = new Map();
      rows.forEach((row) => {
        const company = hardwareCompanyName(row.name);
        if (!companies.has(company)) companies.set(company, []);
        companies.get(company).push(row);
      });
      const ranked = [...companies.entries()]
        .map(([name, wallets]) => ({
          name,
          wallets,
          mean: wallets.reduce((sum, w) => sum + w.score, 0) / wallets.length,
        }))
        .sort((a, b) => (b.mean - a.mean) || a.name.localeCompare(b.name));
      return [
        this.startMarker,
        'Derived from [HARDWARE_WALLETS.md](./HARDWARE_WALLETS.md) by `scripts/sync_table_scores.js`: the aggregated score is the mean of the company\'s row scores, grouped by the same rules as the [companies page](/companies/). Do not edit by hand.',
        '',
        '| Company | Aggregated Score | Wallet Count | Wallets |',
        '|---------|------------------|--------------|---------|',
        ...ranked.map((c) => (
          `| **${c.name}** | ${c.mean.toFixed(1)} | ${c.wallets.length} | ${c.wallets.map((w) => w.name).join(', ')} |`
        )),
        this.endMarker,
      ].join('\n');
    },
  },
};

function parseRow(line) {
  return line
    .trim()
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function formatRow(cells) {
  return `| ${cells.join(' | ')} |`;
}

function isSeparatorLine(line) {
  return /^\|[\s:-]+\|$/.test(line.trim());
}

function sortRows(rowsWithScores) {
  return rowsWithScores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
}

function extractName(cell) {
  const match = String(cell || '').match(/\*\*([^*]+)\*\*/);
  if (match) return match[1].replace(/^~~|~~$/g, '').trim();
  return String(cell || '').replace(/[*[\]()~]/g, '').trim();
}

function joinSummaryItems(items) {
  if (!items.length) return 'No ranked rows available';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function syncMethodologyVersionMentions(content) {
  return String(content)
    .replace(/methodology version `[^`]+`/g, `methodology version \`${SCORING_METHODOLOGY_VERSION}\``)
    .replace(/using methodology `[^`]+`/g, `using methodology \`${SCORING_METHODOLOGY_VERSION}\``)
    .replace(
      /via `(?:wallets\/)?scripts\/sync_table_scores\.js` \(`[^`]+`\)/g,
      `via \`scripts/sync_table_scores.js\` (\`${SCORING_METHODOLOGY_VERSION}\`)`
    );
}

function replaceGeneratedBlock(content, startMarker, endMarker, nextBlock) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`Could not find snapshot markers ${startMarker} / ${endMarker}`);
  }

  const afterEnd = endIndex + endMarker.length;
  return `${content.slice(0, startIndex)}${nextBlock}${content.slice(afterEnd)}`;
}

function processTable(config, { write = false } = {}) {
  const original = fs.readFileSync(config.file, 'utf8');
  const lines = original.split('\n');
  const supportedHeaders = [config.header, ...(config.legacyHeaders || [])].map((header) => header.trim());
  const headerIndex = lines.findIndex((line) => supportedHeaders.includes(line.trim()));
  if (headerIndex === -1) {
    throw new Error(`Could not find table header for ${config.label}: ${config.file}`);
  }

  let endIndex = headerIndex + 2;
  while (endIndex < lines.length && lines[endIndex].trim().startsWith('|')) {
    endIndex += 1;
  }

  const bodyLines = lines.slice(headerIndex + 2, endIndex).filter((line) => line.trim().startsWith('|') && !isSeparatorLine(line));
  const scoredRows = bodyLines.map((line) => {
    const originalCells = parseRow(line);
    const scoreInfo = config.compute(originalCells);
    return {
      sourceLine: line,
      originalCells,
      scoreInfo,
    };
  });

  const { recommendations } = assignRecommendationBands(
    config.label,
    scoredRows.map((row) => row.scoreInfo)
  );

  const processed = sortRows(
    scoredRows.map((row, index) => {
      const scoreInfo = {
        ...row.scoreInfo,
        recommendation: recommendations[index] || row.scoreInfo.recommendation,
      };
      const nextCells = config.updateCells([...row.originalCells], scoreInfo);
      return {
        line: formatRow(nextCells),
        score: scoreInfo.score,
        name: extractName(nextCells[0]),
        changed: row.sourceLine.trim() !== formatRow(nextCells).trim(),
        cells: nextCells,
        scoreInfo,
      };
    })
  );

  const updatedTable = [
    config.header,
    config.separator || lines[headerIndex + 1],
    ...processed.map((row) => row.line),
  ];

  const nextLines = [...lines];
  nextLines.splice(headerIndex, endIndex - headerIndex, ...updatedTable);
  const next = syncMethodologyVersionMentions(nextLines.join('\n'));
  const changed = next !== original;

  if (changed && write) {
    fs.writeFileSync(config.file, next);
  }

  return {
    label: config.label,
    file: config.file,
    changed,
    rows: processed.length,
    processedRows: processed,
  };
}

function processDetailSnapshots(tableResults, { write = false } = {}) {
  return Object.entries(DETAIL_SNAPSHOT_CONFIGS).map(([label, config]) => {
    const tableResult = tableResults.find((result) => result.label === label);
    if (!tableResult) {
      throw new Error(`Could not find table result for ${label}`);
    }

    const original = fs.readFileSync(config.file, 'utf8');
    const nextBlock = config.build(tableResult.processedRows);
    const next = syncMethodologyVersionMentions(
      replaceGeneratedBlock(original, config.startMarker, config.endMarker, nextBlock)
    );
    const changed = next !== original;

    if (changed && write) {
      fs.writeFileSync(config.file, next);
    }

    return {
      label: `${label}-details`,
      file: config.file,
      changed,
      rows: tableResult.processedRows.length,
    };
  });
}

function processDetailDerivedBlocks(tableResults, { write = false } = {}) {
  return Object.entries(DETAIL_DERIVED_BLOCK_CONFIGS).map(([label, config]) => {
    const tableResult = tableResults.find((result) => result.label === label);
    if (!tableResult) {
      throw new Error(`Could not find table result for derived block ${label}`);
    }

    const original = fs.readFileSync(config.file, 'utf8');
    const nextBlock = config.build(tableResult.processedRows);
    const next = replaceGeneratedBlock(original, config.startMarker, config.endMarker, nextBlock);
    const changed = next !== original;

    if (changed && write) {
      fs.writeFileSync(config.file, next);
    }

    return {
      label: `${label}-details-derived`,
      file: config.file,
      changed,
      rows: tableResult.processedRows.length,
    };
  });
}

function processAllTables(options = {}) {
  const tableResults = TABLE_CONFIGS.map((config) => processTable(config, options));
  const detailResults = processDetailSnapshots(tableResults, options);
  const detailDerivedResults = processDetailDerivedBlocks(tableResults, options);
  return [...tableResults, ...detailResults, ...detailDerivedResults];
}

function main() {
  const write = process.argv.includes('--write');
  const results = processAllTables({ write });
  const changed = results.filter((result) => result.changed);

  results.forEach((result) => {
    const state = result.changed ? (write ? 'updated' : 'drift') : 'clean';
    console.log(`${result.label}: ${state} (${result.rows} rows)`);
  });

  if (!write && changed.length > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  processAllTables,
  processTable,
};
