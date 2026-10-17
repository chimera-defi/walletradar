# Amplify deploy stall (diagnosed 2026-10-17)

Status: **no Amplify build has deployed since 2026-10-10 ~14:54Z.** Every merge to `main` since then (about 40 commits, through `3392461`) is unpublished. The repo side is ruled out below; the cause is in the Amplify app or its GitHub connection, which needs the AWS console.

## Evidence (all checked this run)

| Check | Result |
|---|---|
| Live site `last-modified` | Sat, 10 Oct 2026 14:54:30 GMT. Served by S3 + CloudFront (Amplify hosting). |
| What the live build contains | `/qr-payments` (added in #82, 14:49Z) and the `customHttp.yml` headers from #84 (HSTS, the original CSP without `object-src`). So the app does build this repo with `appRoot: frontend`, and the last build was #82–#84. |
| What it lacks | `/search-index.json` is 404 and `/articles/how-wallet-radar-works/` is 404 (both in `main` since 2026-10-15). |
| First undeployed commit | `f8256fb` (#85, 14:56Z), two minutes after the last deploy. It changes docs only, with no frontend code. |
| Build of `ee79846` (last deployed) and `f8256fb` (first undeployed), `npm ci && npm run build`, Node 22.23 | Both pass. A content failure at #85 is not plausible. |
| Build of current `main`, `npm ci && npm run build && node scripts/verify-build-output.js`, Node 22.23 and Node 24.21 | Both pass ("Build output OK"). |
| `amplify.yml` | `appRoot: frontend`, `nvm install 22`, `npm ci`, `npm run build`, `artifacts.baseDirectory: out`. Matches the working layout. `frontend/.nvmrc` is 22. |
| `customHttp.yml` | Valid YAML, `appRoot: frontend`. The same shape deployed fine in #84. |
| Monorepo path | The monorepo uses `appRoot: wallets/frontend`. The live build used `appRoot: frontend`, so the app is not pointed at the monorepo path. |
| GitHub check suite "AWS Amplify (us-east-2)" | `queued`, no conclusion, zero check runs, on every commit. **Not evidence of a stall:** the suite is also `queued` on `ac24ebe`, `035c4a2` and `ee79846`, which did deploy. Amplify does not report check runs. |
| Repo webhooks | `gh api repos/chimera-defi/walletradar/hooks` returned nothing for this account, so the webhook state could not be read from here. |

## Most likely cause

The build trigger stopped, not the build. Ranked:

1. **Auto-build disabled, branch disconnected, or webhook removed** on the Amplify app's `main` branch. Amplify builds from a webhook that the app registers on the GitHub repo (or via the GitHub App installation). If it is deleted or the app's access to `chimera-defi/walletradar` is revoked, pushes build nothing and nothing is reported on GitHub.
2. **Account-level block** (build minutes or billing, or the app was paused). Builds then fail at "Provision" with a console banner, and no code change fixes it.
3. **A stuck job.** Amplify runs one job per branch at a time; a job that hangs in Pending/Running blocks the rest.

Rejected: Node version (22 builds), `amplify.yml` or `appRoot`, lockfile drift (`npm ci` passes), the monorepo extraction path, `customHttp.yml` validity, build output shape.

## Console steps (about 5 minutes)

1. AWS console, region **us-east-2** → **AWS Amplify** → the walletradar app → **Hosting → Build history**.
   - Read the newest job: its status and the commit it built. If it shows Failed, open it and copy the first red error line. That is the real cause; send it to the owner.
   - If a job is stuck in Pending or Running, choose **Cancel build**.
2. **App settings → General settings**: confirm the repository is `chimera-defi/walletradar` and the branch is `main`.
3. **App settings → Branch settings** (or Hosting → Branches): `main` must be connected and **Auto build** on.
4. **App settings → Build settings**: the app root should read `frontend` (monorepo off is fine, since `amplify.yml` carries `appRoot`). No build-image override to an old Node.
5. **App settings → Environment variables**: none required; the `NEXT_PUBLIC_*` list in `amplify.yml` is optional.
6. GitHub → **Settings → Integrations → GitHub Apps** → *AWS Amplify (us-east-2)* → Configure: the repo `walletradar` must be in its repository access. If not, add it. If the connection looks broken, in Amplify choose **Reconnect repository**.
7. Click **Run build** (Build history → "Redeploy this version", or the branch's **Run build**) on `main`.
8. Check **Billing → Free tier / Bills** for an Amplify build-minute block.

Equivalent CLI for an operator with credentials: `aws amplify start-job --region us-east-2 --app-id <APP_ID> --branch-name main --job-type RELEASE`.

## Done when

`curl -sI https://walletradar.org/ | grep -i last-modified` shows a date after 2026-10-17, `https://walletradar.org/search-index.json` returns 200, and `https://walletradar.org/articles/how-wallet-radar-works/` returns 200.

## Repo-side change

None needed. Node 22 is already pinned in `amplify.yml` and `frontend/.nvmrc`.
