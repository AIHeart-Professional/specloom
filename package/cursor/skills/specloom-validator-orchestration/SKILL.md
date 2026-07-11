---
name: specloom-validator-orchestration
description: >-
  INTERNAL — specloom-validator only. Final validation after tests — impl + tests, sign-off, remediation routing.
  Not user-invokable.
disable-model-invocation: true
---

# Validator Orchestration

**Final gate** — runs **after specloom-tester** (`manifest.status: tests_passed`).

Validates **production implementation AND test suite** together. Owns **sign-off / archive**.

Load **specloom-remediation-routing** on fail.

## Preconditions

| manifest.status | Action |
|-----------------|--------|
| `tests_passed` | Proceed (happy path) |
| `validation_failed` | Proceed only if user re-runs after remediation |
| `awaiting_tests` | `no_work` — run `@specloom-tester` first |
| `in_progress` | `no_work` — run `@specloom-implement` first |
| `archived` | `no_work` |

## Procedure

1. Re-run test commands from spec **Validation** + `AGENTS.md` — confirm green + 100% coverage
2. Read `testing.md` / `manifest` test results — cross-check
3. Build `STANDARDIZED_LOOP_HANDOFF` with `max_loop_iterations: 3`
4. Delegate **specloom-standardized-loop** — domain validators on production files
5. Verify phase alignment (**specloom-phase-alignment**)
6. Aggregate:
   - `test_gate_pass` — suite green, coverage 100%
   - `impl_confidence = min(layer_scores)`
   - **Pass:** both test_gate_pass AND `impl_confidence >= 99`

## On pass

Apply **specloom-approval-mode** validator table:

- **auto:** `archive_spec` + `sync_knowledge` immediately
- **manual:** review card + `pendingSignOff`; archive on `/approve`

## On fail

1. Tag each finding with `owner:implement` or `owner:tester` per **specloom-remediation-routing**
2. Append `## Validation Results` to spec
3. `manifest.status: validation_failed`
4. Tell user which peer(s) to run next

After 3 loop iterations without pass → same fail path with full findings.

## Aggregation

```
confidence_score = min(layer_scores)  # production layers only
```

Test failures cap confidence at 0 regardless of layer scores.

## Draft mode (unchanged)

`validation_mode: draft` — feature/spec drafts via **specloom-work-creator-draft-validation**; no test prerequisite.
