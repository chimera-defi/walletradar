# Weekly crypto card re-sweep runbook

Manual, no timers and no paid services. Run weekly (Monday suggested) or when a card shuts down in the news. Allow about an hour.

## 1. Stale first
List the oldest checks first (the cards page has no freshness sort):
```bash
jq -r '.cards | to_entries | sort_by(.value.last_verified // "") | .[] | "\(.value.last_verified // "never")  \(.key)"' data/card-verification.json | head -20
```
Anything older than 60 days (yellow "Stale" badge) or `never` (red "Not verified") goes first. Fields: `last_verified`, `source`, `source_url`. The badge turns stale in the viewer's browser, so it stays correct between deploys.

## 2. Re-check each stale card against its issuer
Use the issuer's own page, blog or help centre. Secondary sites (news, aggregators, review sites) can point you at a change but do not count as a check.
- Only update `last_verified` when you read the issuer page on that date. If the page is blocked (403/429/timeout), leave the date alone and say why in `source`.
- Fix any changed column in `data/tables/CRYPTO_CARDS.md`; keep unknown values as `TBD`, never guess.
- Shut-down cards stay in the table with Status ❌, strikethrough name and the reason (see Cypher, Ready). Do not delete rows.

## 3. Look for new and dead cards
Search for the last 7 days: "crypto card launch", "crypto card discontinued", "card issuer wind down" (watch issuer-level news: Rain, Baanx, Monavate, Kulipa, Lead Bank/Bridge, Nium). Track competitors for names we lack: SpendNode directory, The Grid cards, Spark.money, Eco.com. A new card becomes a row only when its issuer page states what it states; otherwise add it to the **Watchlist** in `data/tables/CRYPTO_CARDS_DETAILS.md` (Market sweep section) with the source and what is missing.

## 4. Write it down
- Add or update the card's section in `data/tables/CRYPTO_CARDS_DETAILS.md` and a dated entry in its sweep log (sources with access dates).
- Add a `CHANGELOG.md` entry.
- New row needs an entry in `data/card-verification.json` (the test fails otherwise).

## 5. Verify and ship
```bash
bun scripts/sync_table_scores.js --write
bunx vitest run tests/
cd frontend && bun run lint && bun run type-check && bun run test && bun run build
```
Then branch, PR (commit header `docs(cards): ...`; `data` is not an allowed type), review, merge. Coordinate with whoever owns other tables so README counts and CHANGELOG do not conflict.
