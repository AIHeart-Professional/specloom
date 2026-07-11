---
name: specloom-worker-task-execution
description: >-
  INTERNAL — specloom-worker only. Execute all Ready spec tasks then worker-validation.
  Not user-invokable.
disable-model-invocation: true
---

# Worker Task Execution

> Execute **all Ready tasks** on active spec, then **specloom-worker-validation**.

**Workflow id:** `task_execution`

## Continuous

Keep implementing while tasks show `Status: Ready`. Do not stop after one task.

## Max iterations

**10** (`workerLoopIterations`). On exhaust → `status: blocked`, update `blocked_work.json`.

## Procedure

1. Read `active_work.json` — block only on `needs_user`.
2. Require `git_task_branch` from `WORKER_HANDOFF` — all work on that branch.
3. Open spec (`Pending` or `In Progress`).
3. **While** Ready task exists AND iterations < 10:
   - Select lowest Ready task (deps met)
   - Return delegation → **specloom-implement** executes domain agent with `IMPLEMENTATION_HANDOFF`
   - After result → delegation **specloom-update-knowledgebase** `task_sync`
   - Mark task Complete in spec; reset per-task `attempts`
4. All tasks Complete → return delegation **specloom-worker-validation**
5. On worker-validation `confidence_score >= 99` → `WORKER_RESULT.status: complete`
6. On worker-validation fail → return remediation delegation to domain agent; increment iteration

## Layer routing

| Task layer | Agent |
|------------|-------|
| frontend | specloom-frontend-developer |
| backend | specloom-backend-developer |
| database | specloom-database-developer |
| game | specloom-game-developer |

## Parallel

When spec `parallel: yes` and tasks have no cross-deps → return parallel delegations in one iteration.

## Stop when

All tasks done + worker-validation pass | blocked (10 iter) | needs_user
