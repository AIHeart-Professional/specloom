---
name: specloom-build-protocol
description: >
  INTERNAL — specloom-build + build-worker. Implement only; orchestrator owns gates.
  Not user-invokable.
disable-model-invocation: true
---

# Build protocol

Invoked under **specloom-run**. No auto Task test.

## Session

1. Contract + resolve Brief from handoff  
2. Stage **Building** if not already  
3. Checkout/pull **`ai-workflow`**  
4. Apply `issues[]` from prior validate if any  
5. Delegate **specloom-build-worker** ≤10  
6. Commit on `ai-workflow`  
7. Return **BUILD_RESULT** to parent — **do not** Task test/validate  

## Worker loop (≤10)

Unchecked task → layer agent → checkbox after git confirm → comment.

| Layer | Agent |
|-------|--------|
| frontend | specloom-frontend |
| backend | specloom-backend |
| database | specloom-database |

All checked → **specloom-build-check**. Fail → failed status to parent.

## Caps

Max 10 worker iterations → failed `attempt cap` to parent (orchestrator counts gate retries separately).

## Result

```json
{"type":"BUILD_RESULT","status":"complete|blocked|failed","brief_key":"","tasks_done":[],"tasks_open":[],"branch":"ai-workflow","commit_shas":[],"notes":""}
```
