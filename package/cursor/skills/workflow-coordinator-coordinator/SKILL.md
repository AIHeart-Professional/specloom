---
name: workflow-coordinator-coordinator
description: >-
  INTERNAL — sdd-workflow-coordinator only. Coordinator priority and continuous
  session routing. Not user-invokable.
disable-model-invocation: true
---

# Coordinator

> Pick highest-priority work, then **keep executing** until idle, blocked, or `needs_user`.

**Workflow id:** `coordinator`

## User does not approve routing — but does approve drafts

Set `humanApprovalRequired: true` when `stopReason: awaiting_sign_off` (feature/spec draft passed QA).

Unresolved Open Questions after `docs/decisions/` search → `needs_user` (separate from sign-off).

## Rule of 3

Max **3** per gate. Fail → `blocked_work.json`, `stopReason: blocked`.

## Priority

| Tier | Condition | Next workflow id |
|------|-----------|------------------|
| 1 | Spec `Pending` + task `Status: Ready` | `task_execution` |
| 2 | Feature `status: Ready` + Spec Queue row, no Ready tasks | `spec_creation` |
| 3 | None | `stopReason: idle` |

**Ideas are optional and excluded from this walk.** Idea → feature is **manual only** (user asks **sdd-project-lead**). Do not scan `docs/ideas/` for automation work.

## Continuous procedure

1. Read `active_work.json`
2. Scan `docs/specs/` and `docs/features/` via **technical-writer-docs-planning** (not `docs/ideas/`)
3. Walk priority 1→4; set `workflow` to selected id
4. Execute that workflow skill until its terminal goal
5. Return to step 3 (same session) unless blocked / needs_user / iteration_cap
6. Update `docs/automation/reports/daily_summary.md` when session ends

## Agent mapping

| Action | Agents (via sdd-project-lead) |
|--------|------------------------------|
| Routing | sdd-workflow-coordinator |
| Implement | sdd-frontend/backend/database-developer |
| Draft + validate | sdd-technical-writer → sdd-qa-tester → **awaiting_sign_off** → promote after user approves |
| Gates | `validation` workflow |
| Closeout | `auto_closeout` workflow |

## Stop session only when

`idle` | `blocked` | `needs_user` | `awaiting_sign_off` | `iteration_cap` — **not** after one task.
