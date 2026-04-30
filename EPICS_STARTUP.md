# Startup Execution Epics (Engineering-Ready)

## Scope and Constraints
- Product focus: help developers find stable MetaMask alternatives.
- Core gating criteria for recommendation: wallet must have both mobile app and browser extension.
- Stability bias: lower release churn is preferred when all else is equal.

## Epic 1: Trusted Data Layer

### Outcome
Build a canonical, auditable wallet dataset where every decision-grade field is source-backed and validated.

### User Stories
- As a researcher, I want every wallet field to include source provenance so I can trust and audit ranking outputs.
- As a developer user, I want only wallets with verified mobile + extension to be eligible for top recommendations.
- As an operator, I want ingestion to be idempotent so reruns do not create duplicate or conflicting records.

### Non-Goals
- Real-time on-chain telemetry ingestion.
- Supporting write APIs for third parties.
- Automated subjective scoring without human-review override.

### Dependencies
- Source connectors: GitHub API, official docs pages, app store pages.
- Canonical schema for wallet identity, platform coverage, stability metrics, and provenance.
- Storage migration support and snapshot/restore scripts.

### Acceptance Criteria
1. A wallet cannot enter `recommended=true` unless `mobile_verified=true` and `extension_verified=true` with source URLs and `verified_at` timestamps.
2. Every core field (`platform_coverage`, `release_frequency`, `last_commit`, `license`, `testnet_support`) stores `source_type`, `source_url`, `fetched_at`.
3. Ingestion jobs are idempotent: running the same batch twice produces no net data diff.
4. Entity resolution prevents duplicate wallet slugs and duplicate canonical IDs.
5. Data quality checks block publish on schema violations or missing core-field provenance.

### Measurable Definition of Done
- 100% of published wallet rows have provenance on all core fields.
- 0 duplicate canonical wallet IDs in production dataset.
- >=95% automated source parse success for supported connectors.
- End-to-end ingest + validate run completes in <=20 minutes for 150 wallets.

### Rollback Plan
- Trigger: parse success <80% for a run, or core-field provenance coverage drops below 98%.
- Action: disable `trusted_data_layer_v1` publish flag and revert to prior signed dataset snapshot.
- Recovery: hotfix parser rules, replay ingest in staging, republish only after quality checks pass.

---

## Epic 2: Freshness Engine

### Outcome
Keep wallet intelligence current with explicit staleness SLAs and automatic downgrade behavior.

### User Stories
- As a developer user, I want stale wallet data clearly marked so I do not make decisions on outdated information.
- As an operator, I want scheduled refreshes by source type so maintenance does not rely on manual sweeps.
- As a PM, I want release-churn trends tracked so stability-first ranking is data-driven.

### Non-Goals
- Minute-level real-time updates.
- Predictive market forecasting.
- Auto-removal of wallets without human-review queue.

### Dependencies
- Trusted Data Layer canonical schema and provenance fields.
- Job scheduler and alerting infrastructure.
- Notification channels for on-call/operator escalation.

### Acceptance Criteria
1. Scheduled refresh cadences exist: GitHub daily, official docs weekly, app stores weekly (configurable per source).
2. Staleness score is computed per field and per wallet; `recommended` wallets older than freshness SLA are auto-downgraded.
3. Release-churn metric (`releases_per_month_90d`) and issue/star ratio are recomputed on each refresh cycle.
4. Refresh failures emit alerts with wallet ID, connector, and error class.
5. Freshness status is visible to Decision UX and API consumers.

### Measurable Definition of Done
- P95 data-lag: <=24h for GitHub-derived fields, <=7d for app/doc fields.
- 0 wallets displayed as "recommended" when any core criteria verification is older than 30 days.
- >=99% scheduled jobs execute within expected window.
- Alert time from failure to notification <=10 minutes.

### Rollback Plan
- Trigger: scheduler instability (>5% job failure in 24h) or false downgrades >2%.
- Action: pause auto-downgrade policy and switch to manual freshness review queue.
- Recovery: backfill missed jobs, patch connector errors, re-enable per-source with canary rollout.

---

## Epic 3: Decision UX

### Outcome
Provide a decision interface where developers can quickly identify stable, test-ready MetaMask alternatives.

### User Stories
- As a developer, I want filters for mobile+extension, testnet support, and custom RPC so I can shortlist usable wallets fast.
- As a developer, I want side-by-side comparisons with stability signals so I can justify wallet choice to my team.
- As an operator, I want score explanations linked to source evidence to reduce trust disputes.

### Non-Goals
- Social feeds or community forum features.
- Portfolio tracking and transaction execution.
- Personalized ML recommendations in v1.

### Dependencies
- Trusted Data Layer and Freshness Engine outputs.
- Design system components and analytics instrumentation.
- Feature flag framework for ranking algorithm variants.

### Acceptance Criteria
1. Default ranking excludes wallets that do not satisfy verified mobile+extension criteria.
2. Comparison view includes at minimum: release frequency, issue/star ratio, custom RPC support, testnet support, API openness.
3. Every displayed score component has an "evidence" link to stored provenance.
4. Users can save and share a comparison permalink with deterministic query params.
5. Empty/error/stale states render explicit fallback messaging and last-updated timestamps.

### Measurable Definition of Done
- Usability test: >=80% of participants complete "find 3 stable MetaMask alternatives" task without assistance.
- Median task completion time <=2 minutes.
- Score/evidence mismatch rate <0.5% in QA samples.
- Web performance: p95 LCP <=2.5s on comparison pages.

### Rollback Plan
- Trigger: UX regression (task success <65%) or ranking correctness incident.
- Action: revert to previous ranking config and disable advanced comparison modules behind feature flag.
- Recovery: patch scoring or UI defects, rerun regression suite + usability spot-check before re-enable.

---

## Epic 4: Public API and Embeds

### Outcome
Expose trusted wallet intelligence via stable, versioned APIs and embeddable widgets for partner distribution.

### User Stories
- As an integrator, I want a versioned API so my integration does not break on schema changes.
- As a publisher, I want an embed widget that shows up-to-date wallet comparisons without custom backend work.
- As an enterprise user, I want usage limits and keys so access is controllable and auditable.

### Non-Goals
- Bidirectional sync into partner systems.
- Write/update endpoints for external parties.
- Custom per-customer data pipelines in v1.

### Dependencies
- Trusted Data Layer publish artifacts.
- API gateway, auth, rate-limiting, and observability stack.
- Embed delivery CDN and CSP-safe script packaging.

### Acceptance Criteria
1. `v1` read endpoints ship with explicit schema contract and deprecation policy.
2. API responses include freshness metadata and `recommended_eligibility_reason`.
3. Embed script supports configurable filters and inherits core eligibility rules by default.
4. Rate limiting, API key auth, and usage logs are enforced for non-public quotas.
5. Contract tests fail CI on breaking response changes.

### Measurable Definition of Done
- API availability >=99.9% monthly.
- p95 API latency <=300ms for cached list endpoints.
- 100% of API responses include schema version and `generated_at` timestamp.
- >=3 successful internal dogfood integrations (API or embed) without manual data patching.

### Rollback Plan
- Trigger: elevated 5xx (>1%) or schema regression incident.
- Action: route traffic to last known-good `v1` snapshot and disable new embed bundle via CDN switch.
- Recovery: fix regression, replay contract tests, perform canary release to 5% traffic before full rollout.

---

## Epic 5: Operator Quality Moat

### Outcome
Create a defensible quality workflow where data integrity improves over time and mistakes are traceable and reversible.

### User Stories
- As an operator, I want a review queue with required checks so bad data cannot be published accidentally.
- As a lead, I want audit logs for every field-level change so incidents can be root-caused quickly.
- As a user, I want correction notes and change history so trust increases over time.

### Non-Goals
- Fully autonomous publishing without human oversight.
- Generic workflow engine for unrelated content operations.
- Replacing source-of-truth documents outside wallet intelligence scope.

### Dependencies
- Role-based access controls.
- Diff engine for structured wallet records.
- Validation suite for math consistency and cross-doc consistency.

### Acceptance Criteria
1. Any change to core eligibility fields requires dual review before publish.
2. Publish pipeline runs automated checks: schema validity, score math bounds, and cross-record consistency.
3. Every approved change stores actor, timestamp, reason, and evidence links in immutable audit logs.
4. Incident mode supports one-click freeze of publish pipeline while read traffic continues.
5. Operator dashboard shows correction rate, review SLA, and top failing checks.

### Measurable Definition of Done
- 100% of core-field edits have dual-approval records.
- Post-publish correction rate <1% per month.
- Median review turnaround <=24h.
- Audit log retrieval for a record change <=2 seconds p95.

### Rollback Plan
- Trigger: correction spike >=3% weekly or failed integrity check in production.
- Action: activate publish freeze, revert latest batch from snapshot, open mandatory incident review.
- Recovery: patch validation gap, reprocess affected records, unfreeze only after two clean dry-runs.

---

## Epic 6: Monetization Rails

### Outcome
Add pricing, entitlements, and billing telemetry so the product can monetize API and premium decision workflows.

### User Stories
- As a paying user, I want clear plan limits and immediate entitlement activation after checkout.
- As a free user, I want baseline access while premium features are clearly identified.
- As an operator, I want billing and usage events reconciled so revenue reporting is trustworthy.

### Non-Goals
- Building a full accounting system.
- Supporting all payment providers in v1.
- Usage-based pricing experiments without instrumentation guardrails.

### Dependencies
- Public API auth and usage metering.
- Checkout provider, webhook processing, and entitlement store.
- Analytics pipeline for funnel and retention measurement.

### Acceptance Criteria
1. Plans and entitlements gate premium API limits, advanced comparison exports, and alert features.
2. Checkout, renewal, and cancellation webhooks are idempotent and auditable.
3. Entitlement updates propagate to product surfaces within 60 seconds.
4. Metered usage and invoicing counters reconcile daily with <0.5% drift.
5. Kill switch can disable monetization gating and return users to free tier access safely.

### Measurable Definition of Done
- Checkout success rate >=95%.
- Entitlement propagation p95 <=60 seconds.
- Billing event processing success >=99.5%.
- Revenue dashboard updates daily with <24h lag.

### Rollback Plan
- Trigger: payment incident, entitlement outage, or reconciliation drift >1%.
- Action: disable premium gates via feature flag, preserve read access, and pause new charges.
- Recovery: replay failed webhooks/events, validate reconciliation, re-enable gates in staged rollout.

---

## Cross-Epic Dependency Order
1. Trusted Data Layer
2. Freshness Engine
3. Decision UX
4. Public API and Embeds
5. Operator Quality Moat (parallel hardening after 1)
6. Monetization Rails (after 4 and 5 baselines are stable)

## Release Readiness Gate (Global)
- All epic-level DoD metrics green for 2 consecutive weekly cycles.
- No unresolved Sev-1 or Sev-2 incidents in the prior 14 days.
- Rollback drills executed at least once for data publish and API deploy paths.
