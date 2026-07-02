---
name: specloom-worker-loops
description: >-
  INTERNAL — specloom-worker only. Meta index — routes workflow to specloom-worker-task-execution.
  Not user-invokable.
disable-model-invocation: true
---

# SpecLoom Worker — Loop Index

**specloom-worker** loads this skill first, then **specloom-worker-task-execution**.

**specloom-implement** never reads skills.

## Workflow

| id | Skill |
|----|-------|
| `task_execution` | **specloom-worker-task-execution** |

Also load **specloom-implement-protocol** for Handoff schemas.

## Allowed sub-agents

Only these may appear in `delegations`:

- **specloom-frontend-developer**
- **specloom-backend-developer**
- **specloom-database-developer**
- **specloom-worker-validation**

## Continuous execution

`run_until_complete` until:
- All Ready tasks Complete + worker-validation pass
- `blocked` — iteration cap (10) exhausted
- `needs_user` — unresolved open question

## State (`active_work.json`)

| Field | Example |
|-------|---------|
| `activeSpec` | `docs/specs/062626_auth.md` |
| `workflow` | `task_execution` |
| `workerLoopIterations` | 0 |
| `stopReason` | `complete` \| `blocked` \| `needs_user` |

## Git

Base **`ai-workflow`**. Branch `task/<specId>-<taskSeq>-<slug>`.

## Repo automation folder

`docs/automation/` holds state and reports only.
