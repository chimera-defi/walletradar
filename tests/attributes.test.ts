import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..');
const schema = JSON.parse(readFileSync(join(root, 'data/attributes.schema.json'), 'utf8'));
const data = JSON.parse(readFileSync(join(root, 'data/attributes.json'), 'utf8'));

type Attr = { id: string; applies_to: string; values: string[]; allowed_source_kinds: string[]; required_source_fields: string[] };
const attrs: Attr[] = schema['x-attributes'];
const SECTION_FILES: Record<string, string> = { software_wallets: 'SOFTWARE_WALLETS.md', crypto_cards: 'CRYPTO_CARDS.md' };

function rowNames(file: string): Set<string> {
  const names = new Set<string>();
  for (const line of readFileSync(join(root, file), 'utf8').split('\n')) {
    const m = /^\|\s*(?:~~)?\[\*\*(.+?)\*\*\]/.exec(line);
    if (m) names.add(m[1]);
  }
  return names;
}

// Minimal validator for the JSON Schema subset used in data/attributes.schema.json.
function validate(value: any, s: any, defs: any, path: string, errs: string[]): void {
  if (s.$ref) return validate(value, defs[s.$ref.split('/').pop()], defs, path, errs);
  if (s.const !== undefined && value !== s.const) errs.push(`${path}: expected ${s.const}`);
  if (s.enum && !s.enum.includes(value)) errs.push(`${path}: ${value} not in enum`);
  if (s.type === 'string') {
    if (typeof value !== 'string') return void errs.push(`${path}: not a string`);
    if (s.pattern && !new RegExp(s.pattern).test(value)) errs.push(`${path}: pattern ${s.pattern}`);
  }
  if (s.type === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return void errs.push(`${path}: not an object`);
    for (const r of s.required ?? []) if (!(r in value)) errs.push(`${path}: missing ${r}`);
    for (const [k, v] of Object.entries(value)) {
      if (s.properties?.[k]) validate(v, s.properties[k], defs, `${path}.${k}`, errs);
      else if (s.additionalProperties === false) errs.push(`${path}: unexpected ${k}`);
      else if (typeof s.additionalProperties === 'object') validate(v, s.additionalProperties, defs, `${path}.${k}`, errs);
    }
  }
}

describe('attributes sidecar', () => {
  it('matches the structural schema', () => {
    const errs: string[] = [];
    validate(data, schema, schema.$defs, '$', errs);
    expect(errs).toEqual([]);
  });

  it('every attribute is declared, applies to its section and uses an allowed value', () => {
    const byId = new Map(attrs.map((a) => [a.id, a]));
    for (const a of attrs) expect(a.values).toContain('unknown');
    for (const section of Object.keys(SECTION_FILES)) {
      for (const [name, entries] of Object.entries<any>(data[section])) {
        for (const [id, e] of Object.entries<any>(entries)) {
          const a = byId.get(id);
          expect(a, `${section}/${name}: undeclared attribute ${id}`).toBeDefined();
          expect(a!.applies_to, `${name}/${id}`).toBe(section);
          expect(a!.values, `${name}/${id} value`).toContain(e.value);
          expect(a!.allowed_source_kinds, `${name}/${id} source_kind`).toContain(e.source_kind);
          for (const f of a!.required_source_fields) expect(e[f], `${name}/${id} ${f}`).toBeTruthy();
          if (e.value !== 'unknown') expect(e.source_url, `${name}/${id}`).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it('every key matches a row name in the root markdown table', () => {
    for (const [section, file] of Object.entries(SECTION_FILES)) {
      const rows = rowNames(file);
      expect(rows.size).toBeGreaterThan(10);
      for (const name of Object.keys(data[section])) expect(rows, `${name} not in ${file}`).toContain(name);
    }
  });

  it('is not empty for any attribute', () => {
    for (const a of attrs) {
      const n = Object.values<any>(data[a.applies_to]).filter((e) => e[a.id]).length;
      expect(n, a.id).toBeGreaterThan(0);
    }
  });
});
