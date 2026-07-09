
## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

## Meta Learnings

- As of 2026-06-08, all `frontend/` packages have major version jumps (Next 14→16, React 18→19, tailwind 3→4, lucide 0.x→1.x, typescript 5→6, @types/node 20→25) — Monday deps pass is a no-op until explicit upgrade planning.
- `frontend/` uses npm (has `package-lock.json`, no bun.lock or pnpm-lock.yaml).
