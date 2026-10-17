import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parseLastUpdated, ageDays, classify } = require('../scripts/check_freshness.js');

describe('check_freshness', () => {
  it('parses the Last Updated line', () => {
    const d = parseLastUpdated('x\n**Last Updated:** October 17, 2026 | link');
    expect(d.toISOString().slice(0, 10)).toBe('2026-10-17');
  });
  it('returns null when the line is missing or malformed', () => {
    expect(parseLastUpdated('nothing')).toBeNull();
    expect(parseLastUpdated('**Last Updated:** Smarch 3, 2026')).toBeNull();
  });
  it('computes age in days', () => {
    const d = parseLastUpdated('**Last Updated:** October 1, 2026');
    expect(ageDays(d, new Date('2026-10-31T00:00:00Z'))).toBe(30);
  });
  it('classifies by age', () => {
    expect(classify(30)).toBe('fresh');
    expect(classify(31)).toBe('warn');
    expect(classify(91)).toBe('stale');
    expect(classify(null)).toBe('missing');
  });
});
