---
name: specloom-build-protocol
description: >
  INTERNAL — specloom-build + build-worker. Queue-aware build; auto Task test unless manual.
  Not user-invokable.
disable-model-invocation: true
---

# Build protocol

Also load **specloom-queue**.

## Session

1. Contract + resolve-work + git-workflow + queue  
2. Resolve Brief = queue head Ready/`specloom:ready` or Building/`specloom:building`  
3. Set stage **Building** (`specloom:building`; clear ready)  
4. Checkout/pull **`ai-workflow` only** (no task branch)  
5. Delegate **specloom-build-worker** ≤10  
6. On pass → push `ai-workflow` + Linear comment (SHAs) → stage **Testing** (`specloom:testing`)  
7. Unless user said `manual`: **Task specloom-test**; else tell user `@specloom-test`

## Worker loop (≤10)

Unchecked task → layer agent → checkbox after git confirm → comment.

| Layer | Agent |
|-------|--------|
| frontend | specloom-frontend |
| backend | specloom-backend |
| database | specloom-database |

All checked → **specloom-build-check**. Fail → Failed + comment.

## Caps

Max 10 → Failed `attempt cap`.

## Result

```json
{"type":"BUILD_RESULT","status":"complete|blocked|failed","brief_key":"","tasks_done":[],"tasks_open":[],"branch":"ai-workflow","commit_shas":[],"auto_test":true,"notes":""}
```
