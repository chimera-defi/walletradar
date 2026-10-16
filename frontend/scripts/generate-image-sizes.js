#!/usr/bin/env node
/**
 * Writes src/lib/article-image-sizes.json: intrinsic width/height of every PNG
 * under public/articles/, read from the PNG header. The markdown renderer uses
 * it to give next/image real dimensions (no layout shift).
 * Run after adding or changing an article image: bun run generate-image-sizes
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public');
const base = path.join(root, 'articles');
const out = path.join(__dirname, '..', 'src', 'lib', 'article-image-sizes.json');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

const sizes = {};
if (fs.existsSync(base)) {
  for (const file of walk(base).filter((f) => f.endsWith('.png')).sort()) {
    const head = fs.readFileSync(file).subarray(0, 24);
    sizes['/' + path.relative(root, file).split(path.sep).join('/')] = {
      width: head.readUInt32BE(16),
      height: head.readUInt32BE(20),
    };
  }
}
fs.writeFileSync(out, JSON.stringify(sizes, null, 2) + '\n');
console.log(`wrote ${Object.keys(sizes).length} sizes to ${path.relative(process.cwd(), out)}`);
