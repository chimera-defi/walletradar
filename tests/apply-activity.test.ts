import { createRequire } from 'node:module';
import { expect, it } from 'vitest';

const { applyToMarkdown, fmtDate } = createRequire(import.meta.url)('../scripts/apply_activity.js');

const entries = [
  { wallet: 'Specter DIY', repo: 'cryptoadvance/specter-diy', lastCommit: '2026-10-07', daysAgo: 33, stars: 592, issues: 128, status: '⚠️' },
  { wallet: 'Rabby', repo: 'RabbyHub/Rabby', lastCommit: '2026-11-05', daysAgo: 4, stars: '1931', issues: '159', status: '✅' },
  { wallet: 'Coinbase', repo: 'coinbase/coinbase-wallet-sdk', lastCommit: '2026-10-27', daysAgo: 13, stars: '1769', issues: '92', status: '✅' },
  { wallet: 'Bad', repo: 'x/bad', lastCommit: '?', daysAgo: '?', stars: '?', issues: '?', status: '?' },
];

it('formats ISO dates like the tables', () => {
  expect(fmtDate('2026-10-07')).toBe('Oct 7, 2026');
  expect(fmtDate('?')).toBeNull();
});

it('rewrites status cells by repo and keeps their style and notes', () => {
  const doc = [
    '| Wallet | GitHub | Active | Activity |',
    '|---|---|---|---|',
    '| [**Specter DIY**](https://s) | [s](https://github.com/cryptoadvance/specter-diy) | ✅ | ✅ Active (develop branch) |',
    '| ~~[**Old**](https://o)~~ | [s](https://github.com/cryptoadvance/specter-diy) | ❌ | ❌ Inactive |',
    '| [**Bad**](https://b) | [b](https://github.com/x/bad) | ✅ | ✅ Active |',
    '| [**Coinbase**](https://c) | [c](https://github.com/coinbase/coinbase-wallet-sdk) | ❌ | ❌ Inactive |',
    '| [**Ledger**](https://l) | Private | 🔒 | 🔒 Private |',
    '| [**Part**](https://p) | [s](https://github.com/cryptoadvance/specter-diy) | ⚠️ Partial | ⚠️ Partial |',
  ].join('\n');
  const { text, changed } = applyToMarkdown(doc, entries);
  const lines = text.split('\n');
  expect(changed).toBe(1);
  expect(lines[2]).toBe('| [**Specter DIY**](https://s) | [s](https://github.com/cryptoadvance/specter-diy) | ⚠️ | ⚠️ Slow (develop branch) |');
  expect(lines.slice(3)).toEqual(doc.split('\n').slice(3)); // struck-through, bad data, KEEP_STATUS, private and non-activity labels unchanged
});

it('joins by bold name in a metrics table without repo links', () => {
  const doc = '| Wallet | Last Commit | Stars | Issues | Ratio |\n|---|---|---|---|---|\n| **Rabby** | Oct 15, 2026 | 1,914 | 140 | 7.3% |\n| **Phantom** | Private | - | - | - |';
  const { text } = applyToMarkdown(doc, entries);
  expect(text.split('\n').slice(2)).toEqual(['| **Rabby** | Nov 5, 2026 | 1,931 | 159 | 8.2% |', '| **Phantom** | Private | - | - | - |']);
});
