/**
 * One real check for the attributes loader join in frontend/src/lib/wallet-data.ts:
 * every data/attributes.json key attaches to a parsed table row, and unknown
 * values stay as data (the UI renders them as "not evaluated").
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'node:path';

describe('attributes loader join', () => {
  let mod: typeof import('../frontend/src/lib/wallet-data');
  beforeAll(async () => {
    // wallet-data resolves the repo root as process.cwd()/.. (frontend build cwd).
    process.chdir(join(__dirname, '..', 'frontend'));
    mod = await import('../frontend/src/lib/wallet-data');
  });

  it('matches every attribute key to a table row and attaches source info', () => {
    expect(mod.getUnmatchedAttributeKeys()).toEqual([]);
    const metamask = mod.parseSoftwareWallets().find((w) => w.name === 'MetaMask');
    expect(metamask?.attributes?.reproducibleBuild?.sourceUrl).toMatch(/^https:\/\//);
    const withNetwork = mod.parseCryptoCards().filter((c) => c.attributes?.cardNetwork);
    expect(withNetwork.length).toBeGreaterThan(0);
    // Rows without sidecar data keep attributes undefined (rendered as "not evaluated").
    expect(mod.parseSoftwareWallets().some((w) => !w.attributes)).toBe(true);
  });
});
