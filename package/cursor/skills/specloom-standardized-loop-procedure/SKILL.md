---
name: specloom-standardized-loop-procedure
description: >-
  INTERNAL — specloom-standardized-loop only. Domain validator iteration procedure (max 3).
  Not user-invokable.
disable-model-invocation: true
---

# Standardized Loop Procedure

**Max 3 iterations** per validator session.

## Per iteration

1. For each layer in `layers[]`:
   - Build `DOMAIN_VALIDATION_HANDOFF`
   - Return delegation to **specloom-validator** — validator executes Task calls
2. When `parallel: true` and multiple layers → single iteration with parallel delegations
3. Aggregate `DOMAIN_VALIDATION_RESULT` scores:
   - `aggregated_confidence = min(layer confidence_scores)` (weakest link)
4. **Pass:** every active layer `confidence_score >= 99`
5. **Fail:** collect `findings[]`, build `remediation[]` for worker retry

## Iteration tracking

Increment `loopIterations` each full pass over all layers.

On iteration 3 fail → return `status: fail` with full findings for **specloom-validator** to write spec section.

## Layer → agent map

| layer | agent |
|-------|-------|
| frontend | specloom-frontend-validator |
| backend | specloom-backend-validator |
| database | specloom-database-validator |

## Skip inactive layers

Only validate layers present in `manifest.layers[]`.
