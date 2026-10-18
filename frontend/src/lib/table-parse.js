/** Markdown pipe-table helpers shared by the data scripts. Node builtins only (root vitest installs no frontend deps). */

const splitRow = (line) => line.trim().split('|').slice(1, -1).map((cell) => cell.trim());
const isSeparatorLine = (line) => /^\|[\s:|-]+\|$/.test(line.trim());
/** First table: a '|' line followed by a separator line. */
const isFirstTableHeader = (line, i, lines) => line.startsWith('|') && i + 1 < lines.length && isSeparatorLine(lines[i + 1]);

/** Index just past the last row of the table whose header is at `headerIndex`. */
function tableEnd(lines, headerIndex) {
  let end = headerIndex + 2;
  while (end < lines.length && lines[end].trim().startsWith('|')) end += 1;
  return end;
}

/** { header, rows } of the table whose header is at `headerIndex` (separator rows excluded). */
function parseTable(lines, headerIndex) {
  const body = lines.slice(headerIndex + 2, tableEnd(lines, headerIndex));
  return { header: splitRow(lines[headerIndex]), rows: body.filter((l) => !isSeparatorLine(l)).map(splitRow) };
}

/** Drop strike-through, bold, links (keep text), HTML tags and extra whitespace. */
const stripMarkdown = (cell) => String(cell)
  .replace(/~~|\*\*/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

module.exports = { splitRow, isSeparatorLine, isFirstTableHeader, tableEnd, parseTable, stripMarkdown };
