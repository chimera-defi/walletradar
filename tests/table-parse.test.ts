import { createRequire } from 'node:module';
import { expect, it } from 'vitest';

const t = createRequire(import.meta.url)('../frontend/src/lib/table-parse.js');
const doc = ['intro', '| Name | Score |', '| --- | :---: |', '| **A** | 90 |', '| ~~[B](x)~~ | 80 |', '', '| z |'];

it('splits, detects and parses the first table', () => {
  expect(t.splitRow(' | a | b c |  ')).toEqual(['a', 'b c']);
  expect(t.isSeparatorLine('| --- | :---: |')).toBe(true);
  const start = doc.findIndex(t.isFirstTableHeader);
  expect(t.parseTable(doc, start)).toEqual({ header: ['Name', 'Score'], rows: [['**A**', '90'], ['~~[B](x)~~', '80']] });
  expect(t.stripMarkdown('~~**[Bee](http://x)**~~ <br>  ok')).toBe('Bee ok');
});
