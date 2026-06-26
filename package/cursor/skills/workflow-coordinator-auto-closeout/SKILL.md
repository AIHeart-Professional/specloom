---
name: workflow-coordinator-auto-closeout
description: >-
  INTERNAL — sdd-workflow-coordinator only. Archive spec and git merge after gates pass.
  No human sign-off. Not user-invokable.
disable-model-invocation: true
---

# Auto Closeout

> After validation passes. **No human sign-off.** Archive + git.

**Workflow id:** `auto_closeout`

## Prerequisites

- **sdd-qa-tester**(test) passed
- Work-records finalized at `docs/specs/work-records/SPEC-{id}/`
- Token Budget complete

## Procedure

1. **sdd-records-keeper** verify Changes + Token Budget + work-records
2. Spec Sign-off agent-complete (Reviewed by: sdd-qa-tester)
3. **sdd-records-keeper** `archive_spec`
4. Update feature **Spawned Specs** + Token rollup in `docs/features/`
5. All specs done → feature `status: Complete` → `docs/features/archived/`
6. **sdd-release-engineer** `task_push` → `merge_to_ai_workflow`
7. Clear `gitTaskBranch`; `status: complete`
8. Write `latest_review.md` (informational)

## User involvement

None on routine closeout.

## After success

Re-enter **workflow-coordinator-coordinator** for next work.
