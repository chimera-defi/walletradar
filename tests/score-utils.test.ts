/**
 * Tests for getScoreColorClasses() in frontend/src/lib/score-utils.ts.
 * Runs via: bunx vitest run tests/score-utils.test.ts
 */
import { describe, expect, it } from 'vitest';
import { getScoreColorClasses } from '../frontend/src/lib/score-utils';

describe('getScoreColorClasses', () => {
  describe('green band (score >= 75)', () => {
    it('returns green classes for score 100', () => {
      expect(getScoreColorClasses(100)).toContain('text-green-700');
    });

    it('returns green classes for score 75 — lower boundary', () => {
      expect(getScoreColorClasses(75)).toContain('text-green-700');
    });

    it('includes dark-mode green variant', () => {
      expect(getScoreColorClasses(80)).toContain('dark:text-green-400');
    });
  });

  describe('yellow band (50 <= score < 75)', () => {
    it('returns yellow classes for score 74 — just below green', () => {
      expect(getScoreColorClasses(74)).toContain('text-yellow-700');
    });

    it('returns yellow classes for score 50 — lower boundary', () => {
      expect(getScoreColorClasses(50)).toContain('text-yellow-700');
    });

    it('includes dark-mode yellow variant', () => {
      expect(getScoreColorClasses(60)).toContain('dark:text-yellow-400');
    });
  });

  describe('red band (score < 50)', () => {
    it('returns red classes for score 49 — just below yellow', () => {
      expect(getScoreColorClasses(49)).toContain('text-red-700');
    });

    it('returns red classes for score 0', () => {
      expect(getScoreColorClasses(0)).toContain('bg-red-100');
    });

    it('includes dark-mode red variant', () => {
      expect(getScoreColorClasses(25)).toContain('dark:text-red-400');
    });
  });

  describe('return type invariant', () => {
    it('always returns a non-empty string for boundary values', () => {
      for (const score of [0, 25, 49, 50, 74, 75, 100]) {
        const result = getScoreColorClasses(score);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('each band contains exactly one bg- and one text- class', () => {
      for (const score of [0, 50, 75]) {
        const result = getScoreColorClasses(score);
        const bgCount = result.split(' ').filter(c => c.startsWith('bg-') && !c.startsWith('dark:')).length;
        const textCount = result.split(' ').filter(c => c.startsWith('text-') && !c.startsWith('dark:')).length;
        expect(bgCount).toBe(1);
        expect(textCount).toBe(1);
      }
    });
  });
});
