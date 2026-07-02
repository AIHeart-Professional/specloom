---
name: specloom-validator-orchestration
description: >-
  INTERNAL — specloom-validator only. Aggregates standardized-loop results and writes spec validation section on fail.
  Not user-invokable.
disable-model-invocation: true
---

# Validator Orchestration

Runs after **specloom-worker-validation** passes.

## Procedure

1. Build `STANDARDIZED_LOOP_HANDOFF` with `max_loop_iterations: 3`
2. Delegate **specloom-standardized-loop** via **specloom-implement**
3. On each `STANDARDIZED_LOOP_RESULT`:
   - If `status: pass` → return `VALIDATION_RESULT` with `confidence_score >= 99`
   - If `status: fail` and attempts < 3 → return remediation to implement → worker
   - If attempts = 3 → build `spec_validation_section`, return fail

## Aggregation

```
confidence_score = min(layer_scores.values())
```

99 = success threshold.

## Spec section on final fail

Generate markdown per **specloom-implement-protocol** → `## Validation Results` block.

Implement appends to spec file before stopping session.

## Findings merge

Deduplicate by `file + issue`. Sort: critical → major → minor.
