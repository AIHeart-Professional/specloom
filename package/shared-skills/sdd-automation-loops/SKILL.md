---
name: sdd-automation-loops
description: >-
  INTERNAL — sdd-loop agent only. Loop procedures and state. Not user-invokable.
---


# SDD Automation Loops

**sdd-loop** agent reads this skill. **sdd-orchestrator** never reads it.

## Coordinator priority

1. Ready **tasks** → domain agents (via orchestrator)
2. Ready **feature** (GitHub issue `sdd:status:ready`) → **sdd-docs** → **sdd-validation** (`spec`)
3. Workable **idea** (GitHub issue `sdd:status:backlog`) → **sdd-docs** → **sdd-validation** (`feature`)
4. Idle

## Rule of 3

`draftValidationAttempts`, `workValidationAttempts`, `testingAttempts`, `attempts` — max 3.

## Gate order

```
feature/spec draft -> sdd-validation(feature|spec) -> awaiting_sign_off -> user chat sign-off -> sdd-updates(mark_ready), else revise up to 3
spec work branch -> sdd-validation(work) -> sdd-validation(test) -> sdd-updates(finalize) -> PR -> merge ai-workflow -> delete branch -> archive
```

Spec creation always starts with `sdd-github spec_start` from `ai-workflow`, using `feature/<spec-slug>`, before `sdd-docs create_spec`.

Handoff schemas: **sdd-orchestrator-protocol** skill (also loaded by **sdd-loop**).

Ideas/features queries: **sdd-github-planning** (loaded by **sdd-loop**).

System map: **sdd-system-reference** (loaded by **sdd-help**).

## Codex Port

This skill was ported from the Cursor SDD system. It is internal and should be used only by the assigned `sdd-*` Codex custom agent. Implicit invocation is disabled in `agents/openai.yaml`.
