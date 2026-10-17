/**
 * Tests for getScoreColorClasses() in frontend/src/lib/utils.ts.
 * Runs via: bunx vitest run tests/score-utils.test.ts
 */
import { describe, expect, it } from 'vitest';
import { getScoreColorClasses } from '../frontend/src/lib/utils';

describe('getScoreColorClasses', () => {
  it.each([
    [75, 'text-green-700'],
    [74, 'text-yellow-700'],
    [50, 'text-yellow-700'],
    [49, 'text-red-700'],
  ])('score %i -> %s', (score, expected) => {
    expect(getScoreColorClasses(score)).toContain(expected);
  });
});
