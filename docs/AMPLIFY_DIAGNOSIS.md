# Amplify deploy stall (diagnosed 2026-10-17)

Status: **no deploy since 2026-10-10 14:54:30Z.** Every merge to `main` since (33 first-parent commits through `3392461`) is unpublished.

## Cause: the Amplify app still builds `Etc-mono-repo`, not this repo

Evidence (all checked this run):

| Check | Result |
|---|---|
| Live site is the monorepo build | `https://walletradar.org/llms.txt` links `github.com/chimera-defi/Etc-mono-repo/blob/main/wallets/MERCHANT_FEED.md` (this repo's version links `walletradar`); the live homepage HTML contains the string `Etc-mono-repo`; `/manifest.webmanifest` is 404 although this repo emits it from `frontend/src/app/manifest.ts`. No commit of this repo from #82 on can have produced that site. |
| Last monorepo push to `main` | `Etc-mono-repo` `16c9141`, 2026-10-10 14:52:51Z (`wallets/scripts/refresh-github-data.sh`); the commit before it is 2026-09-24. Nothing pushed to `main` since, so an app tracking it has had nothing to build. (Its `pushed_at` is 2026-10-12, from the `auto/refresh-wallet-data` branch; check whether the app also has other branches connected.) |
| Live `last-modified` | 2026-10-10 14:54:30 GMT: 1m39s after that monorepo push; this repo's pre-stall pushes were 14:49:55–14:50:02Z. |
| Do the live headers tell the repos apart? | No. The monorepo's `customHttp.yml` is identical to this repo's at `ee79846` apart from `appRoot: wallets/frontend`, and `/docs/qr-payments/` exists in both. The `llms.txt`, homepage and manifest rows above do. |
| Monorepo extraction | `Etc-mono-repo` PR #290 ("extract WalletRadar to standalone repo and stub monorepo") is **OPEN, not merged**. `wallets/` there is still the full site. |
| Repo webhooks on this repo | `gh api repos/chimera-defi/walletradar/hooks` returns `[]`. |
| GitHub check suite "AWS Amplify (us-east-2)" | `queued`, no conclusion, zero runs, on every commit, including September ones. A placeholder, not a stall signal. It exists on the 2026-10-16 merge, so the Amplify GitHub App installation does include this repo; that only means the app can see it, not that an app builds from it. |

Reading: the app was set up for the monorepo (`appRoot: wallets/frontend`). Work moved to this repo, but the app was never repointed; the 10-10 deploy was the monorepo's last push to `main`. That the live site is the monorepo build is confirmed from the artifacts above; the console's Repository field (step 1) is the final check.

## Ruled out from the repo side

| Check | Result |
|---|---|
| `npm ci && npm run build`, Node 22.23, at `ee79846`, `f8256fb` and current `main` | pass |
| `npm ci && npm run build && node scripts/verify-build-output.js`, `main`, Node 22.23 and 24.21 | pass ("Build output OK") |
| `amplify.yml` | `appRoot: frontend`, `nvm install 22`, `npm ci`, `npm run build`, `baseDirectory: out`; `frontend/.nvmrc` is 22 |
| `customHttp.yml` | valid YAML, `appRoot: frontend` |
| First undeployed commit `f8256fb` (#85) | changes no build input (`frontend/package*.json`, `next.config`, `src/`), so a content failure there is implausible |

No repo-side fix is needed. Node 22 is already pinned.

## Console steps (about 5 minutes)

1. AWS console, region **us-east-2** → **AWS Amplify** → the walletradar app.
   - **App settings → General settings**: read the **Repository**. If it says `Etc-mono-repo`, that is the cause: go to step 2. If it says `walletradar`, go to step 3.
   - **Hosting → Build history**: note the newest job's commit and status. A Failed job: copy the first red error line.
2. Repoint the app: **App settings → General settings → Edit/Reconnect repository** → GitHub → `chimera-defi/walletradar`, branch `main`. Keep the app root `frontend` (the console may call this a monorepo; leave `AMPLIFY_MONOREPO_APP_ROOT=frontend` if it is set, and do not turn monorepo off). If reconnecting is not offered, create a new Amplify app on `walletradar` `main` and move the domain `walletradar.org` to it.
3. **Hosting → Branches** (or Branch settings): `main` connected and **Auto build** on. Cancel any job stuck in Pending/Running (Amplify runs one job per branch).
4. GitHub → **Settings → Integrations → GitHub Apps** → *AWS Amplify (us-east-2)* → Configure: confirm `walletradar` is in the repository access (the check suite suggests it is).
5. **Environment variables**: do not remove any that are set (`AMPLIFY_MONOREPO_APP_ROOT`, `NEXT_PUBLIC_*`); the `NEXT_PUBLIC_*` list in `amplify.yml` is optional.
6. Click **Run build** on `main`.
7. **Billing**: confirm no Amplify build-minute block (only if steps 1–6 show nothing wrong).

Equivalent CLI for an operator with credentials: `aws amplify start-job --region us-east-2 --app-id <APP_ID> --branch-name main --job-type RELEASE`.

## Done when

`curl -sI https://walletradar.org/ | grep -i last-modified` shows a date after 2026-10-10 14:54:30 GMT, `https://walletradar.org/search-index.json` returns 200, and `https://walletradar.org/articles/how-wallet-radar-works/` returns 200.
