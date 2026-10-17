# Security incident: Porkbun malware report (resolved, appeal pending)

**Ref:** Porkbun abuse report, CleanDNS case `69904e06986d58184c5465b6`
**Domain:** walletradar.org and www.walletradar.org
**Status:** fixes deployed; appeal and re-scan are operator-owned.

## Root cause

The report named a SHA-256 file hash. It matched our live homepage HTML at the time. This was a heuristic false positive: inline Google Analytics scripts plus wallet keywords and many external wallet links.

| Resource | SHA-256 | Match |
|---|---|---|
| Reported hash | `ab5ce83454ba10b7af7287a0556a7feef2fb4a9a9e5d05f5599a377528ea888d` | n/a |
| Live homepage HTML at report time | `ab5ce83454ba10b7af7287a0556a7feef2fb4a9a9e5d05f5599a377528ea888d` | yes |
| GA gtag script | `1dedaa3835aaca3915a62ac5f83fa15d30cd8a352203471233476b9ea7052139` | no |
| Next.js main-app chunk | `281f02e2233520123faceeee3ea07a1dc43f3807668bf0f174be53b431f1a67e` | no |

## Fixes applied

- `frontend/src/app/layout.tsx`: GA loads with `strategy="lazyOnload"` (not in the initial HTML); theme script minified.
- `frontend/public/manifest.json` and `icon-192.svg`, `icon-512.svg`: PWA icons point to files that exist.
- `EnhancedMarkdownRenderer.tsx`: markdown `<img>` limited to same-origin sources.
- `lib/analytics.ts`, `GoogleAnalytics.tsx`: GA4 events (page_view, search, outbound, share).
- Homepage hash changed: `bfcba14030e9859ef2d255d86a1e8d0eaa598ac51a03f57918867ed59c0859a0` was the first post-fix hash. It is **superseded by later deploys** (Next 16 and many redeploys); every current hash differs from the reported one. Do not quote `bfcba140` in new correspondence.

## Diagnose it again

1. Build and hash every output file:
   ```bash
   cd frontend && bun run build
   find out -type f -exec sha256sum {} \; > /tmp/out-hashes.txt
   ```
2. Search for the reported hash (expect no match):
   ```bash
   grep ab5ce83454ba10b7af7287a0556a7feef2fb4a9a9e5d05f5599a377528ea888d /tmp/out-hashes.txt
   ```
3. Diff the live page against the local build:
   ```bash
   curl -sL "https://walletradar.org/" -o /tmp/live-index.html
   diff /tmp/live-index.html frontend/out/index.html
   ```
4. Audit markdown for raw HTML that the renderer would pass through (`rehype-raw`):
   ```bash
   rg -g "*.md" "<script|<iframe|<object|javascript:|data:" .
   rg -g "*.md" "<img[^>]+src=" .
   ```
   Expected: one `<script type="application/ld+json">` inside a code-block template in `articles/video-transcripts.md`, and same-origin `<img src="/chains/...">` chain icons. Nothing else.

## Live external URLs (homepage)

| URL | Purpose |
|---|---|
| https://www.googletagmanager.com/gtag/js | Google Analytics |
| https://www.google-analytics.com | Analytics and DNS prefetch |
| https://schema.org | JSON-LD |
| https://github.com/chimera-defi/walletradar, https://x.com/chimeradefi | Project links |
| https://walletbeat.fyi, https://chainlist.org, https://ethereum.org | Footer links |
| Wallet vendor sites (rabby.io, trezor.io, and so on) | Links in content |

Everything else is same-origin. The CSP `connect-src` in `customHttp.yml` allows `api.llama.fi`, `api.rabby.io`, `api.github.com` and `www.google-analytics.com`.

## Pending actions

Operator-owned, not agent-actionable. They need a browser or the operator's email account.

1. Open the VirusTotal report in a browser and record which engines flag the site and why: https://www.virustotal.com/gui/url/4da0b16abc7447d1f4a54a9c2c2d2cc2ae8db5c393ce3f2ca6ca7240bdc62cd5
2. Read the CleanDNS and Porkbun email screenshots for the exact trigger. The CleanDNS case page returned 404 when checked.
3. Re-scan walletradar.org on VirusTotal and confirm the current homepage is not flagged.
4. Reply to Porkbun with the appeal below. Keep the original subject line.

```
Subject: [KEEP ORIGINAL SUBJECT LINE]

We operate walletradar.org and believe this report is a false positive.

Wallet Radar is an open-source educational wallet comparison site:
- GitHub: https://github.com/chimera-defi/walletradar
- Security contact: https://walletradar.org/.well-known/security.txt

The site is a static Next.js export with no user-generated content. The
reported hash matched our homepage HTML. We have since moved Google
Analytics to lazy loading, minified the inline theme script, limited
markdown images to same-origin sources and fixed the PWA manifest. The
homepage hash has changed.

Please re-review. We can provide more evidence.
```

## Open items

| Item | Verdict |
|---|---|
| Remove `rehype-raw` | Won't do. Tables embed `<img src="/chains/...">` chain icons that need raw HTML. The audit above shows no unsafe HTML. |
| Temporarily disable GA to test detections | Won't do. GA stays, lazy-loaded. |
| VirusTotal re-scan, Porkbun reply | Operator-owned (see Pending actions). |
| `npm audit` high finding (js-yaml via gray-matter, build-time only) | Open; fix in a dependency PR. The earlier Next.js DoS finding is gone after the Next 16 upgrade. |
| `security.txt` | Done: `frontend/public/.well-known/security.txt`. |
