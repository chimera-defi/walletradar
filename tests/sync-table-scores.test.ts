import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { processTable } = require('../scripts/sync_table_scores.js');
const { recommendationEmoji } = require('../frontend/src/lib/scoring.js');

// Tied scores in unsorted order: bands used to follow file order, so a second pass moved them.
it('reaches its fixed point in one --write pass', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sync-')), 'T.md');
  const header = '| Provider | Score | Rec |';
  fs.writeFileSync(file, [header, '| --- | --- | --- |', ...['D', 'C', 'B', 'A', 'E'].map((n) => `| **${n}** | 50 | 🟡 |`)].join('\n') + '\n');
  const config = {
    label: 'ramps',
    file,
    header,
    compute: (cells: string[]) => ({ score: Number(cells[1]), recommendation: 'situational', signals: { status: 'active' } }),
    updateCells: (cells: string[], info: { recommendation: string }) => { cells[2] = recommendationEmoji(info.recommendation); return cells; },
  };
  processTable(config, { write: true });
  const once = fs.readFileSync(file, 'utf8');
  expect(once.split('\n')[2]).toContain('**A**');
  expect(processTable(config, { write: true }).changed).toBe(false);
  expect(fs.readFileSync(file, 'utf8')).toBe(once);
});
