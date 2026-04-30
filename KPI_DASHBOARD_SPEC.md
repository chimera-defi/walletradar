# WalletRadar KPI Dashboard Spec

- **Owner:** WalletRadar Product + Data
- **Version:** 1.0
- **Last Updated:** 2026-04-30
- **Scope:** KPI definitions, instrumentation contract, data model assumptions, and dashboard panel specs for WalletRadar.

## 1) North-Star Metric

## Qualified Wallet Decision Sessions (QWDS)

**Definition:** A session where a user evaluates wallets deeply enough to make a decision signal.

A session is **qualified** if all of the following occur in the same session within 30 minutes:
1. `wallet_table_viewed` (comparison context opened)
2. `wallet_detail_viewed` for at least 1 wallet
3. At least one decision event:
   - `outbound_wallet_link_clicked`, or
   - `wallet_shortlist_saved`, or
   - `criteria_filter_applied` with `core_criteria_mobile_and_extension=true`

**Formula:**

```sql
QWDS = COUNT(DISTINCT session_id WHERE is_qualified_session = true)
```

```sql
QWDS_Rate = QWDS / COUNT(DISTINCT session_id)
```

**Why this north star:** It measures real decision progress (not just traffic), and aligns with WalletRadar's core purpose: helping users choose stable alternatives that meet mobile + extension requirements.

## 2) KPI Hierarchy

### 2.1 Leading Indicators (Daily/Weekly)

1. **Core-Criteria Filter Adoption**

```sql
core_filter_adoption_rate =
  COUNT(DISTINCT session_id WHERE event_name='criteria_filter_applied'
       AND core_criteria_mobile_and_extension=true)
  / COUNT(DISTINCT session_id WHERE event_name='wallet_table_viewed')
```

2. **Wallet Detail Depth** (median detail views per comparison session)

```sql
wallet_detail_depth_p50 =
  PERCENTILE_CONT(0.50) WITHIN GROUP (
    ORDER BY detail_views_per_session
  )
```

3. **Decision Signal Rate**

```sql
decision_signal_rate =
  COUNT(DISTINCT session_id WHERE event_name IN (
    'outbound_wallet_link_clicked',
    'wallet_shortlist_saved'
  )) / COUNT(DISTINCT session_id WHERE event_name='wallet_table_viewed')
```

4. **Research Freshness Coverage**

```sql
fresh_wallet_coverage =
  COUNT(DISTINCT wallet_id WHERE days_since_last_verified <= 30)
  / COUNT(DISTINCT wallet_id)
```

### 2.2 Lagging Indicators (Weekly/Monthly)

1. **Qualified Wallet Decision Sessions (QWDS)**
2. **Returning Decision Users (28d)**

```sql
returning_decision_users_28d =
  COUNT(DISTINCT user_id WHERE has_decision_signal=true AND
        last_decision_signal_at BETWEEN CURRENT_DATE - INTERVAL '28 day' AND CURRENT_DATE)
```

3. **Conversion to Outbound Intent**

```sql
outbound_intent_conversion =
  COUNT(DISTINCT session_id WHERE event_name='outbound_wallet_link_clicked')
  / COUNT(DISTINCT session_id WHERE event_name='wallet_table_viewed')
```

4. **Data Trust Score** (composite of coverage + quality)

```text
DataTrustScore = 0.4*fresh_wallet_coverage
               + 0.3*(1 - stale_core_criteria_ratio)
               + 0.3*(1 - failed_dq_checks_ratio)
```

## 3) Metric Definitions (Exact)

| Metric | Formula | Grain | Notes |
|---|---|---|---|
| `sessions` | `COUNT(DISTINCT session_id)` | day | denominator for most rates |
| `qwds` | qualified-session count | day/week | north star numerator |
| `qwds_rate` | `qwds / sessions` | day/week | primary health metric |
| `core_filter_adoption_rate` | see above | day | indicates user alignment with product intent |
| `decision_signal_rate` | see above | day/week | early conversion proxy |
| `outbound_intent_conversion` | see above | week | monetizable/intentful action proxy |
| `wallet_detail_depth_p50` | p50 detail views/session | day | engagement quality vs vanity pageviews |
| `fresh_wallet_coverage` | wallets verified <=30d / total | day | content quality guardrail |
| `stale_core_criteria_ratio` | wallets with unknown/old mobile+ext flags >60d / total | day | critical content risk |
| `dq_pass_rate` | passed checks / total checks | daily batch | pipeline reliability |

## 4) Dimensions & Segmentation

All KPIs must be sliceable by:

- `date` (UTC day)
- `wallet_category` (`software`, `hardware`, `card`, `ramp`)
- `wallet_type_fit` (`meets_core_criteria`, `does_not_meet`, `inactive`)
- `traffic_source` (`organic`, `direct`, `referral`, `social`, `paid`, `unknown`)
- `device_type` (`desktop`, `mobile_web`)
- `geo_region` (ISO country group)
- `new_vs_returning_user`
- `table_variant` (A/B or layout variant)

Optional high-value dimensions:
- `chain_interest` (derived from filter usage)
- `persona` (`dev_researcher`, `retail_researcher`, `unknown`)

## 5) Event Taxonomy (Tracking Contract)

### 5.1 Event Naming Conventions

- snake_case
- past-tense action semantics (`*_viewed`, `*_clicked`, `*_saved`)
- every event must include: `event_id`, `event_ts`, `user_id` (nullable), `session_id`, `page_path`, `device_type`, `traffic_source`

### 5.2 Core Events

| Event | Trigger | Required Properties |
|---|---|---|
| `wallet_table_viewed` | software/hardware/cards main table rendered | `category`, `table_variant`, `wallet_count_visible` |
| `criteria_filter_applied` | any filter changed | `filter_name`, `filter_value`, `core_criteria_mobile_and_extension` |
| `wallet_detail_viewed` | details panel/page opened | `wallet_id`, `wallet_name`, `category` |
| `wallet_shortlist_saved` | wallet added to shortlist | `wallet_id`, `shortlist_size` |
| `outbound_wallet_link_clicked` | click from WalletRadar to wallet official/app-store/ext link | `wallet_id`, `destination_type`, `destination_domain` |
| `wallet_compare_selected` | wallet checkbox/select for side-by-side compare | `wallet_ids`, `compare_count` |
| `research_row_updated` | internal content update to wallet row | `wallet_id`, `fields_changed`, `source_type` |
| `dq_check_failed` | DQ validator failure | `check_name`, `severity`, `entity_type`, `entity_id` |
| `dq_check_passed` | DQ validator success | `check_name`, `entity_type`, `entity_id` |

### 5.3 Derived Session Flags

```sql
is_comparison_session = EXISTS(event_name='wallet_table_viewed')

has_decision_signal = EXISTS(event_name IN (
  'outbound_wallet_link_clicked','wallet_shortlist_saved'
))

is_qualified_session =
  is_comparison_session
  AND EXISTS(event_name='wallet_detail_viewed')
  AND (
    has_decision_signal
    OR EXISTS(event_name='criteria_filter_applied'
              AND core_criteria_mobile_and_extension=true)
  )
```

## 6) Data Sources & Lineage

| Layer | Source | Dataset/Table | Refresh | Owner |
|---|---|---|---|---|
| Product analytics | Frontend event stream (Segment/PostHog/Amplitude equivalent) | `raw.events_*` | near-real-time (5-15 min) | Data Eng |
| Content/research | Wallet markdown + generated wallet data artifacts | `core.wallet_registry` | daily 02:00 UTC | Research Ops |
| GitHub metadata | `scripts/refresh-github-data.sh` outputs | `core.wallet_github_metrics` | daily 03:00 UTC | Research Ops |
| App listing verification | Official app store + extension checks | `core.wallet_distribution_channels` | daily 03:30 UTC | Research Ops |
| DQ results | Validation jobs | `quality.dq_results` | hourly + daily summary | Data Eng |
| Semantic marts | modeled facts/dims | `mart.fact_wallet_sessions`, `mart.fact_wallet_quality` | hourly | Data Eng |

Lineage rule: dashboard reads only `mart.*` tables; no direct reads from `raw.*` in BI.

## 7) Refresh Cadence & SLA

- **Realtime board (operational):** 15-minute cache; 99% availability
- **Exec KPI board:** hourly refresh; data complete by `H+10m`
- **Research quality board:** daily at 05:00 UTC after ingestion dependencies
- **Monthly rollups:** finalized on 3rd day of next month

SLA alerts:
- `mart.fact_wallet_sessions` lag > 90 minutes => yellow
- lag > 180 minutes => red

## 8) Data Quality Checks

## 8.1 Event Integrity Checks

1. `session_id` null rate < 0.5%
2. duplicate `event_id` rate < 0.1%
3. unknown `event_name` rate = 0%
4. `wallet_id` required for wallet-scoped events

Pseudo SQL:

```sql
SELECT
  SUM(CASE WHEN session_id IS NULL THEN 1 ELSE 0 END)/COUNT(*) AS null_session_rate,
  SUM(CASE WHEN is_duplicate_event_id THEN 1 ELSE 0 END)/COUNT(*) AS dup_event_rate
FROM mart.fact_events_daily
WHERE event_date = CURRENT_DATE - INTERVAL '1 day';
```

## 8.2 Content Integrity Checks

1. Every wallet row has `mobile_app_available` and `browser_extension_available` flags
2. Core-criteria wallets must have both flags true
3. `last_verified_at` must be <= 30 days for top 20 trafficked wallets
4. `license` and `github_repo_url` present for tracked open-source wallets

## 8.3 Metric Contract Checks

- `qwds <= sessions` always
- rates bounded `[0,1]`
- daily KPI delta > 3 sigma requires annotation

## 9) Target Bands (Green / Yellow / Red)

Initial bands (revise after 8 weeks of baseline data):

| KPI | Green | Yellow | Red |
|---|---|---|---|
| `qwds_rate` | >= 0.32 | 0.22 - 0.319 | < 0.22 |
| `core_filter_adoption_rate` | >= 0.55 | 0.40 - 0.549 | < 0.40 |
| `decision_signal_rate` | >= 0.28 | 0.18 - 0.279 | < 0.18 |
| `outbound_intent_conversion` | >= 0.20 | 0.12 - 0.199 | < 0.12 |
| `fresh_wallet_coverage` | >= 0.90 | 0.75 - 0.899 | < 0.75 |
| `stale_core_criteria_ratio` | <= 0.08 | 0.081 - 0.15 | > 0.15 |
| `dq_pass_rate` | >= 0.995 | 0.98 - 0.994 | < 0.98 |
| pipeline lag (minutes) | <= 45 | 46 - 90 | > 90 |

Band logic note: for inverse metrics (like stale ratio, lag), lower is better.

## 10) Dashboard Panel Specification

## 10.1 Executive KPI Dashboard

1. **North-Star Trend (QWDS + QWDS Rate)**
- Visual: dual-axis line + weekly moving average
- Grain: daily
- Filters: date range, traffic source, device type

2. **Leading Indicators Funnel**
- Steps: `wallet_table_viewed` -> `wallet_detail_viewed` -> decision signal -> qualified session
- Visual: conversion funnel + step drop-off

3. **Core Criteria Adoption**
- Visual: stacked area by `core_criteria_mobile_and_extension` true/false

4. **Outbound Intent by Wallet**
- Visual: bar chart top wallets by outbound click-through rate
- Guardrail: show only wallets with >= 200 table impressions/week

5. **Data Trust Score + Components**
- Visual: scorecard + bullet charts for freshness, stale ratio, dq pass rate

## 10.2 Research Quality Dashboard

1. **Freshness Heatmap**
- Rows: wallet_name
- Columns: days since last verified bucket

2. **Core-Criteria Completeness**
- Visual: table of wallets missing mobile/ext evidence

3. **GitHub Activity Monitor**
- Visual: scatter (`release_per_month` vs `issue_star_ratio`) for stability analysis

4. **DQ Failures Timeline**
- Visual: stacked bars by check severity

## 10.3 Operational Data Pipeline Dashboard

1. ingestion lag timeline
2. event volume anomaly panel (z-score)
3. broken event contract panel (new unknown events)

## 11) Canonical Pseudo Queries

## 11.1 Daily North-Star

```sql
WITH session_events AS (
  SELECT
    DATE(event_ts) AS dt,
    session_id,
    MAX(CASE WHEN event_name='wallet_table_viewed' THEN 1 ELSE 0 END) AS saw_table,
    MAX(CASE WHEN event_name='wallet_detail_viewed' THEN 1 ELSE 0 END) AS saw_detail,
    MAX(CASE WHEN event_name IN ('outbound_wallet_link_clicked','wallet_shortlist_saved') THEN 1 ELSE 0 END) AS has_decision,
    MAX(CASE WHEN event_name='criteria_filter_applied'
              AND core_criteria_mobile_and_extension=true THEN 1 ELSE 0 END) AS used_core_filter
  FROM mart.fact_events
  WHERE event_ts >= CURRENT_DATE - INTERVAL '90 day'
  GROUP BY 1,2
)
SELECT
  dt,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(DISTINCT CASE WHEN saw_table=1 AND saw_detail=1
       AND (has_decision=1 OR used_core_filter=1)
       THEN session_id END) AS qwds,
  COUNT(DISTINCT CASE WHEN saw_table=1 AND saw_detail=1
       AND (has_decision=1 OR used_core_filter=1)
       THEN session_id END)::FLOAT
  / NULLIF(COUNT(DISTINCT session_id),0) AS qwds_rate
FROM session_events
GROUP BY 1
ORDER BY 1;
```

## 11.2 Freshness Coverage

```sql
SELECT
  DATE(snapshot_ts) AS dt,
  COUNT(DISTINCT CASE WHEN DATE_DIFF('day', last_verified_at, snapshot_ts) <= 30 THEN wallet_id END)::FLOAT
    / NULLIF(COUNT(DISTINCT wallet_id),0) AS fresh_wallet_coverage
FROM mart.fact_wallet_quality
GROUP BY 1
ORDER BY 1;
```

## 11.3 Target Band Status

```sql
SELECT
  dt,
  qwds_rate,
  CASE
    WHEN qwds_rate >= 0.32 THEN 'green'
    WHEN qwds_rate >= 0.22 THEN 'yellow'
    ELSE 'red'
  END AS qwds_band
FROM mart.kpi_daily;
```

## 12) Governance

- Any KPI logic change requires:
  1. changelog entry in this file
  2. backfill impact note (window + affected metrics)
  3. signoff from Product + Data Eng
- Keep metric definitions versioned (`kpi_version` dimension in marts).

## 13) Changelog

- **2026-04-30 (v1.0):** Initial KPI dashboard specification with north star, formulas, events, DQ, thresholds, and panel definitions.
