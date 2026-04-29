# Takopi Project Registration Playbook

Last updated: 2026-04-22

This runbook makes a newly extracted repo visible in Takopi config and in the Takopi Telegram sidebar.

## 1) Register project alias

From repo root:

```bash
takopi init <alias>
```

Example:

```bash
cd /root/.openclaw/workspace/dev/walletradar
takopi init walletradar
```

Optional secondary alias (hyphenated command style):

```bash
takopi init wallet-radar
```

## 2) Verify config entry

```bash
takopi config get projects.<alias>.path
takopi config list | rg '^projects\.<alias>\.'
```

Expected path pattern:

`/root/.openclaw/workspace/dev/<repo>`

## 3) Ensure sidebar visibility (Telegram topics)

Important: sidebar visibility is driven by `~/.takopi/telegram_topics_state.json` thread mappings, not only `projects.*` config.

Required state shape per topic thread:

```json
{
  "context": { "branch": "main", "project": "<alias>" },
  "default_engine": null,
  "engine_overrides": {},
  "sessions": {},
  "topic_title": "<alias> @main",
  "trigger_mode": null
}
```

Thread key format:

`<chat_id>:<message_thread_id>`

## 4) Recommended operational sequence

1. Create/confirm the Telegram forum topic (`<alias> @main`).
2. Confirm or add the corresponding thread mapping in `telegram_topics_state.json`.
3. Post one message in that topic so it is clearly visible in the Telegram topic list.
4. Re-check with Takopi commands from step 2.

## 5) Troubleshooting

- Alias exists but not in sidebar:
  - Check `telegram_topics_state.json` has a thread entry with `context.project=<alias>`.
- Sidebar shows topic but wrong repo:
  - Fix `context.project` in that thread entry.
- Config mismatch:
  - Re-run `takopi init <alias>` from the correct repo path.
