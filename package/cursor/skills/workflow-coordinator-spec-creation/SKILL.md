---
name: workflow-coordinator-spec-creation
description: >-
  INTERNAL — sdd-workflow-coordinator only. Ready feature to spec draft, validate,
  pause for human sign-off before promote. Not user-invokable.
disable-model-invocation: true
---

# Spec Creation

> Coordinator tier **2**. Feature → spec → validate → **human sign-off** → promote → tasks.

**Workflow id:** `spec_creation`

## Flow

```
create_spec → qa-tester(spec) max 3 → awaiting_sign_off → [user approves in chat] → promote_spec → task_execution
```

## Procedure

1. Ready feature + next Spec Queue row — **technical-writer-docs-planning**
2. **sdd-technical-writer** `create_spec`
3. **sdd-qa-tester** `validation_type: spec`
4. Fail → **sdd-technical-writer** `revise_draft` (max 3)
5. Pass (≥99%, zero critical) — **do not promote**:
   - Write `pendingSignOff` to `active_work.json` from `DOCS_RESULT` + `VALIDATION_RESULT`
   - Set `humanApprovalRequired: true`, `stopReason: awaiting_sign_off`, `needs_user: true`
   - Return `LOOP_RESULT` with populated `sign_off` packet
   - **Stop session** — **sdd-project-lead** presents review card
6. After user chat sign-off (separate session): **sdd-project-lead** delegates `promote_spec` → `workflow: task_execution` — may continue same request
7. 3 validation fails → blocked

## `sign_off` packet (required on pass)

| Field | Source |
|-------|--------|
| `artifact_type` | `spec` |
| `artifact_path` | spec file path |
| `title` | spec title / Spec Queue row |
| `sign_off_summary` | `DOCS_RESULT.sign_off_summary` |
| `estimated_tokens` | `DOCS_RESULT.estimated_tokens` |
| `task_token_estimates` | `DOCS_RESULT.task_token_estimates` |
| `open_questions` | draft Open Questions + `VALIDATION_RESULT.user_q` |
| `validation_confidence` | `VALIDATION_RESULT.total_confidence` |

## User involvement

Required sign-off before promote. Open Questions may be answered in chat before approval.
