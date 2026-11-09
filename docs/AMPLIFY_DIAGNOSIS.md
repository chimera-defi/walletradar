# Amplify deploy stall (diagnosed 2026-10-17)

Status: **repointed 2026-11-09**: the Amplify app now builds this repo. See "Repoint, 2026-11-09" below. The tables below are the 2026-10-17 diagnosis, with later notes in parentheses. The console steps and "Done when" are corrected to what worked.

Status on 2026-10-17: **no deploy since 2026-10-10 14:54:30Z.** Every merge to `main` since (33 first-parent commits through `3392461`) is unpublished.

## Cause: the Amplify app still builds `Etc-mono-repo`, not this repo

Evidence (all checked this run):

| Check | Result |
|---|---|
| Live site is the monorepo build | `https://walletradar.org/llms.txt` links `github.com/chimera-defi/Etc-mono-repo/blob/main/wallets/MERCHANT_FEED.md` (this repo's version links `walletradar`); the live homepage HTML contains the string `Etc-mono-repo`; `/manifest.webmanifest` is 404 although this repo emits it from `frontend/src/app/manifest.ts`. No commit of this repo from #82 on can have produced that site. |
| Last monorepo push to `main` | `Etc-mono-repo` `16c9141`, 2026-10-10 14:52:51Z (`wallets/scripts/refresh-github-data.sh`); the commit before it is 2026-09-24. Nothing pushed to `main` since, so an app tracking it has had nothing to build. (Its `pushed_at` is 2026-10-12, from the `auto/refresh-wallet-data` branch; check whether the app also has other branches connected.) |
| Live `last-modified` | 2026-10-10 14:54:30 GMT: 1m39s after that monorepo push; this repo's pre-stall pushes were 14:49:55–14:50:02Z. |
| Do the live headers tell the repos apart? | No. The monorepo's `customHttp.yml` is identical to this repo's at `ee79846` apart from `appRoot: wallets/frontend`, and `/docs/qr-payments/` exists in both. The `llms.txt`, homepage and manifest rows above do. |
| Monorepo extraction | `Etc-mono-repo` PR #290 ("extract WalletRadar to standalone repo and stub monorepo") is **OPEN, not merged**. `wallets/` there is still the full site. (Later: a 2026-10-24 history rewrite auto-closed #290 and #338 replaced it; #338 was still an open draft on 2026-11-09.) |
| Repo webhooks on this repo | `gh api repos/chimera-defi/walletradar/hooks` returns `[]`. |
| GitHub check suite "AWS Amplify (us-east-2)" | `queued`, no conclusion, zero runs, on every commit, including September ones. A placeholder, not a stall signal. It exists on the 2026-10-16 merge, so the Amplify GitHub App installation does include this repo; that only means the app can see it, not that an app builds from it. |

Reading: the app was set up for the monorepo (`appRoot: wallets/frontend`). Work moved to this repo, but the app was never repointed; the 10-10 deploy was the monorepo's last push to `main`. That the live site is the monorepo build is confirmed from the artifacts above; the console's Repository field (step 1) is the final check. (Confirmed 2026-11-09: it read `Etc-mono-repo`, and `AMPLIFY_MONOREPO_APP_ROOT` was `wallets/frontend`.)

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
   - **Branch settings** (not General settings, which has no such field): read the **Repository**. If it says `Etc-mono-repo`, that is the cause: go to step 2. If it says `walletradar`, go to step 3.
   - **Hosting → Build history**: note the newest job's commit and status. A Failed job: copy the first red error line.
2. Repoint the app. The console can't do this: **Reconnect repository** re-authorizes the same repo with no picker, and **Edit** offers only the production branch, autodetection and auto-disconnection. Use the CLI, for example in CloudShell: `aws amplify update-app --region us-east-2 --app-id <APP_ID> --repository https://github.com/chimera-defi/walletradar --access-token <TOKEN>`, with no `.git` on the URL and a GitHub classic token with the `admin:repo_hook` scope. Read the token with `read -rs` so it stays out of shell history, and revoke it once a merge has deployed and a later build has passed without it. Keep the app root `frontend` (the console may call this a monorepo; set `AMPLIFY_MONOREPO_APP_ROOT=frontend`, and do not turn monorepo off). `--environment-variables` replaces the whole map, so read the current values first and pass them all. Don't disconnect `main` to get a picker: that removes the live deployment. The other route is to create a new Amplify app on `walletradar` `main` and move the domain `walletradar.org` to it.
3. **Hosting → Branches** (or Branch settings): `main` connected and **Auto build** on. Cancel any job stuck in Pending/Running (Amplify runs one job per branch).
4. GitHub → **Settings → Integrations → GitHub Apps** → *AWS Amplify (us-east-2)* → Configure: confirm `walletradar` is in the repository access (the check suite suggests it is).
5. **Environment variables**: do not remove any that are set (`AMPLIFY_MONOREPO_APP_ROOT`, `NEXT_PUBLIC_*`); the `NEXT_PUBLIC_*` list in `amplify.yml` is optional.
6. Click **Run build** on `main`, or use the CLI below. Not **Redeploy this version**, which can rebuild the old commit and look like success.
7. **Billing**: confirm no Amplify build-minute block (only if steps 1–6 show nothing wrong).

Equivalent CLI for an operator with credentials: `aws amplify start-job --region us-east-2 --app-id <APP_ID> --branch-name main --job-type RELEASE`.

## Done when

`curl -sI https://walletradar.org/ | grep -i last-modified` shows a date after 2026-10-10 14:54:30 GMT, `https://walletradar.org/search-index.json` returns 200, and `https://walletradar.org/articles/how-wallet-radar-works/` returns 200. The `last-modified` check alone can pass falsely, because a merge to `Etc-mono-repo` rebuilt the site while the app pointed there. Also require: `gh api repos/chimera-defi/walletradar/hooks` shows an `amplify-webhooks.us-east-2` hook, `https://walletradar.org/llms.txt` links `walletradar`, and a merge to this repo's `main` deploys by itself.

## Repoint, 2026-11-09

| Step | Result |
|---|---|
| `update-app --repository` | The app reads `https://github.com/chimera-defi/walletradar`. Before: `Etc-mono-repo`. |
| Webhook on this repo | Amplify added an `amplify-webhooks.us-east-2` hook at 07:01:25Z, so the empty result in the 2026-10-17 table no longer holds. |
| `AMPLIFY_MONOREPO_APP_ROOT` | `frontend`. Before: `wallets/frontend`. `AMPLIFY_DIFF_DEPLOY=false` is unchanged. |
| `start-job --job-type RELEASE` on `main` | Job 196 succeeded at 07:07:08Z; live `last-modified` is 07:07:01 GMT. The job record shows the commit as `HEAD`, not a SHA. |
| Live site is this repo's build | `llms.txt`, `search-index.json`, `manifest.webmanifest` and `robots.txt` match a local build of `09d4a75` byte for byte; `sitemap.xml` differs only in `lastmod` dates. The three paths that were 404 return 200, and `llms.txt` links `walletradar`. |
| Auto-deploy | Tested by merging #160, which added this section; that PR's body records the result. |

To roll back, run the same `update-app` command with `https://github.com/chimera-defi/Etc-mono-repo` and a new token, and set `AMPLIFY_MONOREPO_APP_ROOT` back to `wallets/frontend`. Merge `Etc-mono-repo` #338 only while the app points here, because it empties that repo's `wallets/`.

