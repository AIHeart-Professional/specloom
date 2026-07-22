---
name: specloom-build-protocol
description: >
  INTERNAL — specloom-build + build-worker. Handoffs, loops, Linear updates. Not user-invokable.
disable-model-invocation: true
---

# Build protocol

## Session

1. Load **specloom-v2-contract** + **specloom-resolve-work** + **specloom-git-workflow**
2. Brief must be Ready (→ set Building) or Building, or Failed with build-owned remediation
3. `task_start` from `ai-workflow`
4. Delegate **specloom-build-worker** only (≤10)
5. On all tasks complete + build-check pass → push/PR → Linear status **Testing** + comment summary
6. Reply user: run `@specloom-test`. Never call test/validate peers.

## Worker loop (≤10)

Each iter: lowest unchecked task → domain agent by layer → check box only after code+git confirm → comment progress.

| Layer | Agent |
|-------|--------|
| frontend | specloom-frontend |
| backend | specloom-backend |
| database | specloom-database |

All tasks checked → **specloom-build-check**. Pass → complete. Fail → fix or Failed + comment.

## Domain rules

- Production code only. No tests.
- Load **specloom-coding** before edits.
- Source files from Task Directives only unless Brief says otherwise.

## Caps

Max 10 worker iters → status Failed + comment `attempt cap` → stop.

## Handoff (minimal)

```json
{"type":"BUILD_HANDOFF","brief_key":"","task_id":"","layer":"","language":"","standards":[],"sources":[],"fix_instructions":[]}
```

## Result

```json
{"type":"BUILD_RESULT","status":"complete|blocked|failed","brief_key":"","tasks_done":[],"tasks_open":[],"pr_url":null,"notes":""}
```
