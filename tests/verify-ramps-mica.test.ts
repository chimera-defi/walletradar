/**
 * Offline test for the MiCA CASP helpers in scripts/verify-ramps.py.
 * Shells out to python3 with an inline fixture CSV (UTF-8 BOM). No network.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const script = path.resolve(__dirname, '../scripts/verify-ramps.py');

const PY = `
import importlib.util, json, sys
from datetime import date
spec = importlib.util.spec_from_file_location("vr", sys.argv[1])
vr = importlib.util.module_from_spec(spec); sys.modules["vr"] = vr; spec.loader.exec_module(vr)
hdr = "ae_homeMemberState,ae_lei_name,ae_commercial_name,ae_website,ac_authorisationNotificationDate,ac_authorisationEndDate,ac_serviceCode,ac_lastupdate\\n"
rows = (
  'AT,Bitpanda GmbH,Bitpanda,https://www.Bitpanda.com/,09/04/2025,,c. exchange,01/01/2026\\n'
  'LU,Coinbase Luxembourg,Coinbase,https.//coinbase.com,20/06/2025,,a. custody,01/01/2026\\n'
  'DE,Old GmbH,OldCo,https://old.example/,01/01/2025,02/02/2025,a. custody,01/01/2026\\n'
)
raw = b"\\xef\\xbb\\xbf" + (hdr + rows).encode("utf-8")
idx = vr.parse_casp_csv(vr.decode_casp_csv(raw))
today = date(2026, 10, 10)
out = {
  "hosts": sorted(idx),
  "norm": vr.normalise_host("HTTPS://WWW.Bitpanda.com/path/"),
  "hit": vr.mica_lookup("https://bitpanda.com", idx, today)[0],
  "sub": vr.mica_lookup("https://pay.bitpanda.com/x", idx, today)[1]["match"],
  "ended": vr.mica_lookup("https://www.old.example", idx, today)[0],
  "typo": vr.mica_lookup("https://www.coinbase.com", idx, today)[0],
  "miss": vr.mica_lookup("https://nope.example", idx, today)[0],
}
print(json.dumps(out))
`;

describe('verify-ramps MiCA CASP check', () => {
  const out = JSON.parse(execFileSync('python3', ['-I', '-c', PY, script], { encoding: 'utf8' }));
  it('normalises hosts and indexes the BOM CSV', () => {
    expect(out.norm).toBe('bitpanda.com');
    expect(out.hosts).toEqual(['bitpanda.com', 'coinbase.com', 'old.example']);
  });
  it('reports authorised / ended / missing statuses', () => {
    expect(out.hit).toBe('authorised');
    expect(out.sub).toBe('parent_domain');
    expect(out.ended).toBe('authorisation_ended');
    expect(out.typo).toBe('authorised');
    expect(out.miss).toBe('no_host_match');
  });
});
