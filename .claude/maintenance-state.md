# Maintenance State
last_run: 2026-07-15
focus: security
status: completed
completed:
  - fix(.gitignore): add .env / .env.* / .env.local entries — missing from project root
  - fix(frontend/package-lock.json): npm audit fix --ignore-scripts resolves 6 of 11 vulns
    - GHSA-3ppc-4f35-3m26 + GHSA-7r86-cg39-jmmj: minimatch ReDoS (High)
    - GHSA-c2c7-rcm5-vvqj: picomatch ReDoS (High)
    - GHSA-rf6f-7fwh-wjgh: flatted Prototype Pollution (High)
    - GHSA-h67p-54hq-rp68: js-yaml quadratic DoS (Moderate)
    - GHSA-5j98-mcp5-4vw2: glob CLI command injection (High)
in_progress:
pending:
  - 5 remaining vulns require Next.js major version bump (next@16) — deferred per CLAUDE.md upgrade planning
    - GHSA-9g9p-9gw9-jx7f: Next.js DoS via Image Optimizer
    - GHSA-vfv6-92ff-j949: Next.js cache poisoning
    - GHSA-qx2v-qp2m-jg93: PostCSS XSS
    - GHSA-q4gf-8mx6-v5v3, GHSA-h25m-26qc-wcjf: additional Next.js DoS
known_failures:
  - canvas postinstall script fails in sandbox — use --ignore-scripts
  - PR #47 (chore/maintenance-2026-06-09) superseded
  - PR #63 (chore/maintenance-2026-07-15) open — current security pass
attempt_counts:
