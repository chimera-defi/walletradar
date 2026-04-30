# Startup Experiments Playbook

## Scope
This playbook defines testable experiments for a wallet-focused startup across pricing, distribution, monetization, trust UX, and partner conversion.

## Operating Rules
- Run one primary experiment per funnel stage at a time to avoid interaction effects.
- Pre-register metric, guardrails, and stop rules before launch.
- Keep test runtime to full-week increments (minimum 14 days) to absorb weekday/weekend variance.
- For conversion metrics, use a 95% confidence threshold and at least 80% power.
- Rule-of-thumb sample size for binary metrics: `n_per_variant ≈ 16 * p(1-p) / d^2` where `p` is baseline rate and `d` is minimum detectable absolute lift.

## Pricing Experiments

### P1. Good-Better-Best Plan Grid
- Hypothesis: A clear 3-tier plan grid increases paid conversion versus a single flat paid plan.
- Primary metric: Visitor-to-paid conversion rate from pricing page.
- Guardrails: 30-day churn, refund rate, support tickets per new customer, ARPU.
- Setup steps:
1. Define three plans with explicit feature boundaries (Starter, Pro, Team).
2. Implement server-side randomization at user/session level.
3. Instrument events: `pricing_view`, `plan_select`, `checkout_start`, `checkout_success`, `refund`.
4. Freeze pricing copy and promotions during the test window.
- Sample size rule-of-thumb: If baseline visitor-to-paid is 3% and target lift is +0.6 percentage points (20% relative), target about 13k visitors per variant.
- Stop/continue criteria: Continue if paid conversion lifts >= 15% relative with guardrails flat or better; stop if refund rate rises > 25% relative or churn worsens > 10% relative.
- Owner: Growth PM.

### P2. Annual Discount Framing
- Hypothesis: Showing annual pricing first (with explicit savings) increases annual plan mix and net revenue per signup.
- Primary metric: Annual plan share among new paid subscriptions.
- Guardrails: Checkout completion rate, cancellation within 30 days, support complaints about billing confusion.
- Setup steps:
1. Control shows monthly-first pricing; treatment shows annual-first pricing with savings badge.
2. Keep absolute prices unchanged; alter only default emphasis and copy.
3. Track `billing_cycle_selected` and downstream retention by cohort.
4. Add in-product reminder of billing cadence before final checkout confirmation.
- Sample size rule-of-thumb: Minimum 500 completed checkouts per variant before reading outcomes.
- Stop/continue criteria: Continue if annual mix increases >= 8 percentage points and cancellation does not worsen > 2 percentage points; stop if checkout completion drops > 5% relative.
- Owner: Monetization PM.

### P3. Price Anchoring With Team Seat Bundle
- Hypothesis: Adding a visible team-seat anchor increases Pro plan take-rate and ARPU for developer teams.
- Primary metric: ARPU from new paid users (first 30 days).
- Guardrails: Trial-to-paid conversion, discount abuse, sales-assisted workload.
- Setup steps:
1. Add a Team bundle card (e.g., 5 seats) as highest anchor.
2. Keep existing Pro plan unchanged to isolate anchoring effect.
3. Segment reporting by solo users vs team domains.
4. Record seat expansion within first 30 days.
- Sample size rule-of-thumb: At least 300 paid conversions per variant and minimum 4 weeks runtime.
- Stop/continue criteria: Continue if ARPU lifts >= 10% with no trial-to-paid drop > 5% relative; stop if team-card clicks rise but paid conversion falls materially.
- Owner: Pricing Lead.

## Distribution Experiments

### D1. Programmatic Comparison Landing Pages
- Hypothesis: Wallet-specific and chain-specific comparison pages generate higher qualified organic traffic than generic category pages.
- Primary metric: Qualified organic sessions per week (sessions reaching at least one key action).
- Guardrails: Bounce rate, indexed pages with thin content flags, manual penalty signals.
- Setup steps:
1. Generate 30 high-intent pages using a fixed template plus unique data blocks.
2. Interlink pages from hub and relevant docs/tutorial content.
3. Track `organic_session`, `comparison_interaction`, `cta_click`.
4. Submit sitemap updates and monitor Search Console indexing.
- Sample size rule-of-thumb: Minimum 4 weeks and at least 1,000 organic sessions total before judgment.
- Stop/continue criteria: Continue if qualified sessions/page increase >= 25% versus control set; stop if bounce worsens > 15% relative or indexing quality degrades.
- Owner: SEO/Growth Lead.

### D2. Dev Tutorial Syndication
- Hypothesis: Publishing integration tutorials in developer communities (docs + GitHub examples + X threads) drives higher-intent signups than product-only posts.
- Primary metric: Signup conversion rate from referred sessions.
- Guardrails: CAC by channel, low-quality signup rate, community moderation strikes.
- Setup steps:
1. Produce paired assets per topic: deep tutorial and product summary.
2. Alternate weekly distribution slots across channels.
3. Use strict UTM taxonomy and first-touch attribution windows.
4. Qualify signups by activation event within 7 days.
- Sample size rule-of-thumb: At least 200 referred signups per content type across 3+ posting cycles.
- Stop/continue criteria: Continue tutorial-heavy mix if activation-adjusted signup rate improves >= 20%; stop if CAC rises above target by > 30%.
- Owner: DevRel Lead.

### D3. Invite Loop for Power Users
- Hypothesis: A referral credit for inviting other builders increases activated user growth without harming quality.
- Primary metric: Activated new users from referral channel per week.
- Guardrails: Fraud rate, duplicate accounts, retention at day 14.
- Setup steps:
1. Enable invite links with unique tokens and abuse controls.
2. Offer fixed credit on successful activation (not just signup).
3. Add anti-fraud checks (device fingerprint + velocity limits).
4. Track inviter and invitee retention separately.
- Sample size rule-of-thumb: Run until 150 successful referred activations or 6 weeks, whichever is later.
- Stop/continue criteria: Continue if net activated growth is positive and fraud remains < 3%; stop if fraud exceeds threshold or D14 retention is worse by > 10% relative.
- Owner: Growth Engineer.

## Monetization Experiments

### M1. Placement of Revenue Modules
- Hypothesis: Moving partner/affiliate modules from bottom-of-page to in-context comparison blocks increases monetization without reducing trust signals.
- Primary metric: Revenue per 1,000 sessions (RPM).
- Guardrails: Outbound click satisfaction proxy (return rate), trust metric (methodology page visits), complaint rate.
- Setup steps:
1. Keep same offers and labels; test only placement.
2. Preserve sponsored disclosure text in all variants.
3. Track `offer_impression`, `offer_click`, `session_revenue`.
4. Segment by new vs returning users.
- Sample size rule-of-thumb: Minimum 2,000 offer impressions per variant and at least 200 revenue events total.
- Stop/continue criteria: Continue if RPM lifts >= 15% with no trust guardrail deterioration; stop if complaints or rapid back-click behavior increases > 20%.
- Owner: Revenue PM.

### M2. API Add-On Packaging
- Hypothesis: Selling an API add-on at usage thresholds yields higher expansion revenue than forcing immediate upgrade to higher core plan.
- Primary metric: Expansion MRR from existing paid customers.
- Guardrails: Net revenue retention, downgrade rate, support burden.
- Setup steps:
1. Define threshold-trigger events and in-product upsell prompts.
2. Control: forced plan upgrade path; treatment: API add-on purchase path.
3. Add event tracking for prompt view, click, purchase, and churn.
4. Sync billing events into cohort analysis.
- Sample size rule-of-thumb: At least 100 threshold-hit accounts per variant.
- Stop/continue criteria: Continue if expansion MRR/account lifts >= 12% and downgrade rate does not worsen; stop if support tickets per account rise > 25%.
- Owner: Product Monetization Lead.

### M3. Trial Paywall Timing
- Hypothesis: Delaying paywall until first "aha" action improves paid conversion versus immediate feature paywall.
- Primary metric: Trial-to-paid conversion within 14 days.
- Guardrails: Time-to-value, feature abuse, infra cost per trial.
- Setup steps:
1. Define "aha" action (e.g., first successful wallet comparison export or API response).
2. Control applies immediate paywall; treatment unlocks until aha then paywall.
3. Instrument conversion funnel and trial usage depth.
4. Cap treatment exposure to prevent abuse.
- Sample size rule-of-thumb: 400 trial starts per variant minimum.
- Stop/continue criteria: Continue if trial-to-paid improves >= 10% relative with acceptable infra cost; stop if trial abuse or infra cost/user rises > 20%.
- Owner: Growth PM.

## Trust UX Experiments

### T1. Data Freshness and Source Transparency Panel
- Hypothesis: Showing last-verified timestamps and source citations near rankings increases user trust and action completion.
- Primary metric: CTA completion rate after visiting comparison pages.
- Guardrails: Page load performance (LCP), scroll depth drop-off, content comprehension issues.
- Setup steps:
1. Add compact "Data Verified" panel with timestamp + source links.
2. Include methodology tooltip with scoring and conflict policy.
3. Track interactions: `trust_panel_view`, `source_click`, `cta_complete`.
4. Performance-test to ensure added components stay within target latency.
- Sample size rule-of-thumb: Minimum 5,000 comparison-page sessions per variant.
- Stop/continue criteria: Continue if CTA completion increases >= 7% relative and LCP regression stays < 100ms; stop if performance or comprehension guardrails fail.
- Owner: Product Designer.

### T2. Explicit Sponsored Labeling + Ranking Firewall Copy
- Hypothesis: Clear sponsored labeling plus "no pay-to-rank" copy increases long-term trust without harming short-term monetization.
- Primary metric: 14-day returning user rate among first-time visitors.
- Guardrails: RPM, sponsored CTR, negative feedback mentions.
- Setup steps:
1. Add visible sponsored badges and one-line ranking firewall statement.
2. Place consistent disclosure across desktop and mobile.
3. Collect qualitative feedback prompt after key actions.
4. Analyze trust outcomes by traffic source.
- Sample size rule-of-thumb: At least 2,500 first-time visitors per variant and full 14-day observation window.
- Stop/continue criteria: Continue if return rate lifts >= 5% with RPM decline <= 5%; stop if revenue impact exceeds threshold with no trust benefit.
- Owner: Trust & Safety PM.

### T3. Extension + Mobile Verification Badges
- Hypothesis: Prominent "Verified Mobile + Extension" badges reduce user confusion and increase qualified outbound clicks.
- Primary metric: Qualified outbound click-through rate to wallet pages.
- Guardrails: Misclick rate, support tickets about availability mismatch, badge accuracy incidents.
- Setup steps:
1. Build verification badge component tied to verified data source.
2. Show badge only when both platforms are confirmed.
3. Track badge impressions and qualified outbound clicks.
4. Add internal QA checklist for data freshness.
- Sample size rule-of-thumb: 3,000 wallet-row views per variant.
- Stop/continue criteria: Continue if qualified outbound CTR lifts >= 10% and mismatch complaints do not increase; stop immediately if badge accuracy error rate exceeds 1%.
- Owner: Data Product Manager.

## Partner Conversion Experiments

### PC1. Co-Branded Partner Landing Pages
- Hypothesis: Co-branded pages for each partner increase lead-to-signed-partner conversion versus generic partner pages.
- Primary metric: Partner conversion rate (qualified lead to signed agreement).
- Guardrails: Sales cycle length, legal review delays, inbound lead quality.
- Setup steps:
1. Build partner-specific landing variants with tailored value props.
2. Route each page to dedicated CRM pipeline stage.
3. Track full funnel: `partner_lead`, `sql`, `proposal_sent`, `signed`.
4. Standardize sales follow-up SLA across variants.
- Sample size rule-of-thumb: Minimum 40 qualified partner leads per variant, or 8 weeks if lead velocity is low.
- Stop/continue criteria: Continue if signed conversion improves >= 25% with stable cycle length; stop if cycle length expands > 20% without conversion gains.
- Owner: Partnerships Lead.

### PC2. Commercial Model Test (Rev Share vs Fixed CPA)
- Hypothesis: Offering partners a choice between revenue share and fixed CPA increases close rate and total partner-sourced revenue.
- Primary metric: Closed-won rate for active partner opportunities.
- Guardrails: Gross margin, payout predictability, finance ops overhead.
- Setup steps:
1. Define clear eligibility rules for each commercial option.
2. Randomize offer framing where feasible or alternate by week for comparable cohorts.
3. Track signed terms, activation speed, and 60-day realized revenue.
4. Monitor margin impact per partner type.
- Sample size rule-of-thumb: At least 20 opportunities per commercial model before decision; extend to 12 weeks for slow enterprise cycles.
- Stop/continue criteria: Continue chosen model if close rate improves >= 15% and gross margin stays within target band; stop if margin drops below floor.
- Owner: Head of Partnerships + Finance.

### PC3. Integration Fast-Track Pilot
- Hypothesis: A 14-day implementation fast-track (SDK support + checklist) increases partner go-live rate.
- Primary metric: Go-live rate within 30 days of signature.
- Guardrails: Engineering hours per partner, support queue load, defect rate in partner integrations.
- Setup steps:
1. Create fast-track kit (API keys, sandbox checklist, sample code).
2. Assign technical partner manager for treatment cohort.
3. Timebox onboarding checkpoints at day 3, 7, and 14.
4. Measure go-live status and time-to-first-transaction.
- Sample size rule-of-thumb: Minimum 15 newly signed partners per cohort.
- Stop/continue criteria: Continue if 30-day go-live rate improves >= 20 percentage points and support load remains within staffing plan; stop if onboarding cost per partner exceeds target by > 30%.
- Owner: Partner Engineering Manager.

## Weekly Experiment Review Template
- What changed this week (ship log).
- Primary metric status vs target.
- Guardrail status.
- Decision: continue, iterate, or stop.
- Next owner actions and deadlines.
