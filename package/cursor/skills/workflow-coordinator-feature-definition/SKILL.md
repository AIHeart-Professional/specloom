---
name: workflow-coordinator-feature-definition
description: >-
  INTERNAL — sdd-workflow-coordinator only. Manual idea→feature promotion (user-requested).
  Not used by coordinator priority walk or automations. Not user-invokable.
disable-model-invocation: true
---

# Feature Definition (manual only)

> **Not part of `run_until_complete` coordinator priority.** User promotes an idea to a feature explicitly.

**Workflow id:** `feature_definition` — load only when **sdd-project-lead** delegates after user asks to promote a specific idea.

## When to run

| Run | Do not run |
|-----|------------|
| User: "Promote idea 001 to a feature" | Coordinator idle scan finds backlog ideas |
| User points at `docs/ideas/NNN_*.md` | Spec Executor / automation with no user request |
| **sdd-project-lead** sets `workflow: feature_definition` for one bounded session | `run_until_complete` tier 3 |

## Flow

```
create_feature (from named idea) → qa-tester(feature) max 3 → awaiting_sign_off → [user approves] → promote_feature
```

Do **not** auto-chain to `spec_creation` unless the user also asked to spawn a spec in the same request.

## Procedure

1. Read user-named idea path (or `activeIdea` from `active_work.json`)
2. **sdd-technical-writer** `create_feature` with `source` = idea path
3. **sdd-qa-tester** `validation_type: feature`
4. Fail → **sdd-technical-writer** `revise_draft` (max 3)
5. Pass (≥99%, zero critical) — **do not promote**:
   - Write `pendingSignOff` to `active_work.json`
   - Set `humanApprovalRequired: true`, `stopReason: awaiting_sign_off`, `needs_user: true`
   - Return `LOOP_RESULT` with `sign_off` packet
   - **Stop** — project lead presents review card
6. After user chat sign-off: **sdd-project-lead** delegates `promote_feature` → Ready if deps met else Draft; archive source idea as `promoted`
7. 3 fails → blocked
8. Return to `workflow: coordinator` or stop — **do not** pick another idea

## User involvement

Required to start and to sign off. Open Questions → answer in chat or at sign-off.
