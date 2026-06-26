---
name: workflow-coordinator-validation
description: >-
  INTERNAL — sdd-workflow-coordinator only. Work and test gates, draft validation.
  Auto-advance on pass. Not user-invokable.
disable-model-invocation: true
---

# Validation

> Formal gates. **Auto-advance on pass** — no human approval.

**Workflow id:** `validation`

## When this runs

| Trigger | Gates |
|---------|--------|
| All spec tasks Complete | `work` → `test` → auto_closeout |
| After create_spec | `spec` (within spec_creation) |
| After create_feature (manual promotion) | `feature` |

## Work gate

**sdd-qa-tester** `validation_type: work`. Pass: `total_confidence >= 99`. Max 3 → blocked.

## Test gate

After work passes. Unit → integration → E2E → coverage. Pass ≥99% → finalize work-records → **workflow-coordinator-auto-closeout**.

## Draft gates

Pass ≥99% → **awaiting_sign_off** — populate `sign_off` packet, set `humanApprovalRequired: true`, **stop**. Do **not** call `promote_feature` | `promote_spec` until **sdd-project-lead** confirms user chat sign-off.

## Post-implementation procedure

1. Manifest + spec Changes
2. Work gate loop (max 3)
3. Test gate loop (max 3)
4. **sdd-records-keeper** `finalize_work_records`
5. Load **workflow-coordinator-auto-closeout**
6. Update `latest_validation.md`
