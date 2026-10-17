# Redirects

The site is a static export, so Next `redirects()` do not apply and Amplify redirect rules live in the console. Moved or removed URLs are handled in two layers, both generated at build time by `frontend/scripts/build-redirects.js` (chained into `npm run build`).

1. **Stub pages.** For each entry the build writes `out/<from>/index.html` with a 0-second `<meta http-equiv="refresh">`, a `<link rel="canonical">` to the target, an inline `location.replace`, and `data-redirect-stub` on `<html>`. There is no `noindex`. Stubs are never in the sitemap.
2. **`out/amplify-redirects.json`.** The same entries as Amplify custom rules (301), with both `/old` and `/old/` as sources.

## Add an entry

Add it to a JSON file in `frontend/redirects/` (one file per area, for example `legacy.json`, `docs.json`, `articles.json`):

```json
[{ "from": "/old/path/", "to": "/new/path/#anchor", "reason": "why it moved" }]
```

`from` starts and ends with `/`. The build fails if `from` is still a real page, if the `to` path (anchor ignored) is not in `out/`, if the target is itself a stub, or on a duplicate `from`. `node scripts/verify-build-output.js` then checks every stub exists, no stub is in the sitemap, and sitemap `<loc>`s are unique and built. Whenever you remove or rename a page, add its entry in the same PR.

## Operator step (after the Amplify repoint)

Open Amplify Console, Hosting, Rewrites and redirects, choose Open text editor, and paste the contents of `out/amplify-redirects.json` from the latest build (also available as `https://<site>/amplify-redirects.json`). Until then the stubs cover the old URLs.
