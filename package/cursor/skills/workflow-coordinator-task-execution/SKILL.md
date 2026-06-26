---
name: workflow-coordinator-task-execution
description: >-
  INTERNAL — sdd-workflow-coordinator only. Execute all Ready spec tasks then validation.
  Not user-invokable.
disable-model-invocation: true
---

# Task Execution

> Execute **all Ready tasks** on the active spec, then run **validation** workflow.

**Workflow id:** `task_execution`

## Continuous

Keep implementing while tasks show `Status: Ready`. Do not stop after one task.

## Rule of 3

| Gate | Counter |
|------|---------|
| Per-task implementation | `attempts` |
| Work validation | `workValidationAttempts` |
| Test validation | `testingAttempts` |

## Git

Base **`ai-workflow`**. Branch `task/<specId>-<taskSeq>-<slug>`.

## Procedure

1. Read `active_work.json` — block only on `needs_user`.
2. Open spec (`Pending` or `In Progress`).
3. **While** Ready task exists:
   - Select lowest Ready task (deps met)
   - **sdd-release-engineer** `task_start` if new branch needed
   - **sdd-project-lead** → domain HANDOFF
   - **sdd-records-keeper** `task_sync`
   - Mark task Complete; reset `attempts`
4. All tasks Complete → load **workflow-coordinator-validation** → **workflow-coordinator-auto-closeout**
5. Feature file → `status: In Progress` during work
6. Re-enter **workflow-coordinator-coordinator** if iterations remain

## Stop session when

Closeout done (continue coordinator) | blocked | needs_user | iteration_cap
