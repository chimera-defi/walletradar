# WalletRadar Q3/Q4 2026 Roadmap (Execution Ready)

## Scope
| Item | Decision |
|---|---|
| Planning horizon | Q3-Q4 2026 (July 6, 2026 to December 27, 2026) |
| Sprint model | 13 sprints, 2 weeks each |
| Functional owners | Product, Eng, Data, GTM |
| Product focus | Developer-first wallet comparison with strict mobile + browser extension verification |
| Operating principle | Data quality and product stability over feature volume |

## Phase Plan
| Phase | Window | Milestone Objective | Owners | Dependencies | Key Risks | Exit Criteria (Concrete) |
|---|---|---|---|---|---|---|
| 1. Data Spine + Coverage Baseline | S1-S2 (Jul 6-Aug 2) | Build reliable wallet data ingestion, source verification, and freshness monitoring | Data (lead), Eng, Product | GitHub/API access, app store source mapping, schema lock | Wrong repo mapping, flaky source fetches, incomplete platform metadata | 45 target wallets tracked; 100% have mobile+extension flags; freshness SLA <=24h; pipeline success >=98% for 14 days |
| 2. Scoring Engine v1 + Explainability | S3-S4 (Aug 3-Aug 30) | Ship scoring service aligned to developer priorities (coverage, DX, stability, activity, openness) | Product (lead), Data, Eng | Phase 1 data quality gates | Weighting disputes, opaque scoring, regression in ranking logic | Scoring spec v1 signed off; versioned score API live; score explanation available for 100% of ranked wallets; API p95 <=350ms |
| 3. Developer Beta + Feedback Loop | S5-S7 (Aug 31-Oct 11) | Launch private beta for developer teams; iterate on comparison UX and trust signals | Product (lead), Eng, GTM, Data | Phases 1-2 complete, event tracking in place, onboarding flow ready | Low activation, low trust in data, noisy feedback | 20 design partners onboarded; weekly active beta users >=60; beta activation >=30%; >=10 high-impact issues closed from feedback |
| 4. Public Launch + Acquisition Engine | S8-S9 (Oct 12-Nov 8) | Public release with SEO pages, comparison workflows, and referral loop | GTM (lead), Product, Eng, Data | Phase 3 retention baseline, content pipeline, analytics dashboards | Weak organic discovery, launch bugs, high bounce rate | Public launch shipped; 1,500 signups cumulative; organic sessions >=12,000/month; landing-to-signup conversion >=6% |
| 5. Revenue Foundation (B2B + Sponsorship) | S10-S11 (Nov 9-Dec 6) | Validate monetization via paid pilots and sponsor placements without harming trust | GTM (lead), Product, Eng, Data | Phase 4 traffic + engagement, billing/CRM plumbing, pricing narrative | Monetization-trust conflict, long sales cycle, poor sponsor fit | >=3 paid pilots OR >=$8k MRR equivalent; sponsor disclosure policy live; paid feature usage by >=2 external teams |
| 6. Reliability Hardening + 2027 Readiness | S12-S13 (Dec 7-Dec 27) | De-risk scale, tighten SLOs, and lock next-year roadmap from evidence | Eng (lead), Data, Product, GTM | Observability, alerting, runbooks, post-launch analytics | Holiday staffing gaps, unresolved tech debt, roadmap bias | Uptime SLO >=99.9%; Sev-1 incidents = 0 for final 30 days; top 2027 bets ranked with ROI + effort model; hiring plan approved |

## 2-Week Sprint Cadence
| Cadence Point | Owners | Required Output | Exit Gate |
|---|---|---|---|
| Day 1: Sprint planning + dependency review | Product (lead), Eng, Data, GTM | Sprint goal, KPI target, dependency risk list | No sprint starts without named owner + measurable goal |
| Daily: 15-min cross-functional standup | Eng, Data, Product, GTM | Blocker log updated daily | Blockers older than 48h escalated |
| Day 4: Data integrity checkpoint | Data (lead), Eng | Source verification report, schema drift check | No new wallet rows without verified sources |
| Day 7: Mid-sprint demo | Eng (lead), Product | Working increment in staging, metric delta | Scope cut made immediately if milestone at risk |
| Day 9: Launch/enablement review | GTM (lead), Product, Eng | Release notes, messaging, instrumentation validation | No release without analytics + rollback plan |
| Day 10: Ship + retro | All functions | Production release, retro actions, next sprint inputs | Retro action owners assigned before sprint close |

## Critical Path Timeline
| Critical Path Step | Date Range | Must Be Done | Blocked By | If Delayed >1 Sprint |
|---|---|---|---|---|
| CP1: Verified data pipeline | Jul 6-Aug 2 | Fresh wallet dataset with platform verification and SLA alerts | Source mapping + ingestion jobs | Scoring milestone slips; no trustworthy rankings |
| CP2: Scoring engine v1 | Aug 3-Aug 30 | Versioned scoring API + explainability layer | CP1 complete | Beta launch slips; GTM narrative weak |
| CP3: Private beta traction | Aug 31-Oct 11 | Activated design partners and closed-loop feedback | CP2 complete + onboarding instrumentation | Public launch timing and feature confidence degrade |
| CP4: Public launch quality gate | Oct 12-Nov 8 | Stable release + acquisition funnel + SEO comparison pages | CP3 retention + release readiness | Monetization tests lose top-of-funnel volume |
| CP5: Monetization validation | Nov 9-Dec 6 | Paid pilots/sponsors with trust safeguards | CP4 traffic + engagement baseline | 2027 budgeting remains assumption-driven |
| CP6: Reliability + planning lock | Dec 7-Dec 27 | SLO compliance, incident stability, next-year plan approval | CP1-CP5 metrics + ops hygiene | Q1 2027 starts with unresolved risk and unclear priorities |

## Operating Risks to Track Weekly
| Risk | Owner | Leading Indicator | Mitigation Trigger |
|---|---|---|---|
| Data trust erosion | Data | % wallets with stale or conflicting sources | >5% stale rows for 2 days |
| Release instability | Eng | Incident count, rollback frequency | >1 Sev-2 in a sprint |
| Low beta/public activation | Product + GTM | Activation and conversion rates | Activation drops below target for 2 consecutive sprints |
| Monetization hurting credibility | GTM + Product | User feedback sentiment, sponsor complaints | Trust score declines >10% post-monetization rollout |
