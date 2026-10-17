#!/usr/bin/env python3
"""
Verify RAMPS provider URLs from RAMPS.md.
Outputs JSON + text summary under artifacts/.
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
import time
from datetime import date, datetime
from urllib.parse import urlparse
from dataclasses import dataclass, asdict
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path(__file__).resolve().parents[1]
RAMPS_MD = ROOT / "data" / "tables" / "RAMPS.md"
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(parents=True, exist_ok=True)


@dataclass
class CheckResult:
    name: str
    url: str
    direct_ok: bool
    direct_error: str | None
    direct_len: int
    proxy_ok: bool
    proxy_error: str | None
    proxy_len: int
    notes: list[str]
    mica_status: str = "not_checked"
    mica_detail: dict | None = None


ESMA_CASP_URL = "https://www.esma.europa.eu/sites/default/files/2024-12/CASPS.csv"


def normalise_host(url: str) -> str:
    """Lowercase host without www., port, path or trailing slash."""
    url = (url or "").strip()
    if not url:
        return ""
    # The register has typos such as "https.//coinbase.com"; repair the scheme separator.
    url = re.sub(r"^(https?)[.:;]/{1,2}", r"\1://", url, flags=re.I)
    if "://" not in url:
        url = "https://" + url
    host = (urlparse(url).hostname or "").lower().rstrip(".")
    return host[4:] if host.startswith("www.") else host


def decode_casp_csv(raw: bytes) -> str:
    """ESMA CSV has a UTF-8 BOM; fall back to latin-1 if not valid UTF-8."""
    try:
        return raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        return raw.decode("latin-1").lstrip("\ufeff")


def _parse_date(value: str) -> date | None:
    for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(value.strip(), fmt).date()
        except ValueError:
            continue
    return None


def parse_casp_csv(text: str) -> dict[str, list[dict]]:
    """Index CASP register rows by normalised website host."""
    index: dict[str, list[dict]] = {}
    for row in csv.DictReader(io.StringIO(text)):
        sites = f'{row.get("ae_website") or ""} {row.get("ae_website_platform") or ""}'
        for token in re.split(r"[\s,;|]+", sites):
            host = normalise_host(token)
            if host and "." in host:
                index.setdefault(host, []).append(row)
    return index


def mica_lookup(url: str, index: dict[str, list[dict]], today: date | None = None) -> tuple[str, dict | None]:
    """Return (status, detail) for a RAMPS URL against the CASP index.

    Status: authorised | authorisation_ended | no_host_match.
    no_host_match means no register website/platform host matched; it does NOT
    prove the provider is unregistered (it may use another domain or entity).
    Matches are entity-level: the product scope (e.g. a US-only product of an EU
    group) is not checked.
    Matches exact host, or a CASP host that is a parent domain of the ramp host.
    """
    today = today or date.today()
    host = normalise_host(url)
    rows: list[dict] = []
    match = "host"
    if host in index:
        rows = index[host]
    else:
        for chost, crows in index.items():
            if host.endswith("." + chost):
                rows = crows
                match = "parent_domain"
                break
    if not rows:
        return "no_host_match", None
    active = False
    for r in rows:
        end = _parse_date(r.get("ac_authorisationEndDate") or "")
        if end is None or end >= today:
            active = True
    first = rows[0]
    detail = {
        "match": match,
        "entity": first.get("ae_lei_name", ""),
        "commercial_name": first.get("ae_commercial_name", ""),
        "home_member_state": first.get("ae_homeMemberState", ""),
        "authorisation_date": first.get("ac_authorisationNotificationDate", ""),
        "services": sorted({(r.get("ac_serviceCode") or "").strip() for r in rows if r.get("ac_serviceCode")}),
        "last_update": first.get("ac_lastupdate", ""),
        "note": "entity-level host match; product/region scope not checked",
    }
    return ("authorised" if active else "authorisation_ended"), detail


def load_casp_index(url: str = ESMA_CASP_URL, timeout: int = 30) -> dict[str, list[dict]] | None:
    """Download the ESMA CASP register. Returns None (with a warning) on failure."""
    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
        index = parse_casp_csv(decode_casp_csv(raw))
        if not index:
            raise ValueError("no rows with websites parsed")
        return index
    except Exception as exc:  # degrade gracefully: keep URL checks
        print(f"WARNING: MiCA CASP check skipped ({exc})", file=sys.stderr)
        return None


def parse_ramps_table(md_text: str) -> list[tuple[str, str]]:
    rows = []
    in_table = False
    for line in md_text.splitlines():
        if line.startswith("| Provider |"):
            in_table = True
            continue
        if in_table and line.startswith("|---"):
            continue
        if in_table:
            if not line.startswith("|"):
                break
            parts = [p.strip() for p in line.strip("|").split("|")]
            if not parts or len(parts) < 1:
                continue
            provider_cell = parts[0]
            match = re.search(r"\*\*(.+?)\*\*", provider_cell)
            name = match.group(1).strip() if match else provider_cell
            url_match = re.search(r"\((https?://[^)]+)\)", provider_cell)
            if not url_match:
                continue
            url = url_match.group(1)
            rows.append((name, url))
    return rows


def fetch_url(url: str, timeout: int = 15) -> tuple[bool, int, str | None, str]:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        req = Request(url, headers=headers)
        with urlopen(req, timeout=timeout) as resp:
            content = resp.read()
        text = content.decode("utf-8", "ignore")
        return True, len(text), None, text
    except (HTTPError, URLError, TimeoutError, Exception) as exc:
        return False, 0, str(exc), ""


def quick_head(url: str, timeout: int = 8) -> tuple[bool, str | None]:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        req = Request(url, headers=headers, method="HEAD")
        with urlopen(req, timeout=timeout):
            return True, None
    except (HTTPError, URLError, TimeoutError, Exception) as exc:
        return False, str(exc)


def detect_notes(text: str, *, allow_not_found: bool = True) -> list[str]:
    notes = []
    lower = text.lower()
    if "just a moment" in lower or "cf-chl" in lower:
        notes.append("cloudflare_challenge")
    if "access denied" in lower or "forbidden" in lower:
        notes.append("access_denied")
    if "enable javascript" in lower:
        notes.append("js_required")
    if allow_not_found and "page not found" in lower:
        notes.append("not_found")
    return notes


def main() -> int:
    ramps_text = RAMPS_MD.read_text()
    rows = parse_ramps_table(ramps_text)
    if not rows:
        print("No ramps found in RAMPS.md", file=sys.stderr)
        return 1

    casp_index = load_casp_index()
    results: list[CheckResult] = []
    for name, url in rows:
        direct_ok, direct_len, direct_err, direct_text = fetch_url(url)
        notes = detect_notes(direct_text, allow_not_found=True)
        if not direct_ok:
            head_ok, head_err = quick_head(url)
            if head_ok:
                direct_ok = True
                direct_err = None
                notes.append("head_ok_only")
            else:
                direct_err = head_err or direct_err
        proxy_url = f"https://r.jina.ai/http://{url.replace('https://', '').replace('http://', '')}"
        proxy_ok, proxy_len, proxy_err, proxy_text = fetch_url(proxy_url)
        notes.extend(detect_notes(proxy_text, allow_not_found=False))
        results.append(
            CheckResult(
                name=name,
                url=url,
                direct_ok=direct_ok,
                direct_error=direct_err,
                direct_len=direct_len,
                proxy_ok=proxy_ok,
                proxy_error=proxy_err,
                proxy_len=proxy_len,
                notes=sorted(set(notes)),
                **(
                    dict(zip(("mica_status", "mica_detail"), mica_lookup(url, casp_index)))
                    if casp_index is not None
                    else {}
                ),
            )
        )
        time.sleep(1)

    out_json = ARTIFACTS / "ramps-url-checks.json"
    out_txt = ARTIFACTS / "ramps-url-checks.txt"

    out_json.write_text(json.dumps([asdict(r) for r in results], indent=2))

    lines = ["RAMPS URL Verification", "=" * 28, ""]
    for r in results:
        status = "OK" if r.direct_ok else "FAIL"
        proxy = "OK" if r.proxy_ok else "FAIL"
        notes = ", ".join(r.notes) if r.notes else "-"
        lines.append(f"- {r.name}: direct={status} proxy={proxy} notes={notes} mica={r.mica_status}")
    out_txt.write_text("\n".join(lines) + "\n")

    print(out_json)
    print(out_txt)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
